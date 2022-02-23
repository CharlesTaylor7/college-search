// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CollegeApiResult, collegesCloseTo } from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = Array<CollegeApiResult>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log(req.query)

  const { latitude, longitude, mileRadius, limit } = req.query
  const location = {longitude: Number(longitude), latitude: Number(latitude)}
  const colleges = await collegesCloseTo(
    location, 
    Number(mileRadius), 
    limit ? Number(limit) : 10,
  )
  res.status(200).json(colleges)
}
