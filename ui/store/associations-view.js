import linkagesAPI from '../api/linkages'
import thumbnailsAPI from '../api/thumbnails'
import { valueSetter } from './utils'
import { transformLinkageData, sortLinkageData } from '../utilities/transformers'
import { VIEW_MODES } from '../constants/routes'
import { getSelectedFolder } from './folders'

const initialState = {
  linkages: [],
  viewMode: VIEW_MODES.BY_VIDEO,
  activeLinkageId: null,
  linkageThumbnail: null,
  linkageVideoFrameRate: null,
}

const createAssociationsViewStore = (set, get) => ({
  ...initialState,
  resetAssociationsViewStore: () => set(initialState),

  loadLinkages: async () => {
    const selectedFolder = getSelectedFolder(get())
    const linkageData = await linkagesAPI.byFolder(
      selectedFolder.year,
      selectedFolder.month,
      selectedFolder.day,
      selectedFolder.observer
    )
    const transformedData = linkageData.map(transformLinkageData)
    const sortedData = sortLinkageData(transformedData)
    set({ linkages: sortedData })
  },

  deleteLinkage: async (linkageId) => {
    const success = await linkagesAPI.deleteLinkage(linkageId)
    if (success) {
      const { loadLinkages, clearActiveLinkage } = get()
      clearActiveLinkage()
      loadLinkages()
    }
  },

  viewBySighting: () => set({ viewMode: VIEW_MODES.BY_SIGHTING }),
  viewByVideo: () => set({ viewMode: VIEW_MODES.BY_VIDEO }),

  setActiveLinkageId: valueSetter(set, 'activeLinkageId'),
  setLinkageThumbnail: valueSetter(set, 'linkageThumbnail'),
  setLinkageVideoFrameRate: valueSetter(set, 'linkageVideoFrameRate'),

  setActiveLinkage: (linkage) => {
    const {
      setActiveLinkageId,
      selectFolder,
      setRegionStart,
      setRegionEnd,
      setAnnotations,
      selectSighting,
      // setActiveVideo,
      setLinkageThumbnail,
      setLinkageVideoFrameRate,
      activeVideo,
      linkages,
      setExistingRegions,
    } = get()
    setActiveLinkageId(linkage.id)
    setRegionStart(linkage.regionStart)
    setRegionEnd(linkage.regionEnd)
    setAnnotations(linkage.annotations)
    selectSighting(linkage.sighting.id)
    setLinkageThumbnail(thumbnailsAPI.formulateHostedPath(linkage.thumbnail))

    const allLinkageRegionsForThisVideo = linkages
      .filter((another) => another.video.id === linkage.video.id)
      .map((another) => ({
        letter: another.sighting.letter,
        start: another.regionStart,
        end: another.regionEnd,
      }))
    setExistingRegions(allLinkageRegionsForThisVideo)

    selectFolder(linkage.video.folderId)
    setLinkageVideoFrameRate(linkage.video.frameRate)
    // setActiveVideo(linkage.video, activeVideo && activeVideo.id === linkage.video.id)
  },

  clearActiveLinkage: () => {
    const {
      setActiveLinkageId,
      setRegionStart,
      setRegionEnd,
      setAnnotations,
      selectSighting,
      // setActiveVideo,
      setLinkageThumbnail,
      setLinkageVideoFrameRate,
    } = get()
    setActiveLinkageId(null)
    setRegionStart(null)
    setRegionEnd(null)
    setAnnotations(null)
    selectSighting(null)
    setLinkageThumbnail(null)
    setLinkageVideoFrameRate(null)
    // setActiveVideo(null, true)
  },
})

export default createAssociationsViewStore
