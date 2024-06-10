import { valueSetter } from './utils'
import { transformFolderData, sortFolderData } from '../utilities/transformers'
import foldersAPI from '../api/folders'

const initialState = {
  folders: [],
  selectedFolderId: null,
}

const createFoldersStore = (set) => ({
  ...initialState,
  resetFoldersStore: () => set(initialState),

  loadFolders: async () => {
    const foldersData = await foldersAPI.getList()
    const transformedData = foldersData.map(transformFolderData)
    const sortedData = sortFolderData(transformedData)
    set({ folders: sortedData })
  },

  selectFolder: valueSetter(set, 'selectedFolderId'),
})

const getSelectedFolder = ({ folders, selectedFolderId }) =>
  folders.find((folder) => folder.id === selectedFolderId)

export { getSelectedFolder }
export default createFoldersStore
