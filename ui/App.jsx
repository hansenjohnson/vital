import { useEffect, useMemo, useState } from 'react'
import Box from '@mui/material/Box'

import ping from './api/ping'
import settingsAPI from './api/settings'
import ROUTES from './constants/routes'
import { TITLEBAR_HEIGHT } from './constants/dimensions'
import { REQUIRED_SETTINGS } from './constants/settingKeys'
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

  // After server is reachable, load settings, as the app is unusable without them
  const [settingsLoading, setSettingsLoading] = useState(true)
  const [settingsInitialized, setSettingsInitialized] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState(
    Object.fromEntries(REQUIRED_SETTINGS.map((key) => [key, '']))
  )
  const setOneSetting = (key, value) => {
    setSettings((existingSettings) => ({ ...existingSettings, [key]: value }))
  }
  useEffect(() => {
    if (!serverReachable) return
    settingsAPI.getList(REQUIRED_SETTINGS).then((settingsList) => {
      const incomingSettings = settingsList.reduce((acc, settingData) => {
        const [key, value] = Object.entries(settingData)[0]
        acc[key] = value || ''
        return acc
      }, {})

      // Populate the data
      const initialSettings = { ...settings, ...incomingSettings }
      setSettings(initialSettings)
      setSettingsLoading(false)
    })
  }, [serverReachable])

  // Determine if settings are initialized, open the dialog otherwise
  useEffect(() => {
    if (settingsLoading) return
    const areSettingsInitialized = Object.values(settings).every(
      (value) => value !== null && value !== ''
    )

    // This captures the case where they are all initialized on app launch
    // and additionally when they become initialized one the first closing of the Settings dialog
    if (settingsOpen === false && areSettingsInitialized) {
      setSettingsInitialized(true)
      return
    }

    setSettingsOpen(true)
  }, [settingsLoading, settingsOpen])

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
            reloadFromSettingsChange: settingsInitialized,
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

  if (!serverReachable || settingsLoading) return <CenteredLoadingCircle />

  return (
    <>
      <Navbar
        width={titlebarRect.width}
        title="Video Catalog Suite"
        route={route}
        setRoute={setRoute}
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
        settingsInitialized={settingsInitialized}
      />
      <Box sx={{ height: `calc(100vh - ${TITLEBAR_HEIGHT}px)` }}>
        <SettingsContainer
          open={settingsOpen}
          handleClose={() => setSettingsOpen(false)}
          settingsInitialized={settingsInitialized}
          settings={settings}
          setOneSetting={setOneSetting}
        />
        <ActiveRoute setRoute={setRoute} {...routeSpecificProps} />
      </Box>
    </>
  )
}

export default App
