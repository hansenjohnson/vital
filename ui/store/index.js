import { create } from 'zustand'

import ping from '../api/ping'
import ROUTES from '../constants/routes'
import createAssociationsCreateStore from './associations-create'
import { valueSetter } from './utils'

const useStore = create((set, get) => ({
  resetStore: () => {
    get().resetAssociationsCreateStore()
  },

  serverReachable: 0,
  setServerReachable: valueSetter(set, 'serverReachable'),

  route: ROUTES.TOOLS,
  setRoute: valueSetter(set, 'route'),

  ...createAssociationsCreateStore(set, get),
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
