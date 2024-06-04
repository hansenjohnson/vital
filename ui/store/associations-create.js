import { valueSetter } from './utils'
import { getSelectedSighting, selectedSightingHasOverlap } from './sightings'

import linkagesAPI from '../api/linkages'
import thumbnailsAPI from '../api/thumbnails'

const initialState = {
  existingRegions: [],
  regionStart: null,
  regionEnd: null,
  annotations: [],
}

const createAssociationsCreateStore = (set, get) => ({
  ...initialState,
  resetAssociationsCreateStore: () => set(initialState),

  // == Region Actions ==
  setExistingRegions: valueSetter(set, 'existingRegions'),
  setRegionStart: valueSetter(set, 'regionStart'),
  setRegionEnd: valueSetter(set, 'regionEnd'),

  // == Annotation Actions ==
  setAnnotations: valueSetter(set, 'annotations'),

  // == Association Actions ==
  saveAssociation: async (thumbnailBlob) => {
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
      state.clearAssociation()
      return { existingRegions: [...state.existingRegions, newRegion] }
    })
  },

  clearAssociation: (clearAll = false) => {
    set({ regionStart: null, regionEnd: null, annotations: [] })
    if (clearAll) {
      set({ selectedSightingId: null })
    }
  },
})

const isSaveable = (state) => {
  if (state.regionStart == null) return false
  if (state.regionEnd == null) return false
  if (state.selectedSightingId == null) return false
  if (selectedSightingHasOverlap(state)) return false
  return true
}

export { isSaveable }
export default createAssociationsCreateStore
