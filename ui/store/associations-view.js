import { valueSetter } from './utils'

const initialState = {
  // viewYear: null,
  viewYear: '2021',
  // viewSuffix: null,
  viewSuffix: '07-18 CWR',
}

const createAssociationsViewStore = (set) => ({
  ...initialState,
  resetAssociationsViewStore: () => set(initialState),

  setViewYear: valueSetter(set, 'viewYear'),
  setViewSuffix: valueSetter(set, 'viewSuffix'),
})

export default createAssociationsViewStore
