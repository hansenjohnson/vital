import { baseURL } from './config'
import { postBlobWithResponse } from './fetchers'
import { joinPath } from '../utilities/paths'

const formulatePath = (sightingId, sightingDate, videoFileName, regionStart, fileType = 'jpg') => {
  const nonAlphaNumeric = /[^a-zA-Z0-9\-_]/g
  const safeSightingId = sightingId.replace(nonAlphaNumeric, '_')
  const safeSightingDate = sightingDate.replace(nonAlphaNumeric, '_')
  const safeVideoFileName = videoFileName.replace(nonAlphaNumeric, '_')
  const safeRegionStart = regionStart.replace(nonAlphaNumeric, '_')
  const path = joinPath([
    safeSightingId,
    safeSightingDate,
    safeVideoFileName,
    `${safeRegionStart}.${fileType}`,
  ])
  return path
}

const save = async (filepathWithName, imageBlob) => {
  const safeFilepath = encodeURIComponent(filepathWithName)
  const response = await postBlobWithResponse(`${baseURL}/thumbnails/${safeFilepath}`, imageBlob)
  if (typeof response === 'string') {
    return response
  } else {
    console.error(response?.error || JSON.stringify(response))
    return null
  }
}

export default {
  formulatePath,
  save,
}
