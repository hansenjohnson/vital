import { useState, forwardRef } from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Grow from '@mui/material/Grow'
import CloseIcon from '@mui/icons-material/Close'
import Skeleton from '@mui/material/Skeleton'
import ButtonBase from '@mui/material/ButtonBase'

import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'

import {
  THUMBNAIL_CHOICE_WIDTH,
  THUMBNAIL_CHOICE_HEIGHT,
  THUMBNAIL_WIDTH,
  THUMBNAIL_HEIGHT,
} from '../constants/dimensions'
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
  handleSave,
  existingThumbnail,
  thumbnails,
  selectedThumbnailIdx,
  setSelectedThumbnailIdx,
}) => {
  const [showExisting, setShowExisting] = useState(true)

  // Thumbnail Loading Logic, for placeholder display
  const currentThumbnail = showExisting ? existingThumbnail : thumbnails[selectedThumbnailIdx]
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
    width: THUMBNAIL_CHOICE_WIDTH - initialInset * 2,
    height: THUMBNAIL_CHOICE_HEIGHT - initialInset * 2,
  }
  const [crop, setCrop] = useState()

  const save = () => {
    handleSave(showCrop ? crop : null)
  }

  const handleExited = () => {
    setCrop(null)
    setShowCrop(false)
    setTopThumbnailLoaded(false)
    setThumbnailsLoaded(unloaded)
    setShowExisting(true)
    onExited()
  }

  return (
    <Dialog
      TransitionComponent={Transition}
      TransitionProps={{ onEntered, onExited: handleExited }}
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
        Edit Thumbnail
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
            aspect={THUMBNAIL_WIDTH / THUMBNAIL_HEIGHT}
            disabled={!showCrop}
            style={{
              display: topThumbnailLoaded ? 'block' : 'none',
              width: THUMBNAIL_CHOICE_WIDTH,
            }}
          >
            <Box
              component="img"
              src={open ? currentThumbnail : undefined}
              onLoad={() => setTopThumbnailLoaded(true)}
              sx={{
                width: showExisting ? THUMBNAIL_WIDTH : THUMBNAIL_CHOICE_WIDTH,
                margin: showExisting
                  ? [
                      `${(THUMBNAIL_CHOICE_WIDTH - THUMBNAIL_WIDTH) / 2}px`,
                      `${(THUMBNAIL_CHOICE_HEIGHT - THUMBNAIL_HEIGHT) / 2}px`,
                    ]
                  : 0,
                fontSize: 0,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </ReactCrop>

          {!topThumbnailLoaded && (
            <Skeleton
              variant="rectangular"
              width={THUMBNAIL_CHOICE_WIDTH}
              height={THUMBNAIL_CHOICE_HEIGHT}
            />
          )}

          <Box
            sx={{ width: '120px', marginTop: 1, display: 'flex', flexDirection: 'column', gap: 1 }}
          >
            <StyledPillButton
              color={showExisting ? 'primary' : 'inherit'}
              sx={{ paddingLeft: 0, paddingRight: 0 }}
              onClick={() => {
                setShowExisting(true)
              }}
            >
              {showExisting ? 'current' : 'view current'}
            </StyledPillButton>
            <StyledPillButton
              color="inherit"
              disabled={showExisting || showCrop}
              onClick={() => {
                setCrop(initialCrop)
                setShowCrop(true)
              }}
            >
              add crop
            </StyledPillButton>
            <StyledPillButton
              color="inherit"
              disabled={showExisting || !showCrop}
              onClick={() => {
                setCrop(null)
                setShowCrop(false)
              }}
            >
              clear crop
            </StyledPillButton>
          </Box>
        </Box>

        <Box sx={{ fontSize: '12px', color: 'text.secondary', marginBottom: -1.5 }}>
          Select a thumbnail option from within the linkage region
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {Array.from(Array(5)).map((_, idx) => {
            const thumbnailURL = thumbnails[idx]
            const isSelected = !showExisting && idx === selectedThumbnailIdx
            return (
              <ButtonBase
                key={`${idx}-img`}
                onClick={() => {
                  setShowExisting(false)
                  setSelectedThumbnailIdx(idx)
                }}
                sx={(theme) => ({
                  borderRadius: 0.5,
                  outline: isSelected && `4px solid ${theme.palette.secondary.dark}`,
                  '&:hover': {
                    outline: !isSelected && `4px solid ${theme.palette.action.hover}`,
                  },
                })}
              >
                <Box
                  component="img"
                  src={thumbnailURL}
                  onLoad={() => reportAsLoaded(idx)}
                  sx={{
                    display: thumbnailsLoaded[idx] ? 'block' : 'none',
                    width: THUMBNAIL_WIDTH / 2,
                    borderRadius: 0.5,
                    pointerEvents: 'none',
                  }}
                />
                {!thumbnailsLoaded[idx] && (
                  <Skeleton
                    variant="rectangular"
                    width={THUMBNAIL_WIDTH / 2}
                    height={THUMBNAIL_HEIGHT / 2}
                    sx={{ flexShrink: 0 }}
                  />
                )}
              </ButtonBase>
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
          <StyledButton color="plain" onClick={handleClose}>
            Cancel
          </StyledButton>
          <StyledButton variant="contained" onClick={save} disabled={showExisting}>
            Save
          </StyledButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ThumbnailEditDialog
