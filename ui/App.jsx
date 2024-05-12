import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'

import ping from './api/ping'
import ROUTES from './constants/routes'
import { TITLEBAR_HEIGHT } from './constants/dimensions'
import useLocalStorage from './hooks/useLocalStorage'
import useWindowSize from './hooks/useWindowSize'

import SettingsContainer from './containers/Settings'
import Tools from './containers/Tools'
import AssociationsView from './containers/AssociationsView'
import AssociationsCreate from './containers/AssociationsCreate'
import Navbar from './containers/Navbar'
import CenteredLoadingCircle from './components/CenteredLoadingCircle'

const App = () => {
  // Prevent app from rendering until server is reachable
  const [serverReachable, setServerReachable] = useState(false)
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const pong = await ping()
      if (pong) {
        clearInterval(intervalId)
        setServerReachable(true)
      }
    }, 250)
    return () => clearInterval(intervalId)
  }, [])

  // Track if Initial Settings have been set, as the app is unusable without them
  const [initialSettings, setInitialSettings] = useLocalStorage('initialSettings', false)
  const [settingsOpen, setSettingsOpen] = useState(!initialSettings)
  useEffect(() => {
    if (settingsOpen === false && initialSettings === false) {
      setInitialSettings(true)
    }
  }, [settingsOpen])

  // Route-specific state
  const [videoFolderId, setVideoFolderId] = useState(null)
  const [videoFolderName, setVideoFolderName] = useState(null)

  const [route, setRoute] = useState(ROUTES.TOOLS)
  const [ActiveRoute, routeSpecificProps] = (() => {
    switch (route) {
      case ROUTES.TOOLS:
        return [
          Tools,
          {
            reloadFromSettingsChange: initialSettings,
            setVideoFolderId,
            setVideoFolderName,
          },
        ]
      case ROUTES.ASSOCIATIONS_VIEW:
        return [AssociationsView, {}]
      case ROUTES.ASSOCIATIONS_CREATE:
        return [AssociationsCreate, { videoFolderId, videoFolderName }]
      default:
        return [null, {}]
    }
  })()

  const windowSize = useWindowSize()
  const _titlebarRect = window.navigator.windowControlsOverlay.getTitlebarAreaRect()
  const titlebarRect = useMemo(
    () => _titlebarRect,
    [JSON.stringify(_titlebarRect), JSON.stringify(windowSize)]
  )

  if (!serverReachable) return <CenteredLoadingCircle />

  return (
    <>
      <Navbar
        width={titlebarRect.width}
        title="Video Catalog Suite"
        route={route}
        setRoute={setRoute}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        initialSettingsComplete={initialSettings}
      />
      <Box sx={{ height: `calc(100vh - ${TITLEBAR_HEIGHT}px)` }}>
        <SettingsContainer
          open={settingsOpen}
          handleClose={() => setSettingsOpen(false)}
          initialSettingsComplete={initialSettings}
        />
        <ActiveRoute setRoute={setRoute} {...routeSpecificProps} />
      </Box>
    </>
  )
}

export default App
