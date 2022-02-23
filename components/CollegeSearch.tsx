import { useEffect, useState } from 'react'
import type { CollegeApiResult } from '@/backend/db'
import College from '@/components/College'
import NumberInput from '@/components/NumberInput'
import { useDebouncedCallback } from 'use-debounce'

type CollegesResult = Array<CollegeApiResult> | 'loading' | { error: string }

export default function CollegeSearch() {
  const [mileRadius, setMileRadius] = useState(10)
  const [latitude, setLatitude] = useState<number | undefined>()
  const [longitude, setLongitude] = useState<number | undefined>()
  const [colleges, setColleges] = useState<CollegesResult>('loading')

  // on page load, prompt user for geolocation
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      // set location
      (position: GeolocationPosition) => {
        const { latitude, longitude } = position.coords
        setLatitude(latitude)
        setLongitude(longitude)
      },
      // set error
      (error: GeolocationPositionError) => setColleges({ error: error.message }),
    )
  }, [])

  // fetch colleges from the college api, whenever parameters change
  const fetchColleges = useDebouncedCallback(
    async () => {
      if (latitude === undefined || longitude === undefined) return
      const response = await fetch(`/api/college/?mileRadius=${mileRadius}&latitude=${latitude}&longitude=${longitude}`)
      if (response.ok) {
        const colleges = await response.json()
        setColleges(colleges)
      } else {
        setColleges({ error: response.statusText })
      }
    },
    // debounce by 500ms
    500,
  )
  useEffect(() => {
    fetchColleges()
    // reset to loading state when params change
    return () => setColleges('loading')
  }, [mileRadius, latitude, longitude])

  function renderColleges(): React.ReactNode {
    if (Array.isArray(colleges)) {
      return (
        <main className="flex flex-col gap-3">
          <p>{`${colleges.length} Nearest Colleges`}</p>
          {colleges.map((college, i) => (
            <College key={i} {...college} />
          ))}
        </main>
      )
    }
    if (typeof colleges === 'object') {
      return colleges.error
    }
    if (colleges === 'loading') {
      return 'loading...'
    }
  }

  return (
    <div className="w-screen h-screen flex flex-col gap-10 items-center">
      <header className="flex flex-col gap-3 mt-6" >
        <div >
          Colleges within
          <NumberInput autoFocus defaultValue={mileRadius} onChange={setMileRadius} />
          miles of
        </div>
        <div>
          Latitude:
          <NumberInput defaultValue={latitude} onChange={setLatitude} />
          Longitude:
          <NumberInput defaultValue={longitude} onChange={setLongitude} />
        </div>
      </header>
      {renderColleges()}
    </div>
  )
}
