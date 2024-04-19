import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'

const PLAYER_CONTROLS_WIDTH = 126
const PLAYER_CONTROLS_HEIGHT = 50

const VideoPlayer = () => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        backgroundColor: 'palevioletred',
        width: '100%',
        paddingTop: '56.25%', // 16by9 aspect ratio
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      Video
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
        <Box
          sx={{
            position: 'absolute',
            width: `calc(${PLAYER_CONTROLS_WIDTH}px + ${theme.spacing(1)})`,
            height: `calc(${PLAYER_CONTROLS_HEIGHT}px + ${theme.spacing(1)})`,
            background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 85%)',
            filter: 'blur(6px)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: '0px',
            left: theme.spacing(2),
            width: `${PLAYER_CONTROLS_WIDTH}px`,
            height: `calc(${PLAYER_CONTROLS_HEIGHT}px - ${theme.spacing(2)})`,
            fontFamily: "'Sometype Mono Variable', monopace",
          }}
        >
          &gt; 00:00:00
        </Box>
      </Box>
    </Box>
  )
}

export default VideoPlayer
