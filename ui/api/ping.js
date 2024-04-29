import { baseURL } from './config'

const ping = async () => {
  try {
    const response = await fetch(`${baseURL}/ping`)
    if (response.status === 200) {
      return true
    }
    throw new Error(`Unexpected status code: ${response.status}`)
  } catch (error) {
    console.error(`Server Unreachable:`, error?.message || error)
    return false
  }
}

export default ping
