import { valueSetter } from './utils'

const initialState = {
  exportStillDialogOpen: false,
  exportStillPreviewImage: null,
}

const createDialogStore = (set) => ({
  ...initialState,
  resetDialogStore: () => set(initialState),

  setExportStillDialogOpen: valueSetter(set, 'exportStillDialogOpen'),
  setExportStillPreviewImage: valueSetter(set, 'exportStillPreviewImage'),
})

export default createDialogStore
