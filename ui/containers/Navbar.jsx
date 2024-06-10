import { useShallow } from 'zustand/react/shallow'
import Box from '@mui/material/Box'

import useStore from '../store'
import useSettingsStore from '../store/settings'
import { isSaveable } from '../store/linkages'
import ROUTES from '../constants/routes'
import { TITLEBAR_HEIGHT } from '../constants/dimensions'
import { TITLES } from '../constants/routes'
import NavbarButton from '../components/NavbarButton'

const Navbar = ({ width }) => {
  const [resetStore, route, setRoute] = useStore(
    useShallow((state) => [state.resetStore, state.route, state.setRoute])
  )
  const [settingsInitialized, settingsOpen, setSettingsOpen] = useSettingsStore(
    useShallow((state) => [state.initialized, state.open, state.setOpen])
  )

  const title = TITLES[route]

  const savable = useStore(isSaveable)
  const setConfirmationDialogOpen = useStore((state) => state.setConfirmationDialogOpen)
  const setConfirmationDialogProps = useStore((state) => state.setConfirmationDialogProps)

  const handleToolsClick = () => {
    const action = () => {
      setSettingsOpen(false)
      if (route === ROUTES.TOOLS) return
      setRoute(ROUTES.TOOLS)
      resetStore()
    }

    if (!savable) {
      action()
    } else {
      setConfirmationDialogProps({
        title: 'Unsaved Changes',
        body: 'You have unsaved changes. Are you sure you want to navigate back home?',
        onConfirm: action,
      })
      setConfirmationDialogOpen(true)
    }
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
        disabled={!settingsInitialized}
        onClick={handleToolsClick}
      >
        Tools
      </NavbarButton>
      <NavbarButton selected={settingsOpen} onClick={() => setSettingsOpen(true)}>
        Settings
      </NavbarButton>
      <NavbarButton disabled={!settingsInitialized}>Work Queue (0)</NavbarButton>
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

      {/* Extra box behind navbar to hide window resizing artifacts */}
      <Box
        sx={{
          position: 'fixed',
          width: `400px`,
          height: `${TITLEBAR_HEIGHT}px`,
          right: 0,
          backgroundColor: 'primary.dark',
          zIndex: -1,
        }}
      />
    </Box>
  )
}

export default Navbar
