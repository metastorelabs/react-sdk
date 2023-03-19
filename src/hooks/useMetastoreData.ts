import { useState, useEffect } from 'react'

type MetastoreData = {
  isMobile: boolean
  orientation: 'portrait' | 'landscape'
}

function useMetastoreData(): [MetastoreData | null, boolean] {
  const [data, setData] = useState<MetastoreData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== 'https://meta-store.in') return
      const { message, data } = event.data

      if (message === 'loaded') {
        window.parent.postMessage('getMetastoreData', 'https://meta-store.in')
      } else if (message === 'metastoreData') {
        setData(data)
        setLoading(false)
      }
    }

    window.addEventListener('message', handleMessage, false)

    return () => {
      window.removeEventListener('message', handleMessage, false)
    }
  }, [])

  return [data, loading]
}

export default useMetastoreData
