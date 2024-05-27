import linkagesAPI from '../api/linkages'
import thumbnailsAPI from '../api/thumbnails'
import { valueSetter } from './utils'
import { transformLinkageData, sortLinkageData } from '../utilities/transformers'
import { VIEW_MODES } from '../constants/routes'

const initialState = {
  viewYear: null,
  viewSuffix: null,
  linkages: [],
  viewMode: VIEW_MODES.BY_SIGHTING,
  linkageThumbnail: null,
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

  viewBySighting: () => set({ viewMode: VIEW_MODES.BY_SIGHTING }),
  viewByVideo: () => set({ viewMode: VIEW_MODES.BY_VIDEO }),

  setLinkageThumbnail: valueSetter(set, 'linkageThumbnail'),

  setActiveLinkage: (linkage) => {
    const {
      setVideoFolderId,
      setRegionStart,
      setRegionEnd,
      setAnnotations,
      selectSighting,
      setActiveVideo,
      setLinkageThumbnail,
      activeVideo,
    } = get()
    setRegionStart(linkage.regionStart)
    setRegionEnd(linkage.regionEnd)
    setAnnotations(linkage.annotations)
    selectSighting(linkage.sighting.id)
    setLinkageThumbnail(thumbnailsAPI.formulateHostedPath(linkage.thumbnail))

    setVideoFolderId(linkage.video.folderId)
    setActiveVideo(linkage.video, activeVideo && activeVideo.id === linkage.video.id)
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
