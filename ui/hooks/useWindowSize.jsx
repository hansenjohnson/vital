import { useState, useLayoutEffect } from 'react'

const useWindowSize = () => {
  const [size, setSize] = useState({
    windowWidth: null,
    windowHeight: null,
  })

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return size
}

export default useWindowSize
