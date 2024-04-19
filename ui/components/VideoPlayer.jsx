import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FullscreenIcon from '@mui/icons-material/Fullscreen'
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit'

import useWindowSize from '../hooks/useWindowSize'

const PLAYER_CONTROLS_WIDTH = 150
const PLAYER_CONTROLS_HEIGHT = 50
const CONTENT_SHADOW = '0px 0px 4px rgba(255, 255, 255, 0.5)'

const controlIconStyle = {
  fontSize: '20px',
  filter: `drop-shadow(${CONTENT_SHADOW})`,
}

const VideoPlayer = ({ siblingHeights }) => {
  const theme = useTheme()

  // Responding to Window Resize with a Lock to 16/9 Aspect Ratio
  const heightToLeaveForSiblings = siblingHeights.reduce((acc, height) => acc + height, 0)
  const { windowWidth, windowHeight } = useWindowSize()
  const videoContainerRef = useRef(null)
  const [widerContainer, setWiderContainer] = useState(false)
  useEffect(() => {
    const { clientWidth, clientHeight } = videoContainerRef.current
    const videoContainerAspectRatio = clientWidth / clientHeight
    const tooMuchAspectRatio = videoContainerAspectRatio > 16 / 9
    const enoughHeightForSiblings = windowHeight - clientHeight > heightToLeaveForSiblings
    if (!enoughHeightForSiblings || tooMuchAspectRatio) {
      setWiderContainer(true)
    } else {
      setWiderContainer(false)
    }
  }, [videoContainerRef, windowWidth, windowHeight])

  // Play Controls
  const [playing, setPlaying] = useState(false)
  const playVideo = () => {
    setPlaying(true)
  }
  const pauseVideo = () => {
    setPlaying(false)
  }

  // Fullscreen Controls
  const [fullscreen, setFullscreen] = useState(false)
  const enterFullscreen = () => {
    setFullscreen(true)
  }
  const exitFullscreen = () => {
    setFullscreen(false)
  }

  return (
    <Box
      ref={videoContainerRef}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        display: 'grid',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(100, 200, 100, 0.5)',
          width: widerContainer ? 'auto' : '100%',
          height: widerContainer ? '100%' : 'auto',
          aspectRatio: '16 / 9',
          objectFit: 'contain',
          overflow: 'hidden',
          margin: 'auto',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>Video</Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: theme.spacing(-1),
          width: `calc(${PLAYER_CONTROLS_WIDTH}px + ${theme.spacing(3)})`,
          height: `${PLAYER_CONTROLS_HEIGHT}px`,
          clipPath: `rect(auto auto auto ${theme.spacing(1)})`,
        }}
      >
        {/* Video Controls Backdrop */}
        <Box
          sx={{
            position: 'absolute',
            width: `calc(${PLAYER_CONTROLS_WIDTH}px + ${theme.spacing(1)})`,
            height: `calc(${PLAYER_CONTROLS_HEIGHT}px + ${theme.spacing(1)})`,
            background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 85%)',
            filter: 'blur(6px)',
          }}
        />

        {/* Video Controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: theme.spacing(0.25),
            left: theme.spacing(1.25),
            width: `${PLAYER_CONTROLS_WIDTH}px`,
            height: `calc(${PLAYER_CONTROLS_HEIGHT}px - ${theme.spacing(2)})`,
            fontFamily: "'Sometype Mono Variable', monopace",
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
          }}
        >
          <IconButton
            sx={{ width: '20px', height: '20px' }}
            onClick={playing ? pauseVideo : playVideo}
          >
            {playing ? (
              <PauseIcon sx={controlIconStyle} />
            ) : (
              <PlayArrowIcon sx={controlIconStyle} />
            )}
          </IconButton>
          <IconButton
            sx={{ width: '20px', height: '20px' }}
            onClick={fullscreen ? exitFullscreen : enterFullscreen}
          >
            {fullscreen ? (
              <FullscreenExitIcon sx={controlIconStyle} />
            ) : (
              <FullscreenIcon sx={controlIconStyle} />
            )}
          </IconButton>
          <Box sx={{ marginLeft: 0.25, textShadow: CONTENT_SHADOW }}>00:00:00</Box>
        </Box>
      </Box>
    </Box>
  )
}

export default VideoPlayer
