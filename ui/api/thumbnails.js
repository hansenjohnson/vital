import { baseURL } from './config'
import { postBlob } from './fetchers'
import { joinPath } from '../utilities/paths'

const formulatePath = (sightingId, sightingDate, videoFileName, regionStart, fileType = 'jpg') => {
  const nonAlphaNumeric = /[^a-zA-Z0-9\-_]/g
  const safeSightingId = `${sightingId}`.replace(nonAlphaNumeric, '_')
  const safeSightingDate = `${sightingDate}`.replace(nonAlphaNumeric, '_')
  const safeVideoFileName = `${videoFileName}`.replace(nonAlphaNumeric, '_')
  const safeRegionStart = `${regionStart}`.replace(nonAlphaNumeric, '_')
  const path = joinPath([
    safeSightingDate,
    safeSightingId,
    safeVideoFileName,
    `${safeRegionStart}.${fileType}`,
  ])
  return path
}

const save = async (filepathWithName, imageBlob) => {
  const safeFilepath = encodeURIComponent(filepathWithName)
  return await postBlob(`${baseURL}/thumbnails/${safeFilepath}`, imageBlob)
}

export default {
  formulatePath,
  save,
}
