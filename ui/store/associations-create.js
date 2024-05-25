import { valueSetter } from './utils'

const createAssociationsCreateStore = (set) => ({
  videoFolderId: null,
  videoFolderName: null,
  setVideoFolderId: valueSetter(set, 'videoFolderId'),
  setVideoFolderName: valueSetter(set, 'videoFolderName'),
})

export default createAssociationsCreateStore
