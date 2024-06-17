import { baseURL } from './config'
import { postJSON } from './fetchers'

const create = (videoId, fileName, frameNumber, sightingId) =>
  postJSON(`${baseURL}/still_exports`, {
    CatalogVideoId: videoId,
    FileName: fileName,
    FrameNumber: frameNumber,
    SightingId: sightingId,
  })

export default {
  create,
}
