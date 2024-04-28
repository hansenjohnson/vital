import { baseURL } from './config'

const getList = async () => {
  try {
    const response = await fetch(`${baseURL}/videos/file_names`)
    const videos = await response.json()
    return videos['videos']
  } catch (error) {
    console.error('Error getting videos:', error?.message || error)
    return null
  }
}

export default {
  getList,
}
