import { create } from 'zustand'

import ping from '../api/ping'
import ROUTES from '../constants/routes'
import { valueSetter } from './utils'

import createAssociationsViewStore from './associations-view'
import createAssociationsCreateStore from './associations-create'
import createFoldersStore from './folders'
import createSightingsStore from './sightings'
import createVideosStore from './videos'

const useStore = create((set, get) => ({
  resetStore: () => {
    get().resetAssociationsViewStore()
    get().resetAssociationsCreateStore()
    get().resetFoldersStore()
    get().resetSightingsStore()
    get().resetVideosStore()
  },

  serverReachable: 0,
  setServerReachable: valueSetter(set, 'serverReachable'),

  route: ROUTES.TOOLS,
  setRoute: valueSetter(set, 'route'),

  ...createAssociationsViewStore(set, get),
  ...createAssociationsCreateStore(set, get),
  ...createFoldersStore(set, get),
  ...createSightingsStore(set, get),
  ...createVideosStore(set, get),
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
