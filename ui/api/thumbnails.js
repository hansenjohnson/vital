import { baseURL } from './config'
import { postBlob } from './fetchers'
import { leafPath, joinPath } from '../utilities/paths'
import { catalogFolderString } from '../utilities/strings'

const formulateSavePath = (catalogFolder, videoFileName, fileType = 'jpg') => {
  const catalogFolderName = catalogFolderString(catalogFolder)
  const nonAlphaNumeric = /[^a-zA-Z0-9\-_]/g
  const safeVideoFileName = `${leafPath(videoFileName)}`.replace(nonAlphaNumeric, '_')
  const semiUniqueId = `${Date.now()}`
  const path = joinPath([catalogFolderName, safeVideoFileName, `${semiUniqueId}.${fileType}`])
  return path
}

const formulateHostedPath = (partialPath) =>
  `${baseURL}/thumbnails/${encodeURIComponent(partialPath)}`

const save = async (filepathWithName, imageBlob) => {
  const safeFilepath = encodeURIComponent(filepathWithName)
  return await postBlob(`${baseURL}/thumbnails/${safeFilepath}`, imageBlob)
}

export default {
  formulateSavePath,
  formulateHostedPath,
  save,
}
