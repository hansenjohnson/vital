import { useState, useMemo } from 'react'
import Box from '@mui/material/Box'

import Tools from './Containers/Tools'
import AssociationsView from './Containers/AssociationsView'
import AssociationsCreate from './Containers/AssociationsCreate'
import ROUTES from './constants/routes'

const App = () => {
  const [route, setRoute] = useState(ROUTES.TOOLS)

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
      <ActiveRoute setRoute={setRoute} />
    </Box>
  )
}

export default App
