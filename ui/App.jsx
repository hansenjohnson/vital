import { useState } from 'react'
import Box from '@mui/material/Box'

import SettingsContainer from './containers/Settings'
import Tools from './containers/Tools'
import AssociationsView from './containers/AssociationsView'
import AssociationsCreate from './containers/AssociationsCreate'
import ROUTES from './constants/routes'

const App = () => {
  const [route, setRoute] = useState(ROUTES.TOOLS)
  const [settingsOpen, setSettingsOpen] = useState(true)
  const [folderOfVideosToCreate, setFolderOfVideosToCreate] = useState('')

  const [ActiveRoute, routeSpecificProps] = (() => {
    switch (route) {
      case ROUTES.TOOLS:
        return [Tools, { setFolderOfVideosToCreate }]
      case ROUTES.ASSOCIATIONS_VIEW:
        return [AssociationsView, {}]
      case ROUTES.ASSOCIATIONS_CREATE:
        return [AssociationsCreate, { folderOfVideosToCreate }]
      default:
        return [null, {}]
    }
  })()

  return (
    <Box sx={{ height: '100vh' }}>
      <SettingsContainer
        open={settingsOpen}
        handleClose={(event, reason) => {
          if (reason !== 'backdropClick') {
            setSettingsOpen(false)
          }
        }}
      />
      <ActiveRoute setRoute={setRoute} {...routeSpecificProps} />
    </Box>
  )
}

export default App
