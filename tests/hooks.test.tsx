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

  it('should initialize with null data and loading true', () => {
    const { result } = renderHook(() => useMetastoreData())
    expect(result.current[0]).toBeNull()
    expect(result.current[1]).toBe(true)
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

    expect(result.current[0]).toEqual(mockData)
    expect(result.current[1]).toBe(false)
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

    expect(result.current[0]).toBeNull()
    expect(result.current[1]).toBe(true)
  })
})
