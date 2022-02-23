import { Knex, knex } from 'knex'
import collegeRecords from '../data/colleges.json'

function connect(): Knex {
  return knex({
    client: 'postgres',
    connection: {},
  })
}

async function defineSchema(db: Knex) {
  await db.schema
    .raw('CREATE EXTENSION IF NOT EXISTS postgis')
    .raw('DROP TABLE IF EXISTS college CASCADE')
    // prettier-ignore
    .raw(`
      CREATE TABLE college (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200),
        city VARCHAR(200),
        state VARCHAR(200),
        image_url VARCHAR(200),
        location geography(POINT, 4326)
      )
    `)
}

type RawCollegeRecord = {
  name: string
  address__city: string
  address__state: string
  address__longitude: number
  address__latitude: number
  image_url: string
}

type CollegeBase = {
  name: string
  city: string
  state: string
  image_url: string
}

type CollegeRecord = CollegeBase & {
  location: string
}

export type CollegeApiResult = CollegeBase & {
  distance: number
}

async function loadData(db: Knex) {
  const colleges: Array<CollegeRecord> = collegeRecords.map((college: RawCollegeRecord) => ({
    name: college.name,
    city: college.address__city,
    state: college.address__state,
    image_url: college.image_url,
    location: toGeographyPG({ longitude: college.address__longitude, latitude: college.address__latitude }),
  }))
  await db('college').insert(colleges)
}

export async function setupDatabase() {
  const db = connect()
  await defineSchema(db)
  await loadData(db)
}

export type Location = {
  latitude: number
  longitude: number
}

const toGeographyPG = ({ longitude, latitude }: Location): string => `SRID=4326;POINT(${longitude} ${latitude})`

export async function collegesCloseTo(
  origin: Location,
  mileRadius: number,
  limit: number,
): Promise<Array<CollegeApiResult>> {
  const db = connect()

  // PostGIS uses meters
  const metersInMile = 1609.34
  const originPG = toGeographyPG(origin)
  return db.with('college_distance', builder => 
    builder
      .select('*', db.raw('ST_Distance(?, location) / ? AS distance', [originPG, metersInMile]))
      .from('college')
  ).select('name','city','state','image_url', 'distance')
  .from('college_distance')
  .where('distance', '<=', mileRadius)
  .orderBy('distance', 'asc')
  .limit(limit)
}
