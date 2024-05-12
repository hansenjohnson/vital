import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'

import SettingsContainer from './containers/Settings'
import Tools from './containers/Tools'
import AssociationsView from './containers/AssociationsView'
import AssociationsCreate from './containers/AssociationsCreate'
import ping from './api/ping'
import ROUTES from './constants/routes'

const App = () => {
  const [route, setRoute] = useState(ROUTES.TOOLS)
  const [settingsOpen, setSettingsOpen] = useState(true)

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

  const [videoFolderId, setVideoFolderId] = useState(null)
  const [videoFolderName, setVideoFolderName] = useState(null)

  const [ActiveRoute, routeSpecificProps] = (() => {
    switch (route) {
      case ROUTES.TOOLS:
        return [Tools, { setVideoFolderId, setVideoFolderName }]
      case ROUTES.ASSOCIATIONS_VIEW:
        return [AssociationsView, {}]
      case ROUTES.ASSOCIATIONS_CREATE:
        return [AssociationsCreate, { videoFolderId, videoFolderName }]
      default:
        return [null, {}]
    }
  })()

  return (
    <Box sx={{ height: '100vh' }}>
      {serverReachable ? (
        <>
          <SettingsContainer
            open={settingsOpen}
            handleClose={(event, reason) => {
              if (reason !== 'backdropClick') {
                setSettingsOpen(false)
              }
            }}
          />
          <ActiveRoute setRoute={setRoute} {...routeSpecificProps} />
        </>
      ) : (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      )}
    </Box>
  )
}

export default App
