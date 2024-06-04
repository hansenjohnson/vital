import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

import StyledTooltip from './StyledTooltip'

const VideoGroupHeader = ({ name, hasPresence }) => (
  <Box
    sx={(theme) => ({
      width: '100%',
      paddingLeft: 1,
      display: 'flex',
      alignItems: 'center',
      backgroundColor: hasPresence
        ? `${theme.palette.background.headerPaper}44`
        : `${theme.palette.background.headerPaper}10`,
      '&:hover': {
        backgroundColor: hasPresence
          ? `${theme.palette.background.headerPaper}66`
          : `${theme.palette.background.headerPaper}20`,
      },
    })}
  >
    <StyledTooltip title={name} xAdjustment={78}>
      <Box
        sx={(theme) => ({
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
        })}
      >
        {name}
      </Box>
    </StyledTooltip>

    <StyledTooltip title="Hide Video" xAdjustment={52}>
      <IconButton size="small">
        <VisibilityOffIcon sx={{ fontSize: '16px' }} />
      </IconButton>
    </StyledTooltip>

    <StyledTooltip title="Add Linkage" xAdjustment={26}>
      <IconButton size="small">
        <AddCircleOutlineIcon sx={{ fontSize: '16px' }} />
      </IconButton>
    </StyledTooltip>

    <StyledTooltip title="Play Video" xAdjustment={2}>
      <IconButton sx={{ width: '26px', height: '26px', marginLeft: '-2px' }}>
        <PlayArrowIcon sx={{ fontSize: '18px' }} />
      </IconButton>
    </StyledTooltip>
  </Box>
)

export default VideoGroupHeader
