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

export { ROOT_FOLDER, IMAGE_QUALITIES }
export default {
  EXCEL: 'excel',
  FOLDER: 'folder',
  FILE: 'file',
}
