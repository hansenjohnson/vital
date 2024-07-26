import Box from '@mui/material/Box'

import { JOB_MODES } from '../constants/routes'

const IMAGE_BUTTON_MIDDLE = 325
const VIDEO_BUTTON_MIDDLE = 525

const buttonMiddleForJob = {
  [JOB_MODES.BY_IMAGE]: IMAGE_BUTTON_MIDDLE,
  [JOB_MODES.BY_VIDEO]: VIDEO_BUTTON_MIDDLE,
}

const VerticalLineBetweenDots = () => (
  <Box
    sx={{
      zIndex: -1,
      position: 'absolute',
      backgroundColor: 'secondary.main',
      width: '1px',
      height: '100%',
      left: '9px',
      top: '20px',
    }}
  />
)

const IngestInputsLineDrawing = ({ jobMode, pixelsToSourceInputMiddle }) => (
  <>
    <Box
      sx={(theme) => ({
        zIndex: -1,
        position: 'absolute',
        backgroundColor: 'secondary.main',
        width: '1px',
        height: `calc(${theme.spacing(1)} + 2px)`,
        left: '50%',
        top: theme.spacing(4),
      })}
    />
    <Box
      sx={(theme) => {
        const lineWidth = buttonMiddleForJob[jobMode] - pixelsToSourceInputMiddle
        const leftOver = Math.sign(lineWidth) === -1 ? lineWidth + 1 : 0
        return {
          zIndex: -1,
          position: 'absolute',
          borderTop: `1px solid ${theme.palette.secondary.main}`,
          borderRight: leftOver === 0 && `1px solid ${theme.palette.secondary.main}`,
          borderLeft: leftOver !== 0 && `1px solid ${theme.palette.secondary.main}`,
          width: `${Math.abs(lineWidth)}px`,
          height: `calc(${theme.spacing(1)} + 2px)`,
          left: `calc(50% + ${leftOver}px)`,
          top: `calc(${theme.spacing(5)} + 2px)`,
        }
      }}
    />
    <Box
      sx={(theme) => ({
        zIndex: -1,
        position: 'absolute',
        backgroundColor: 'secondary.main',
        width: '1px',
        height: theme.spacing(2),
        left: `${buttonMiddleForJob[jobMode]}px`,
        top: `calc(${theme.spacing(10.5)} - 2px)`,
      })}
    />
    <Box
      sx={(theme) => ({
        zIndex: -1,
        position: 'absolute',
        borderTop: `1px solid ${theme.palette.secondary.main}`,
        borderLeft: `1px solid ${theme.palette.secondary.main}`,
        width: `calc(${buttonMiddleForJob[jobMode]}px - 8px)`,
        height: `calc(${theme.spacing(1.5)} + 2px)`,
        left: '9px',
        top: `calc(${theme.spacing(12.5)} - 2px)`,
      })}
    />
  </>
)

export { VerticalLineBetweenDots }
export default IngestInputsLineDrawing
