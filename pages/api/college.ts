// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CollegeApiResult, collegesCloseTo } from '@/backend/db'
import type { NextApiRequest, NextApiResponse } from 'next'
import colleges from '@/fake-data/colleges.json'

type Data = Array<CollegeApiResult>

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { latitude, longitude, mileRadius, limit } = req.query
  console.log(req.query)
  /*
  const colleges = await collegesCloseTo(
    {longitude: Number(longitude), latitude: Number(latitude)}, 
    Number(mileRadius), 
    Number(limit)
  );
  */
  res.status(200).json(colleges)
}
