import { baseURL } from './config'
import { getJSON, postJSONWithResponse, putJson } from "./fetchers";

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

const update = (id, data) => putJson(`${baseURL}/videos/${id}`, data)

export default {
  getVideoURL,
  getList,
  getVideoPath,
  update,
}
