import React from 'react'

type CloseButtonProps = {
  children: React.ReactNode
}

const CloseButton = ({ children }: CloseButtonProps) => {
  const handleClose = () => {
    window.parent.postMessage({ event: 'closeGame' }, 'https://meta-store.in')
  }

  return <div onClick={handleClose}>{children}</div>
}

export default CloseButton
