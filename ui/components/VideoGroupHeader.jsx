import { useRef, useState } from 'react'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'

import StyledTooltip from './StyledTooltip'

const VideoGroupHeader = ({ name, onHide, onReload, onShowInFileBrowser, onPlay, isPlaying }) => {
  const theme = useTheme()

  const anchorEl = useRef(null)

  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  let backgroundColor = `${theme.palette.background.headerPaper}10`
  let hoverBackgroundColor = `${theme.palette.background.headerPaper}20`
  if (isPlaying) {
    backgroundColor = 'black'
    hoverBackgroundColor = undefined
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          paddingLeft: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: backgroundColor,
          '&:hover': {
            cursor: 'pointer',
            backgroundColor: hoverBackgroundColor,
          },
        }}
        onClick={onPlay}
      >
        <StyledTooltip title={`Play ${name}`} xAdjustment={26}>
          <Box
            sx={{
              width: '100%',
              paddingTop: '2px',
              paddingBottom: '2px',
              paddingRight: '4px',

              fontSize: '14px',
              fontFamily: theme.typography.monoFamily,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              wordBreak: 'keep-all',
            }}
          >
            {name}
          </Box>
        </StyledTooltip>

        <IconButton
          ref={anchorEl}
          size="small"
          onClick={(event) => {
            event.stopPropagation()
            setMenuOpen(!menuOpen)
          }}
        >
          <MoreHorizIcon sx={{ fontSize: '16px' }} />
        </IconButton>
      </Box>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl.current}
        open={menuOpen}
        onClose={closeMenu}
        MenuListProps={{ dense: true }}
        slotProps={{
          paper: {
            sx: {
              overflow: 'visible',
              background: 'none',
              backgroundColor: theme.palette.background.paper,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: '-10px',
                left: '12px',

                width: '0px',
                height: '0px',
                borderStyle: 'solid',
                borderWidth: '0 8px 10px 8px',
                borderColor: 'transparent',
                borderBottomColor: theme.palette.background.paper,
              },
            },
          },
        }}
        transformOrigin={{ vertical: 0, horizontal: 6 }}
      >
        <MenuItem
          onClick={() => {
            closeMenu()
            onHide()
          }}
        >
          Hide Video
        </MenuItem>
        <MenuItem
          onClick={() => {
            closeMenu()
            onReload()
          }}
        >
          Reload at Highest Quality
        </MenuItem>
        <MenuItem
          onClick={async () => {
            closeMenu()
            await onShowInFileBrowser()
          }}
        >
          Show in File Browser
        </MenuItem>
      </Menu>
    </>
  )
}

export default VideoGroupHeader
