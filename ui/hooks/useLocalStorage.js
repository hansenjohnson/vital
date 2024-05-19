import { useState, useCallback, useEffect } from 'react'

const setLocalStorageItem = (key, value) => {
  const stringifiedValue = JSON.stringify(value)
  window.localStorage.setItem(key, stringifiedValue)
}

const removeLocalStorageItem = (key) => {
  window.localStorage.removeItem(key)
}

const getLocalStorageItem = (key) => {
  const value = window.localStorage.getItem(key)
  return value && JSON.parse(value)
}

const useLocalStorage = (key, initialValue) => {
  const [mirroredValue, setMirroredValue] = useState(getLocalStorageItem(key))

  const setState = useCallback(
    (nextState) => {
      try {
        if (nextState === undefined) {
          removeLocalStorageItem(key)
          setMirroredValue(null)
        } else {
          setLocalStorageItem(key, nextState)
          setMirroredValue(nextState)
        }
      } catch (e) {
        console.warn(e)
      }
    },
    [key]
  )

  useEffect(() => {
    if (getLocalStorageItem(key) === null && initialValue !== undefined) {
      setLocalStorageItem(key, initialValue)
      setMirroredValue(initialValue)
    }
  }, [key, initialValue])

  return [mirroredValue, setState]
}

export default useLocalStorage
