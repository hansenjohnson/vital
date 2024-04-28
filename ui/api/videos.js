import { baseURL } from './config'

const getList = async () => {
  try {
    const response = await fetch(`${baseURL}/videos/file_names`)
    const data = await response.json()
    return data['videos']
  } catch (error) {
    console.error('Error getting videos:', error?.message || error)
    return []
  }
}

export default {
  getList,
}
