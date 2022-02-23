import type { CollegeApiResult } from '@/backend/db'
import Image from 'next/image'

export default function College(props: CollegeApiResult) {
  const { name, city, state, distance, image_url } = props
  return (
    <div className="flex">
      <Image className="rounded m-3" height="150px" width="150px" src={image_url} />
      <div className="flex flex-col justify-center p-3">
        <p>{name}</p>
        <p>
          {city}, {state}
        </p>
        <p>{distance.toFixed(1)} miles</p>
      </div>
    </div>
  )
}
