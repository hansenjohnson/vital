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
ERRORS.set('WHITESPACE_ERROR', {
  message: 'filename starts or ends with a space',
  summary: 'Starts/Ends with space',
})
ERRORS.set('FILE_NOT_FOUND', {
  summary:
    'Folder not accessible. Potential reasons: the sub folder necessary to receive files not found; permission restrictions on existing folders; or lack of Internet or VPN',
})
ERRORS.set('WINDOWS_MAX_PATH_LENGTH_ERROR', {
  summary: 'Paths too long for Windows',
  message:
    'Some files within this folder have paths that are too long for Windows (256 characters). Please shorten them before proceeding.',
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
