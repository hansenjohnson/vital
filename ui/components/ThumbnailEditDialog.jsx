import { useState, forwardRef, Fragment } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Grow from '@mui/material/Grow'
import CloseIcon from '@mui/icons-material/Close'
import Skeleton from '@mui/material/Skeleton'

import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import { THUMBNAIL_WIDTH } from '../constants/dimensions'
import StyledButton from './StyledButton'
import StyledPillButton from './StyledPillButton'

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

const ThumbnailEditDialog = ({
  open,
  handleClose,
  onEntered,
  onExited,
  saveable,
  handleSave,
  thumbnails,
  selectedThumbnailIdx,
}) => {
  // These are assumptions based on all videos and thumbnails being 16:9 aspect ratio
  const doubleWidth = THUMBNAIL_WIDTH * 2
  const doubleHeight = Math.floor(THUMBNAIL_WIDTH * 2 * (9 / 16))
  const halfWidth = THUMBNAIL_WIDTH / 2
  const halfHeight = Math.floor((THUMBNAIL_WIDTH / 2) * (9 / 16))

  // Thumbnail Loading Logic, for placeholder display
  const currentThumbnail = thumbnails[selectedThumbnailIdx]
  const [topThumbnailLoaded, setTopThumbnailLoaded] = useState(false)

  const unloaded = { 0: false, 1: false, 2: false, 3: false, 4: false }
  const [thumbnailsLoaded, setThumbnailsLoaded] = useState(unloaded)

  const reportAsLoaded = (idx) => {
    setThumbnailsLoaded((prevLoaded) => ({ ...prevLoaded, [`${idx}`]: true }))
  }

  // Crop Selected Thumbnail Logic
  const [showCrop, setShowCrop] = useState(false)
  const initialInset = 20
  const initialCrop = {
    unit: 'px',
    x: 0 + initialInset,
    y: 0 + initialInset,
    width: doubleWidth - initialInset * 2,
    height: doubleHeight - initialInset * 2,
  }
  const [crop, setCrop] = useState()

  const resetAndClose = () => {
    setCrop(null)
    setShowCrop(false)
    setTopThumbnailLoaded(false)
    setThumbnailsLoaded(unloaded)
    handleClose()
  }

  return (
    <Dialog
      TransitionComponent={Transition}
      TransitionProps={{ onEntered, onExited }}
      maxWidth="md"
      keepMounted
      open={open}
      onClose={resetAndClose}
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
        Edit Thumbnail
      </DialogTitle>

      <IconButton
        onClick={resetAndClose}
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

      <DialogContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            color: 'text.secondary',
          }}
        >
          <ReactCrop
            crop={crop}
            onChange={(newCrop) => setCrop(newCrop)}
            // 200/112 is a nearby integer representation of 16/9
            aspect={200 / 112}
            disabled={!showCrop}
            style={{ display: topThumbnailLoaded ? 'block' : 'none' }}
          >
            <Box
              component="img"
              src={currentThumbnail}
              onLoad={() => setTopThumbnailLoaded(true)}
              sx={{
                width: doubleWidth,
                fontSize: 0,
              }}
            />
          </ReactCrop>

          {!topThumbnailLoaded && (
            <Skeleton variant="rectangular" width={doubleWidth} height={doubleHeight} />
          )}

          <Box sx={{ marginTop: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
            <StyledPillButton
              color="inherit"
              disabled={showCrop}
              onClick={() => {
                setCrop(initialCrop)
                setShowCrop(true)
              }}
            >
              add crop
            </StyledPillButton>
            <StyledPillButton
              color="inherit"
              disabled={!showCrop}
              onClick={() => {
                setCrop(null)
                setShowCrop(false)
              }}
            >
              clear crop
            </StyledPillButton>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          {Array.from(Array(5)).map((_, idx) => {
            const thumbnailURL = thumbnails[idx]
            const isSelected = idx === selectedThumbnailIdx
            return (
              <Fragment key={`${idx}-img`}>
                <Box
                  component="img"
                  src={thumbnailURL}
                  onLoad={() => reportAsLoaded(idx)}
                  sx={(theme) => ({
                    display: thumbnailsLoaded[idx] ? 'block' : 'none',
                    width: halfWidth,
                    borderRadius: 0.5,
                    outline: isSelected && `4px solid ${theme.palette.secondary.dark}`,
                  })}
                />
                {!thumbnailsLoaded[idx] && (
                  <Skeleton
                    variant="rectangular"
                    width={halfWidth}
                    height={halfHeight}
                    sx={{ flexShrink: 0 }}
                  />
                )}
              </Fragment>
            )
          })}
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <StyledButton color="plain" onClick={resetAndClose}>
            Cancel
          </StyledButton>
          <StyledButton variant="contained" onClick={handleSave} disabled={!saveable}>
            Save
          </StyledButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ThumbnailEditDialog
