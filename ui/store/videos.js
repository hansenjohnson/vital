import { valueSetter } from './utils'
import { transformVideoData, sortVideoData } from '../utilities/transformers'
import videosAPI from '../api/videos'
import { baseURL } from '../api/config'

const initialState = {
  videos: [],
  activeVideoId: null,
  activeVideoLoading: false,
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
})

const getActiveVideo = ({ videos, activeVideoId }) =>
  videos.find((video) => video.id === activeVideoId)

const getActiveVideoURL = (state) => {
  const activeVideo = getActiveVideo(state)
  const { selectedFolderId } = state
  return activeVideo ? `${baseURL}/videos/${selectedFolderId}/${activeVideo.fileName}` : ''
}

export { getActiveVideo, getActiveVideoURL }
export default createVideosStore
