import { baseURL } from './config'
import { postJSON } from './fetchers'

const create = (videoId, fileName, timestamp) =>
  postJSON(`${baseURL}/still_exports`, {
    CatalogVideoId: videoId,
    FileName: fileName,
    Timestamp: timestamp,
    CreatedDate: `${new Date()}`,
  })

export default {
  create,
}
