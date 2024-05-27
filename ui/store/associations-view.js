import linkagesAPI from '../api/linkages'
import { valueSetter } from './utils'
import { transformLinkageData, sortLinkageData } from '../utilities/transformers'

const initialState = {
  viewYear: null,
  viewSuffix: null,
  linkages: [],
}

const createAssociationsViewStore = (set, get) => ({
  ...initialState,
  resetAssociationsViewStore: () => set(initialState),

  setViewYear: valueSetter(set, 'viewYear'),
  setViewSuffix: valueSetter(set, 'viewSuffix'),

  loadLinkages: async () => {
    const { viewYear, viewSuffix } = get()
    if (viewYear == null || viewSuffix == null) return
    const { month, day, observer } = getViewParamsFromSuffix(viewSuffix)

    const linkageData = await linkagesAPI.bySighting(viewYear, month, day, observer)
    const transformedData = linkageData.map(transformLinkageData)
    const sortedData = sortLinkageData(transformedData)
    set({ linkages: sortedData })
  },
})

const getViewSuffix = (sighting) => `${sighting.month}-${sighting.day} ${sighting.observer}`
const getViewParamsFromSuffix = (suffix) => {
  const month = suffix.substring(0, 2)
  const day = suffix.substring(3, 5)
  const observer = suffix.substring(6)
  return { month, day, observer }
}

export { getViewSuffix }
export default createAssociationsViewStore
