import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'

import SettingsContainer from './containers/Settings'
import Tools from './containers/Tools'
import AssociationsView from './containers/AssociationsView'
import AssociationsCreate from './containers/AssociationsCreate'
import ROUTES from './constants/routes'

const App = () => {
  const [route, setRoute] = useState(ROUTES.TOOLS)
  const [settingsOpen, setSettingsOpen] = useState(true)

  const selectFile = () => window.api.selectFile()

  const ActiveRoute = useMemo(() => {
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
  }, [route])

  return (
    <Box sx={{ height: '100vh' }}>
      <SettingsContainer open={settingsOpen} handleClose={() => setSettingsOpen(false)} />
      <ActiveRoute setRoute={setRoute} />
    </Box>
  )
}

export default App
