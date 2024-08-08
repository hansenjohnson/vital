const WARNING_MESSAGES = {
  VIDEO_PATH_WARNING: 'warning - this is a nested folder',
  INCORRECT_CREATED_TIME: 'file date does not match source folder',
}

const ERROR_MESSAGES = {
  LENGTH_ERROR: 'filename is too long',
  VIDEO_PATH_ERROR: 'error - subfolder is too deeply nested',
}

export { WARNING_MESSAGES, ERROR_MESSAGES }
export default {
  LOADING: 'loading',
  PENDING: 'pending',
  COMPLETED: 'completed',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
}
