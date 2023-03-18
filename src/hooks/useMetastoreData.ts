import { useState } from 'react'

type MetastoreData = {
  isMobile: boolean
  orientation: 'portrait' | 'landscape'
}

function useMetastoreData(): [MetastoreData | null, boolean] {
  const [data, setData] = useState<MetastoreData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  window.addEventListener(
    'message',
    (event) => {
      if (event.origin !== 'https://meta-store.in') return

      const { data } = event
      setData(data)
      setLoading(false)
    },
    false,
  )

  return [data, loading]
}

export default useMetastoreData
