import { renderHook, act } from '@testing-library/react'
import { useMetastoreData } from '../src'

// hooks/useMetastoreData
describe('useMetastoreData', () => {
  it('should return null initially', () => {
    const { result } = renderHook(() => useMetastoreData())
    expect(result.current[0]).toBeNull()
    expect(result.current[1]).toBe(true)
  })

  it('should update data when a message is received', () => {
    const { result } = renderHook(() => useMetastoreData())

    const mockData = { isMobile: true, orientation: 'portrait' }
    const messageEvent = new MessageEvent('message', {
      data: mockData,
      origin: 'https://meta-store.in',
    })
    act(() => {
      window.dispatchEvent(messageEvent)
    })

    expect(result.current[0]).toEqual(mockData)
    expect(result.current[1]).toBe(false)
  })

  it('should update data when a new message is received', () => {
    const { result } = renderHook(() => useMetastoreData())

    // Send the first message
    const mockData1 = { isMobile: true, orientation: 'landscape' }
    const messageEvent1 = new MessageEvent('message', {
      origin: 'https://meta-store.in',
      data: mockData1,
    })

    act(() => {
      window.dispatchEvent(messageEvent1)
    })

    expect(result.current[0]).toEqual(mockData1)
    expect(result.current[1]).toBe(false)

    // Send the second message
    const mockData2 = { isMobile: false, orientation: 'portrait' }
    const messageEvent2 = new MessageEvent('message', {
      origin: 'https://meta-store.in',
      data: mockData2,
    })

    act(() => {
      window.dispatchEvent(messageEvent2)
    })

    expect(result.current[0]).toEqual(mockData2)
    expect(result.current[1]).toBe(false)
  })

  it('should not update data when a message is received from a different origin', () => {
    const { result } = renderHook(() => useMetastoreData())

    const mockData = { isMobile: true, orientation: 'portrait' }
    const messageEvent = new MessageEvent('message', {
      data: mockData,
      origin: 'https://example.com',
    })
    act(() => {
      window.dispatchEvent(messageEvent)
    })

    expect(result.current[0]).toBeNull()
    expect(result.current[1]).toBe(true)
  })
})
