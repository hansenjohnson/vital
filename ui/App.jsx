import { useMemo, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Box from '@mui/material/Box'

import useStore from './store'
import useSettingsStore from './store/settings'
import ROUTES from './constants/routes'
import { TITLEBAR_HEIGHT } from './constants/dimensions'
import useWindowSize from './hooks/useWindowSize'

import SettingsContainer from './containers/Settings'
import Tools from './containers/Tools'
import AssociationsView from './containers/AssociationsView'
import AssociationsCreate from './containers/AssociationsCreate'
import Navbar from './containers/Navbar'
import CenteredLoadingCircle from './components/CenteredLoadingCircle'

const App = () => {
  const [serverReachable, route] = useStore(
    useShallow((state) => [state.serverReachable, state.route])
  )
  const [settingsLoading, loadSettings] = useSettingsStore(
    useShallow((state) => [state.loading, state.loadSettings])
  )
  useEffect(() => {
    if (!serverReachable) return
    loadSettings()
  }, [serverReachable])

  const ActiveRouteComponent = (() => {
    switch (route) {
      case ROUTES.TOOLS:
        return Tools
      case ROUTES.ASSOCIATIONS_VIEW:
        return AssociationsView
      case ROUTES.ASSOCIATIONS_CREATE:
        return AssociationsCreate
      default:
        return null
    }
  })()

  const windowSize = useWindowSize()
  const _titlebarRect = window.navigator.windowControlsOverlay.getTitlebarAreaRect()
  const titlebarRect = useMemo(
    () => _titlebarRect,
    [JSON.stringify(_titlebarRect), JSON.stringify(windowSize)]
  )

  // Prevent app from rendering until server is reachable or if settings are not available yet
  return (
    <>
      <Navbar width={titlebarRect.width} />
      {!serverReachable || settingsLoading ? (
        <CenteredLoadingCircle />
      ) : (
        <Box sx={{ height: `calc(100vh - ${TITLEBAR_HEIGHT}px)` }}>
          <SettingsContainer />
          <ActiveRouteComponent />
        </Box>
      )}
    </>
  )
}

export default App
