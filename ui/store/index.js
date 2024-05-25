import { create } from 'zustand'

import ping from '../api/ping'
import ROUTES from '../constants/routes'
import createAssociationsCreateStore from './associations-create'

const useStore = create((set) => ({
  serverReachable: 0,
  setServerReachable: (val) => set(() => ({ serverReachable: val })),

  route: ROUTES.TOOLS,
  setRoute: (val) => set(() => ({ route: val })),

  ...createAssociationsCreateStore(set),
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
