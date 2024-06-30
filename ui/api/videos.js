import { baseURL } from './config'
import { getJSON } from './fetchers'

const getVideoURL = (selectedFolderId, videoFileName) =>
  `${baseURL}/videos/${selectedFolderId}/${videoFileName}`

const getList = async (catalogFolderId) => {
  const data = await getJSON(`${baseURL}/videos/folders/${catalogFolderId}`)

  return data ? data['videos'] : []
}

const getVideoPath = async (videoId) => {
  const data = await getJSON(`${baseURL}/videos/path/${videoId}`)
  return data?.file_path
}

export default {
  getVideoURL,
  getList,
  getVideoPath,
}
