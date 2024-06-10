import { valueSetter } from './utils'
import { transformVideoData, sortVideoData } from '../utilities/transformers'
import videosAPI from '../api/videos'

const initialState = {
  videos: [],
  activeVideoId: null,
  videoFrameNumber: 0,

  forceQualityTriggerNumber: 0,
}

const createVideosStore = (set, get) => ({
  ...initialState,
  resetVideosStore: () => set(initialState),

  loadVideos: async () => {
    const { selectedFolderId } = get()
    const videoData = await videosAPI.getList(selectedFolderId)
    const transformedData = videoData.map(transformVideoData)
    const sortedData = sortVideoData(transformedData)
    set({ videos: sortedData })
  },

  setActiveVideo: (id) => set({ activeVideoId: id }),

  setVideoFrameNumber: valueSetter(set, 'videoFrameNumber'),

  triggerForceToHighestQuality: () =>
    set((state) => ({ forceQualityTriggerNumber: state.forceQualityTriggerNumber + 1 })),
})

const getActiveVideo = ({ videos, activeVideoId }) =>
  videos.find((video) => video.id === activeVideoId)

export { getActiveVideo }
export default createVideosStore
