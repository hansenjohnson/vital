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
import LinkageAnnotationPage from './containers/LinkageAnnotationPage'
import IngestTranscodePage from './containers/IngestTranscodePage'
import Navbar from './containers/Navbar'
import CenteredLoadingCircle from './components/CenteredLoadingCircle'
import AlertDialog from './components/AlertDialog'
import ConfirmationDialog from './components/ConfirmationDialog'

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
      case ROUTES.LINK_AND_ANNOTATE:
        return LinkageAnnotationPage
      case ROUTES.INGEST:
        return IngestTranscodePage
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

  // Alert Dialog
  const alertDialogOpen = useStore((state) => state.alertDialogOpen)
  const alertDialogProps = useStore((state) => state.alertDialogProps)
  const closeAlert = useStore((state) => state.closeAlert)

  // Confirmation Dialog
  const confirmationDialogOpen = useStore((state) => state.confirmationDialogOpen)
  const confirmationDialogProps = useStore((state) => state.confirmationDialogProps)
  const setConfirmationDialogOpen = useStore((state) => state.setConfirmationDialogOpen)

  // Prevent app from rendering until server is reachable or if settings are not available yet
  return (
    <>
      <Navbar width={titlebarRect.width} />

      <Box sx={{ height: `calc(100vh - ${TITLEBAR_HEIGHT}px)` }}>
        {!serverReachable || settingsLoading ? (
          <CenteredLoadingCircle />
        ) : (
          <>
            <SettingsContainer />
            <ActiveRouteComponent />
          </>
        )}
      </Box>

      <AlertDialog open={alertDialogOpen} onClose={closeAlert} {...alertDialogProps} />

      <ConfirmationDialog
        open={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        {...confirmationDialogProps}
      />
    </>
  )
}

export default App
