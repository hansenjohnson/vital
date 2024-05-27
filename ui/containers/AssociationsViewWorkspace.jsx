import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'

import useStore from '../store'
import { getActiveVideoURL } from '../store/associations-create'
import { getSelectedSightingName } from '../store/sightings'
import { useValueAndSetter } from '../store/utils'
import { leafPath } from '../utilities/paths'

import VideoPlayer from '../components/VideoPlayer'
import VideoTimeline from '../components/VideoTimeline'
import AssociationsEditBox from '../components/AssociationEditBox'
import StyledButton from '../components/StyledButton'

const TIMELINE_HEIGHT = 48
const DETAILS_HEIGHT = 245

const AssociationsViewWorkspace = () => {
  const existingRegions = useStore((state) => state.existingRegions)
  const activeVideo = useStore((state) => state.activeVideo)
  const activeVideoURL = useStore(getActiveVideoURL)
  const [activeVideoLoading, setActiveVideoLoading] = useValueAndSetter(
    useStore,
    'activeVideoLoading',
    'setActiveVideoLoading'
  )
  const activeVideoName = activeVideo ? leafPath(activeVideo.fileName) : ''

  // Active Linkage State
  const [regionStart, setRegionStart] = useValueAndSetter(useStore, 'regionStart', 'setRegionStart')
  const [regionEnd, setRegionEnd] = useValueAndSetter(useStore, 'regionEnd', 'setRegionEnd')
  const annotations = useStore((state) => state.annotations)
  const setSightingsDialogOpen = useStore((state) => state.setSightingsDialogOpen)
  const sightingName = useStore(getSelectedSightingName)
  const saveAssociation = useStore((state) => state.saveAssociation)
  const linkageThumbnail = useStore((state) => state.linkageThumbnail)

  // Video State that we imperatively subscribe to
  const videoElementRef = useRef(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoFrameRate, setVideoFrameRate] = useState(null)
  const [videoFrameNumber, setVideoFrameNumber] = useState(0)
  const [videoRangesBuffered, setVideoRangesBuffered] = useState([])

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

  const enterAddMode = () => {}
  const deleteAssociation = () => {}

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1 }}>
        <VideoPlayer
          ref={videoElementRef}
          url={activeVideoURL}
          changingActiveVideo={activeVideoLoading}
          setChangingActiveVideo={setActiveVideoLoading}
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
          <AssociationsEditBox
            videoName={activeVideoName}
            frameRate={videoFrameRate}
            regionStart={regionStart}
            regionEnd={regionEnd}
            sightingName={sightingName}
            annotations={annotations}
            deleteAnnotation={() => null}
            thumbnail={linkageThumbnail}
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
          <StyledButton onClick={enterAddMode} color="tertiary" disabled={activeVideoLoading}>
            Add Association
          </StyledButton>
          <StyledButton
            onClick={deleteAssociation}
            variant="contained"
            color="error"
            disabled={activeVideoLoading}
          >
            Delete
          </StyledButton>
        </Box>
      </Box>
    </Box>
  )
}

export default AssociationsViewWorkspace
