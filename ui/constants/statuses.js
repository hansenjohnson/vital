const WARNINGS = new Map()
WARNINGS.set('VIDEO_PATH_WARNING', {
  message: 'warning - this is a nested folder',
  summary: 'Nested folder',
})
WARNINGS.set('INCORRECT_CREATED_TIME', {
  message: 'file date does not match source folder',
  summary: 'File/Folder date mismatch',
})

const ERRORS = new Map()
ERRORS.set('VIDEO_PATH_ERROR', {
  message: 'error - subfolder is too deeply nested',
  summary: 'Subfolder too deep',
})
ERRORS.set('LENGTH_ERROR', {
  message: 'filename is too long',
  summary: 'Filename too long',
})

export { WARNINGS, ERRORS }
export default {
  LOADING: 'loading',
  PENDING: 'pending',
  COMPLETED: 'completed',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
}
