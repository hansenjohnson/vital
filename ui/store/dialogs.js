import { valueSetter } from './utils'

const initialState = {
  exportStillDialogOpen: false,
  exportStillPreviewImage: null,
  regionEditDialog: false,
}

const createDialogStore = (set) => ({
  ...initialState,
  resetDialogStore: () => set(initialState),

  setExportStillDialogOpen: valueSetter(set, 'exportStillDialogOpen'),
  setExportStillPreviewImage: valueSetter(set, 'exportStillPreviewImage'),

  setRegionEditDialog: valueSetter(set, 'regionEditDialog'),
  clearEditDialogs: () => set({ regionEditDialog: false }),
})

export default createDialogStore
