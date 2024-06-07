import { valueSetter } from './utils'
import { transformVideoData, sortVideoData } from '../utilities/transformers'
import videosAPI from '../api/videos'

const initialState = {
  videos: [],
  activeVideoId: null,
  activeVideoLoading: false,
  videoFrameNumber: 0,
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

  setActiveVideo: (id) => set({ activeVideoId: id, activeVideoLoading: true }),
  setActiveVideoLoading: valueSetter(set, 'activeVideoLoading'),

  setVideoFrameNumber: valueSetter(set, 'videoFrameNumber'),
})

const getActiveVideo = ({ videos, activeVideoId }) =>
  videos.find((video) => video.id === activeVideoId)

export { getActiveVideo }
export default createVideosStore
