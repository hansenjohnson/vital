import { valueSetter } from './utils'

const initialState = {
  exportStillDialogOpen: false,
  exportStillPreviewImage: null,
  regionEditDialog: false,
}

const createDialogsStore = (set) => ({
  ...initialState,
  resetDialogsStore: () => set(initialState),

  setExportStillDialogOpen: valueSetter(set, 'exportStillDialogOpen'),
  setExportStillPreviewImage: valueSetter(set, 'exportStillPreviewImage'),

  setRegionEditDialog: valueSetter(set, 'regionEditDialog'),
  clearEditDialogs: () => set({ regionEditDialog: false }),
})

export default createDialogsStore
