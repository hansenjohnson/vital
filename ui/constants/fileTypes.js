const ROOT_FOLDER = '__ROOT__'

const IMAGE_QUALITIES = {
  20: {
    compressionAmount: 'High',
    fileSize: 'Small',
  },
  50: {
    compressionAmount: 'Medium',
    fileSize: 'Medium',
  },
  90: {
    compressionAmount: 'Low',
    fileSize: 'Large',
  },
  100: {
    compressionAmount: 'No',
    fileSize: 'Largest',
  },
}

const BUCKET_THRESHOLDS = {
  small: 0,
  medium: 9_000_000,
  large: 36_000_000,
}

export { ROOT_FOLDER, IMAGE_QUALITIES, BUCKET_THRESHOLDS }
export default {
  EXCEL: 'excel',
  FOLDER: 'folder',
  FILE: 'file',
}
