import { valueSetter } from './utils'
import { transformVideoData } from '../utilities/transformers'
import { getSelectedSighting, selectedSightingHasOverlap } from './sightings'

import videosAPI from '../api/videos'
import linkagesAPI from '../api/linkages'
import thumbnailsAPI from '../api/thumbnails'
import { baseURL } from '../api/config'

const initialState = {
  videoFolderId: null,
  videoFolderName: null,
  activeVideo: null,
  activeVideoLoading: false,
  remainingVideos: [],
  completedVideos: [],
  existingRegions: [],
  regionStart: null,
  regionEnd: null,
  annotations: [],
}

const createAssociationsCreateStore = (set, get) => ({
  ...initialState,
  resetAssociationsCreateStore: () => set(initialState),

  // TODO: store catalog folders at this level and turn videoFolderName
  // into a computed value
  setVideoFolderId: valueSetter(set, 'videoFolderId'),
  setVideoFolderName: valueSetter(set, 'videoFolderName'),

  // == Video Actions ==
  setActiveVideoLoading: valueSetter(set, 'activeVideoLoading'),
  setActiveVideo: (nextVideo) => set({ activeVideo: nextVideo, activeVideoLoading: true }),
  setRemainingVideos: valueSetter(set, 'remainingVideos'),
  setCompletedVideos: valueSetter(set, 'completedVideos'),
  // TODO: store videos as state and eliminate remaining/completed concepts
  loadVideos: async (videoFolderId) => {
    const videoRows = await videosAPI.getList(videoFolderId)
    const videos = videoRows.map(transformVideoData)
    const [firstVideo, ...nonFirstVideos] = videos
    set({ activeVideo: firstVideo, activeVideoLoading: true, remainingVideos: nonFirstVideos })
  },
  nextVideo: () => {
    const { activeVideo, remainingVideos } = get()
    if (activeVideo) {
      set((state) => ({ completedVideos: [...state.completedVideos, activeVideo] }))
    }
    if (remainingVideos.length === 0) {
      set({ activeVideo: null })
      return
    }
    set((state) => {
      state.clearAssociation(true)
      return {
        activeVideo: state.remainingVideos[0],
        remainingVideos: state.remainingVideos.slice(1),
        existingRegions: [],
      }
    })
  },

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
      CreatedDate: `${new Date()}`,
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

const getActiveVideoURL = (state) =>
  state.activeVideo ? `${baseURL}/videos/${state.videoFolderId}/${state.activeVideo.fileName}` : ''

const isSaveable = (state) => {
  if (state.regionStart == null) return false
  if (state.regionEnd == null) return false
  if (state.selectedSightingId == null) return false
  if (selectedSightingHasOverlap(state)) return false
  return true
}

export { getActiveVideoURL, isSaveable }
export default createAssociationsCreateStore
