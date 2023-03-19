/* eslint-disable @typescript-eslint/no-empty-function */
import { useState, useEffect } from 'react'

type MetastoreData = {
  isMobile: boolean
  orientation: 'portrait' | 'landscape'
}

function useMetastoreData(): { data: MetastoreData | null; loading: boolean; isMetastore: boolean } {
  const [data, setData] = useState<MetastoreData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isMetastore, setIsMetastore] = useState<boolean>(false)

  useEffect(() => {
    const inIframe = window.self !== window.top
    const referrer = document.referrer
    const isMetaStore = referrer.includes('https://meta-store.in') && inIframe

    setIsMetastore(isMetaStore)

    if (isMetaStore) {
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
    } else {
      setLoading(false)
      return () => {}
    }
  }, [])

  return { data, loading, isMetastore }
}

export default useMetastoreData
