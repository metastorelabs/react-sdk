import { renderHook, act } from '@testing-library/react'
import { useMetastoreData } from '../src'

// hooks/useMetastoreData
describe('useMetastoreData', () => {
  it('should return null initially', () => {
    const { result } = renderHook(() => useMetastoreData())
    expect(result.current).toBeNull()
  })

  it('should update data when a message is received', () => {
    const { result } = renderHook(() => useMetastoreData())

    const mockData = { isMobile: true, orientation: 'landscape' }
    const event = new MessageEvent('message', {
      origin: 'https://meta-store.in',
      data: mockData,
    })

    act(() => {
      window.dispatchEvent(event)
    })

    expect(result.current).toEqual(mockData)
  })

  it('should update data when a new message is received', () => {
    const { result } = renderHook(() => useMetastoreData())

    // Send the first message
    const mockData1 = { isMobile: true, orientation: 'landscape' }
    const event1 = new MessageEvent('message', {
      origin: 'https://meta-store.in',
      data: mockData1,
    })

    act(() => {
      window.dispatchEvent(event1)
    })

    expect(result.current).toEqual(mockData1)

    // Send the second message
    const mockData2 = { isMobile: false, orientation: 'portrait' }
    const event2 = new MessageEvent('message', {
      origin: 'https://meta-store.in',
      data: mockData2,
    })

    act(() => {
      window.dispatchEvent(event2)
    })

    expect(result.current).toEqual(mockData2)
  })

  it('should not update data when a message is received from a different origin', () => {
    const { result } = renderHook(() => useMetastoreData())

    const mockData = { isMobile: true, orientation: 'landscape' }
    const event = new MessageEvent('message', {
      origin: 'https://other-website.com',
      data: mockData,
    })

    act(() => {
      window.dispatchEvent(event)
    })

    expect(result.current).toBeNull()
  })
})
