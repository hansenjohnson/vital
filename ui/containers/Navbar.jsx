import Box from '@mui/material/Box'

import { TITLEBAR_HEIGHT } from '../constants/dimensions'
import ROUTES from '../constants/routes'
import { TITLES } from '../constants/routes'
import NavbarButton from '../components/NavbarButton'

const Navbar = ({
  width,
  route,
  setRoute,
  settingsOpen,
  setSettingsOpen,
  initialSettingsComplete,
}) => {
  const title = TITLES[route]

  const handleToolsClick = () => {
    setSettingsOpen(false)
    setRoute(ROUTES.TOOLS)
  }

  if (width === 0) return null

  return (
    <Box
      sx={{
        width: `${width}px`,
        height: `${TITLEBAR_HEIGHT}px`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <NavbarButton
        selected={route === ROUTES.TOOLS && !settingsOpen}
        disabled={!initialSettingsComplete}
        onClick={handleToolsClick}
      >
        Tools
      </NavbarButton>
      <NavbarButton selected={settingsOpen} onClick={() => setSettingsOpen(true)}>
        Settings
      </NavbarButton>
      <NavbarButton disabled={!initialSettingsComplete}>Work Queue (0)</NavbarButton>
      <Box
        sx={{
          flexGrow: 1,
          height: '100%',
          WebkitAppRegion: 'drag', // tells the OS we can drag the window here
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 500,
          backgroundColor: 'primary.dark',
        }}
      >
        {title}
      </Box>
    </Box>
  )
}

export default Navbar
