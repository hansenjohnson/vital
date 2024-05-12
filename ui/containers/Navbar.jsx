import Box from '@mui/material/Box'

import ROUTES from '../constants/routes'
import { TITLES } from '../constants/routes'
import NavbarButton from '../components/NavbarButton'

const Navbar = ({ width, height, route }) => {
  const title = TITLES[route]

  if (width * height === 0) return null

  return (
    <Box
      sx={{
        width: `${width}px`,
        height: `${height}px`,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <NavbarButton selected={route === ROUTES.TOOLS}>Tools</NavbarButton>
      <NavbarButton>Settings</NavbarButton>
      <NavbarButton>Work Queue</NavbarButton>
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
