import { baseURL } from './config'
import { getJSON } from './fetchers'

const get = (videoFolderName) => {
  const videoFolderNameParts = videoFolderName.split('-')
  const year = videoFolderNameParts[0]
  const month = videoFolderNameParts[1]
  const day = videoFolderNameParts[2]
  const observerCode = videoFolderNameParts[3]

  return getJSON(`${baseURL}/sightings/date?year=${year}&month=${month}&day=${day}&observer_code=${observerCode}`)
}

export default {
  get,
}
