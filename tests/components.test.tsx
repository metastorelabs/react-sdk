import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

import { CloseButton } from '../src'

// component/CloseButton
describe('CloseButton component', () => {
  it('should render with children', () => {
    const { getByText } = render(<CloseButton>Close</CloseButton>)
    expect(getByText('Close')).toBeInTheDocument()
  })

  it('should post a message to the parent window when clicked', () => {
    const spy = jest.spyOn(window.parent, 'postMessage')
    const { getByText } = render(<CloseButton>Close</CloseButton>)
    fireEvent.click(getByText('Close'))
    expect(spy).toHaveBeenCalledWith({ event: 'closeGame' }, 'https://meta-store.in')
  })
})
