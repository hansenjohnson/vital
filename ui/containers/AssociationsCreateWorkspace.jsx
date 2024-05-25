import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'

import VideoPlayer from '../components/VideoPlayer'
import VideoTimeline from '../components/VideoTimeline'
import AssociationsDetailsBox from '../components/AssociationDetailsBox'
import StyledButton from '../components/StyledButton'

const TIMELINE_HEIGHT = 48
const DETAILS_HEIGHT = 245
const THUMBNAIL_WIDTH = 200

const AssociationsCreateWorkspace = ({
  activeVideoURL,
  changingActiveVideo,
  setChangingActiveVideo,
  handleNext,
  existingRegions,
  hasOverlap,
  regionStart,
  regionEnd,
  sightingName,
  annotations,
  setRegionStart,
  setRegionEnd,
  setSightingsDialogOpen,
  deleteAnnotation,
  saveable,
  saveAssociation,
}) => {
  const videoElementRef = useRef(null)

  const [videoDuration, setVideoDuration] = useState(0)
  const [videoFrameRate, setVideoFrameRate] = useState(null)
  const [videoFrameNumber, setVideoFrameNumber] = useState(0)
  const [videoRangesBuffered, setVideoRangesBuffered] = useState([])
  const nextable = existingRegions.length > 0 || saveable

  // Reset state when video changes
  useEffect(() => {
    setVideoDuration(0)
    setVideoFrameRate(null)
    setVideoFrameNumber(0)
    setVideoRangesBuffered([])
  }, [activeVideoURL])

  const seekToFrame = (frame) => {
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = frame / videoFrameRate
    }
  }

  const regionStartBlob = useRef(null)
  const _setRegionStart = (...args) => {
    regionStartBlob.current = null

    const video = videoElementRef.current
    const outputWidth = THUMBNAIL_WIDTH
    const outputHeight = video.videoHeight / (video.videoWidth / THUMBNAIL_WIDTH)

    const canvas = document.createElement('canvas')
    canvas.width = THUMBNAIL_WIDTH
    canvas.height = Math.floor(outputHeight)

    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, outputWidth, outputHeight)
    canvas.toBlob(
      (blob) => {
        regionStartBlob.current = blob
      },
      'image/jpeg',
      0.8
    )

    setRegionStart(...args)
  }

  const _saveAssociation = () => {
    saveAssociation(regionStartBlob.current)
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1 }}>
        <VideoPlayer
          ref={videoElementRef}
          url={activeVideoURL}
          changingActiveVideo={changingActiveVideo}
          setChangingActiveVideo={setChangingActiveVideo}
          siblingHeights={[TIMELINE_HEIGHT, DETAILS_HEIGHT]}
          setVideoDuration={setVideoDuration}
          frameRate={videoFrameRate}
          setFrameRate={setVideoFrameRate}
          currentFrameNumber={videoFrameNumber}
          setCurrentFrameNumber={setVideoFrameNumber}
          setVideoRangesBuffered={setVideoRangesBuffered}
        />
      </Box>

      <Box sx={{ flex: `0 0 ${TIMELINE_HEIGHT}px` }}>
        <VideoTimeline
          bufferedRegions={videoRangesBuffered}
          existingRegions={existingRegions}
          regionStart={regionStart}
          regionEnd={regionEnd}
          videoDuration={videoDuration}
          currentFrameNumber={videoFrameNumber}
          seekToFrame={seekToFrame}
        />
      </Box>

      <Box sx={{ flex: `0 0 ${DETAILS_HEIGHT}px`, display: 'flex' }}>
        <Box sx={{ flexGrow: 1, textWrap: 'nowrap', overflow: 'hidden' }}>
          <AssociationsDetailsBox
            frameRate={videoFrameRate}
            hasOverlap={hasOverlap}
            regionStart={regionStart}
            regionEnd={regionEnd}
            setStart={() => _setRegionStart(videoFrameNumber)}
            setEnd={() => setRegionEnd(videoFrameNumber)}
            sightingName={sightingName}
            annotations={annotations}
            openSightingDialog={() => setSightingsDialogOpen(true)}
            deleteAnnotation={deleteAnnotation}
          />
        </Box>
        <Box
          sx={{
            width: '200px',
            margin: 1,
            marginLeft: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <StyledButton disabled>Annotation Tools</StyledButton>
          <StyledButton disabled>Export Still Frame</StyledButton>
          <StyledButton
            onClick={_saveAssociation}
            variant="contained"
            color="tertiary"
            disabled={!saveable}
          >
            Save Linkage
          </StyledButton>
          <StyledButton
            onClick={handleNext}
            variant="contained"
            color={nextable ? 'secondary' : 'error'}
            disabled={changingActiveVideo}
          >
            {nextable ? 'Next Video' : 'Skip Video'}
          </StyledButton>
        </Box>
      </Box>
    </Box>
  )
}

export default AssociationsCreateWorkspace
