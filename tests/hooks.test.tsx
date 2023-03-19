import { renderHook, act } from '@testing-library/react'
import { useMetastoreData } from '../src'

// hooks/useMetastoreData
describe('useMetastoreData', () => {
  const mockData = {
    isMobile: true,
    orientation: 'portrait',
  }

  beforeAll(() => {
    window.parent.postMessage = jest.fn()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return loading=false and isMetastore=false when not loaded in iframe', () => {
    const { result } = renderHook(() => useMetastoreData())
    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(false)
    expect(result.current.isMetastore).toBe(false)
  })

  it('should return isMetastore=true and loading=true when loaded in iframe from meta-store.in', () => {
    Object.defineProperty(window, 'self', { value: { location: { href: 'https://example.com' } } })
    Object.defineProperty(window, 'top', { value: { location: { href: 'https://meta-store.in' } } })
    Object.defineProperty(document, 'referrer', { value: 'https://meta-store.in' })

    const { result } = renderHook(() => useMetastoreData())
    expect(result.current.isMetastore).toBe(true)
    expect(result.current.loading).toBe(true)
  })

  it('should listen to message event on mount and unmount', () => {
    const addEventListenerMock = jest.spyOn(window, 'addEventListener')
    const removeEventListenerMock = jest.spyOn(window, 'removeEventListener')

    const { unmount } = renderHook(() => useMetastoreData())
    expect(addEventListenerMock).toHaveBeenCalledTimes(1)
    expect(addEventListenerMock).toHaveBeenCalledWith('message', expect.any(Function), false)
    expect(removeEventListenerMock).toHaveBeenCalledTimes(0)

    // Clean up
    unmount()
    expect(removeEventListenerMock).toHaveBeenCalledTimes(1)
    expect(removeEventListenerMock).toHaveBeenCalledWith('message', expect.any(Function), false)

    addEventListenerMock.mockRestore()
    removeEventListenerMock.mockRestore()
  })

  it('should send "getMetastoreData" message when "loaded" message is received', () => {
    renderHook(() => useMetastoreData())

    const messageEvent = new MessageEvent('message', {
      data: {
        message: 'loaded',
      },
      origin: 'https://meta-store.in',
    })
    window.dispatchEvent(messageEvent)

    expect(window.parent.postMessage).toHaveBeenCalledTimes(1)
    expect(window.parent.postMessage).toHaveBeenCalledWith('getMetastoreData', 'https://meta-store.in')
  })

  it('should update data and set loading to false when "metastoreData" message is received', () => {
    const { result } = renderHook(() => useMetastoreData())

    const messageEvent = new MessageEvent('message', {
      data: {
        message: 'metastoreData',
        data: mockData,
      },
      origin: 'https://meta-store.in',
    })
    act(() => {
      window.dispatchEvent(messageEvent)
    })

    expect(result.current.data).toEqual(mockData)
    expect(result.current.loading).toBe(false)
    expect(result.current.isMetastore).toBe(true)
  })

  it('should ignore messages from other origins', () => {
    const { result } = renderHook(() => useMetastoreData())

    const messageEvent = new MessageEvent('message', {
      data: {
        message: 'metastoreData',
        data: mockData,
      },
      origin: 'https://example.com',
    })
    window.dispatchEvent(messageEvent)

    expect(result.current.data).toBeNull()
    expect(result.current.loading).toBe(true)
    expect(result.current.isMetastore).toBe(true)
  })
})
