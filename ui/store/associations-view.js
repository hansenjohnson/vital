import { valueSetter } from './utils'

const initialState = {
  viewYear: null,
  viewSuffix: null,
}

const createAssociationsViewStore = (set) => ({
  ...initialState,
  resetAssociationsViewStore: () => set(initialState),

  setViewYear: valueSetter(set, 'viewYear'),
  setViewSuffix: valueSetter(set, 'viewSuffix'),
})

const getViewSuffix = (sighting) => `${sighting.month}-${sighting.day} ${sighting.observer}`

export { getViewSuffix }
export default createAssociationsViewStore
