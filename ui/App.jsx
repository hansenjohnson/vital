import { useState, useMemo } from 'react'

import Tools from './Containers/Tools'
import AssociationsView from './Containers/AssociationsView'
import AssociationsCreate from './Containers/AssociationsCreate'

const ROUTES = {
  TOOLS: 'tools',
  ASSOCIATIONS_VIEW: 'aa-view',
  ASSOCIATIONS_CREATE: 'aa-create',
}

const App = () => {
  const [route, setRoute] = useState(ROUTES.ASSOCIATIONS_CREATE)

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
    <>
      <ActiveRoute />
    </>
  )
}

export default App
