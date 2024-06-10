import { valueSetter } from './utils'

const initialState = {
  exportStillDialogOpen: false,
  exportStillPreviewImage: null,
  regionEditDialog: false,
  confirmationDialogOpen: false,
  confirmationDialogProps: null,
}

const createDialogsStore = (set) => ({
  ...initialState,
  resetDialogsStore: () => set(initialState),

  setExportStillDialogOpen: valueSetter(set, 'exportStillDialogOpen'),
  setExportStillPreviewImage: valueSetter(set, 'exportStillPreviewImage'),

  setRegionEditDialog: valueSetter(set, 'regionEditDialog'),
  clearEditDialogs: () => set({ regionEditDialog: false }),

  setConfirmationDialogOpen: valueSetter(set, 'confirmationDialogOpen'),
  setConfirmationDialogProps: valueSetter(set, 'confirmationDialogProps'),
})

export default createDialogsStore
