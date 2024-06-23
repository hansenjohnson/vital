import { useState, forwardRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Grow from '@mui/material/Grow'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Skeleton from '@mui/material/Skeleton'
import InputAdornment from '@mui/material/InputAdornment'
import CheckIcon from '@mui/icons-material/Check'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'

import { STILL_FRAME_PREVIEW_WIDTH } from '../constants/dimensions'
import { joinPath, folderSlash } from '../utilities/paths'
import StyledButton from './StyledButton'
import SettingInput from './SettingInput'
import FileTypes from "../constants/fileTypes";

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
  frameNumber,
  timestamp,
  resolution,
  sightingLetter,
  stillExportDir,
  subFolder,
  exportStatus, // One of: null, 'exporting', 'success', or 'error'
}) => {
  const [fileName, setFileName] = useState('')

  // Set default file name when dialog is opened
  useEffect(() => {
    if (!open) return
    let videoNameStr = videoName
    if (videoName.includes('.')) {
      videoNameStr = videoName.split('.')[0]
    }
    setFileName(`Sighting_${sightingLetter}_${videoNameStr}_frame_${frameNumber}`)
  }, [open])

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
                    userSelect: 'none',
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
                <Typography
                  sx={(theme) => ({ ...mono(theme), maxWidth: '300px', wordBreak: 'break-all' })}
                >
                  {videoName}
                </Typography>
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

          <Box sx={{ marginTop: 1, marginBottom: 1 }}>
            <Typography sx={(theme) => ({ ...mono(theme), fontSize: '14px' })}>
              {joinPath([stillExportDir, subFolder])}
              {folderSlash()}
            </Typography>
            <SettingInput
              label="File Name"
              value={fileName}
              onChange={(event) => setFileName(event.target.value)}
              endAdornment={<InputAdornment position="end">.jpg</InputAdornment>}
            />
          </Box>

          <Box sx={{ alignSelf: 'flex-end', display: 'flex', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {exportStatus === 'success' && <CheckIcon color="success" />}
              {exportStatus === 'error' && <ReportGmailerrorredIcon color="error" />}
            </Box>
            <StyledButton
              variant="contained"
              onClick={() => handleExport(fileName)}
              disabled={exportStatus !== null}
            >
              {exportStatus === null && 'Export'}
              {exportStatus === 'exporting' && 'Export'}
              {exportStatus === 'success' && 'Success'}
              {exportStatus === 'error' && 'Failed'}
            </StyledButton>
            {exportStatus === 'success' && (
              <StyledButton
                variant="contained"
                onClick={() => window.api.selectFile(FileTypes.FILE)}
              >
                Open in Folder
            </StyledButton>
            )}
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ExportStillDialog
