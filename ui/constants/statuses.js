const WARNINGS = new Map()
WARNINGS.set('MEDIA_PATH_WARNING', {
  message: 'this is a nested folder',
  summary: 'Nested folder',
  groupLevel: true,
})
WARNINGS.set('INCORRECT_CREATED_TIME', {
  message: 'file date does not match source folder',
  summary: 'File/Folder date mismatch',
})
WARNINGS.set('FILE_EXISTS_WARNING', {
  message: 'will overwrite existing file',
  summary: 'Overwriting Files',
})

const ERRORS = new Map()
ERRORS.set('MEDIA_PATH_ERROR', {
  message: 'subfolder is too deeply nested',
  summary: 'Subfolder too deep',
  groupLevel: true,
})
ERRORS.set('LENGTH_ERROR', {
  message: 'filename is too long',
  summary: 'Filename too long',
})
ERRORS.set('FILE_NOT_FOUND', {
  summary: 'Folder access denied due to lack of Internet, VPN, Permissions, or it was Deleted',
})

const PROGRESS_MESSAGES = {
  TRANSCODING: 'TRANSCODING',
  COPYING: 'COPYING',
  DATA_ENTRY: 'DATA_ENTRY',
}

export { WARNINGS, ERRORS, PROGRESS_MESSAGES }
export default {
  LOADING: 'LOADING',
  QUEUED: 'QUEUED',
  INCOMPLETE: 'INCOMPLETE',
  COMPLETED: 'COMPLETED',
  SUCCESS: 'SUCCESS',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
}
