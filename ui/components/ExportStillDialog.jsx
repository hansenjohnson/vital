import { forwardRef } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Grow from '@mui/material/Grow'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Skeleton from '@mui/material/Skeleton'

import { STILL_FRAME_PREVIEW_WIDTH } from '../constants/dimensions'
import StyledButton from './StyledButton'

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

const mono = (theme) => ({ fontFamily: theme.typography.monoFamily })

const ExportStillDialog = ({
  open,
  handleClose,
  handleExport,
  handlePreviewRefresh,
  image,
  videoName,
  timestamp,
  resolution,
}) => {
  return (
    <Dialog
      TransitionComponent={Transition}
      maxWidth="md"
      keepMounted
      open={open}
      onClose={handleClose}
    >
      <DialogTitle
        sx={{
          color: 'primary.dark',
          backgroundColor: 'primary.light',
          fontSize: 24,
          paddingTop: 1,
          paddingBottom: 1,
        }}
      >
        Export Still Frame
      </DialogTitle>

      <IconButton
        onClick={handleClose}
        color="primary"
        size="small"
        sx={(theme) => ({
          position: 'absolute',
          right: theme.spacing(1),
          top: theme.spacing(1),
          color: 'primary.dark',
        })}
      >
        <CloseIcon sx={{ fontSize: '30px' }} />
      </IconButton>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box>
              {image ? (
                <img
                  src={image}
                  style={{ display: 'block', width: `${STILL_FRAME_PREVIEW_WIDTH / 2}px` }}
                />
              ) : (
                <Skeleton
                  variant="rectangle"
                  width={STILL_FRAME_PREVIEW_WIDTH / 2}
                  height={(STILL_FRAME_PREVIEW_WIDTH / 2) * 0.5625}
                />
              )}
              <Box
                sx={(theme) => ({
                  fontFamily: theme.typography.monoFamily,
                  fontSize: '12px',
                  color: 'text.secondary',
                })}
              >
                Pixelated?{' '}
                <Box
                  onClick={handlePreviewRefresh}
                  sx={(theme) => ({
                    display: 'inline-block',
                    marginTop: 0.5,
                    borderBottom: `1px dotted ${theme.palette.text.disabled}`,
                    '&:hover': {
                      cursor: 'pointer',
                      color: 'text.primary',
                      borderColor: 'text.primary',
                    },
                  })}
                >
                  Refresh the Preview
                </Box>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box>
                <Typography sx={{ fontWeight: 500 }}>Video</Typography>
                <Typography sx={mono}>{videoName}</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 500 }}>Frame</Typography>
                <Typography sx={mono}>{timestamp}</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 500 }}>Native Resolution</Typography>
                <Typography sx={mono}>{resolution}</Typography>
              </Box>
            </Box>
          </Box>

          <Box>2</Box>

          <Box sx={{ alignSelf: 'flex-end' }}>
            <StyledButton variant="contained" onClick={handleExport}>
              Export
            </StyledButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ExportStillDialog
