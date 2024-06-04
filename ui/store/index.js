import { create } from 'zustand'

import ping from '../api/ping'
import ROUTES from '../constants/routes'
import { valueSetter } from './utils'

import createFoldersStore from './folders'
import createSightingsStore from './sightings'
import createVideosStore from './videos'
import createLinkagesStore from './linkages'

const useStore = create((set, get) => ({
  resetStore: () => {
    get().resetFoldersStore()
    get().resetSightingsStore()
    get().resetVideosStore()
    get().resetLinkagesStore()
  },

  serverReachable: 0,
  setServerReachable: valueSetter(set, 'serverReachable'),

  route: ROUTES.TOOLS,
  setRoute: valueSetter(set, 'route'),

  ...createFoldersStore(set, get),
  ...createSightingsStore(set, get),
  ...createVideosStore(set, get),
  ...createLinkagesStore(set, get),
}))

// We don't need to check for this from React since the app is unusable without it
const intervalId = setInterval(async () => {
  const pong = await ping()
  if (pong) {
    clearInterval(intervalId)
    useStore.getState().setServerReachable(true)
  }
}, 250)

export default useStore
