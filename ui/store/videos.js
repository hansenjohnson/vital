import { valueSetter } from './utils'
import { transformVideoData, sortVideoData } from '../utilities/transformers'
import videosAPI from '../api/videos'

const initialState = {
  videos: [],
  activeVideoId: null,
  videoFrameNumber: 0,

  skipAutoSeek: false,
  autoPause: false,

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

  updateVideo: async (videoId, data) => {
    const statusCode = await videosAPI.update(videoId, data)
    if (statusCode === 409) {
      get().makeAlert(
        `Video update failed.
        It appears that you have the video data file open.
        Please close it before proceeding.`,
        'error'
      )
    }
  },

  setActiveVideo: (id) => set({ activeVideoId: id }),

  setVideoFrameNumber: valueSetter(set, 'videoFrameNumber'),

  setAutoPause: valueSetter(set, 'autoPause'),
  setSkipAutoSeek: valueSetter(set, 'skipAutoSeek'),

  triggerForceToHighestQuality: () =>
    set((state) => ({ forceQualityTriggerNumber: state.forceQualityTriggerNumber + 1 })),
})

const getActiveVideo = ({ videos, activeVideoId }) =>
  videos.find((video) => video.id === activeVideoId)


export { getActiveVideo }
export default createVideosStore
