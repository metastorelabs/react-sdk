import { useState } from 'react'

type MetastoreData = {
  isMobile: boolean
  orientation: 'portrait' | 'landscape'
}

function useMetastoreData(): MetastoreData | null {
  const [data, setData] = useState<MetastoreData | null>(null)

  window.addEventListener(
    'message',
    (event) => {
      if (event.origin !== 'https://meta-store.in') return

      const { data } = event
      setData(data)
    },
    false,
  )

  return data
}

export default useMetastoreData
