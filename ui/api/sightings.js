import { baseURL } from './config'
import { getJSON } from './fetchers'

const get = (videoFolderName) => {
  const videoFolderNameParts = videoFolderName.split('-')
  const year = videoFolderNameParts.shift()
  const month = videoFolderNameParts.shift()
  const day = videoFolderNameParts.shift()
  const observerCode = videoFolderNameParts.join('-')

  return getJSON(
    `${baseURL}/sightings/date?year=${year}&month=${month}&day=${day}&observer_code=${observerCode}`
  )
}

const getList = () => {
  return getJSON(`${baseURL}/sightings`)
}

export default {
  get,
  getList,
}
