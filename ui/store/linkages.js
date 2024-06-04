import { valueSetter } from './utils'
import { getSelectedSighting, selectedSightingHasOverlap } from './sightings'
import { getSelectedFolder } from './folders'

import linkagesAPI from '../api/linkages'
import thumbnailsAPI from '../api/thumbnails'
import { transformLinkageData, sortLinkageData } from '../utilities/transformers'
import { LINKAGE_MODES } from '../constants/routes'

const initialState = {
  linkageMode: LINKAGE_MODES.BLANK,
  linkages: [],

  // Active Linkage being Created/Viewed/Edited
  activeLinkageId: null,
  regionStart: null,
  regionEnd: null,
  annotations: [],
}

const createLinkagesStore = (set, get) => ({
  ...initialState,
  resetLinkagesStore: () => set(initialState),

  setLinkageMode: valueSetter(set, 'linkageMode'),

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

  // == Core Linkage Actions ==
  setActiveLinkage: valueSetter(set, 'activeLinkageId'),
  setRegionStart: valueSetter(set, 'regionStart'),
  setRegionEnd: valueSetter(set, 'regionEnd'),
  setAnnotations: valueSetter(set, 'annotations'),

  saveLinkage: async (thumbnailBlob) => {
    const { sightings, selectedSightingId, activeVideo, regionStart, regionEnd, annotations } =
      get()
    const selectedSighting = getSelectedSighting({ sightings, selectedSightingId })

    const thumbnailPartialPath = thumbnailsAPI.formulateSavePath(
      selectedSightingId,
      selectedSighting.date,
      activeVideo.fileName,
      regionStart
    )
    const thumbnailStatus = await thumbnailsAPI.save(thumbnailPartialPath, thumbnailBlob)
    if (!thumbnailStatus) return

    const saveStatus = await linkagesAPI.create({
      CatalogVideoId: activeVideo.id,
      StartTime: regionStart,
      EndTime: regionEnd,
      SightingId: selectedSightingId,
      Annotation: annotations,
      ThumbnailFilePath: thumbnailPartialPath,
    })
    if (!saveStatus) return

    const newRegion = {
      letter: selectedSighting.letter,
      start: regionStart,
      end: regionEnd,
    }

    set((state) => {
      state.clearLinkage()
      return { existingRegions: [...state.existingRegions, newRegion] }
    })
  },

  clearLinkage: (clearAll = false) => {
    set({ regionStart: null, regionEnd: null, annotations: [] })
    if (clearAll) {
      set({ selectedSightingId: null })
    }
  },
})

const linkagesForActiveVideo = ({ activeVideoId, linkages }) =>
  linkages.filter((linkage) => linkage.video.id === activeVideoId)

const isSaveable = (state) => {
  if (state.regionStart == null) return false
  if (state.regionEnd == null) return false
  if (state.selectedSightingId == null) return false
  if (selectedSightingHasOverlap(state)) return false
  return true
}

export { linkagesForActiveVideo, isSaveable }
export default createLinkagesStore
