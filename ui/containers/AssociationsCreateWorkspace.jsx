import { useState } from 'react'
import Box from '@mui/material/Box'

import VideoPlayer from '../components/VideoPlayer'
import VideoTimeline from '../components/VideoTimeline'
import AssociationsDetailsBox from '../components/AssociationDetailsBox'
import StyledButton from '../components/StyledButton'

const TIMELINE_HEIGHT = 48
const DETAILS_HEIGHT = 245

const AssociationsCreateWorkspace = ({
  activeVideoURL,
  handleNext,
  existingRegions,
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
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoCurrentTime, setVideoCurrentTime] = useState(0)
  const [videoPercentBuffered, setVideoPercentBuffered] = useState(0)
  const nextable = existingRegions.length > 0 || saveable

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1 }}>
        <VideoPlayer
          url={activeVideoURL}
          siblingHeights={[TIMELINE_HEIGHT, DETAILS_HEIGHT]}
          setVideoDuration={setVideoDuration}
          setVideoCurrentTime={setVideoCurrentTime}
          setVideoPercentBuffered={setVideoPercentBuffered}
        />
      </Box>

      <Box sx={{ flex: `0 0 ${TIMELINE_HEIGHT}px` }}>
        <VideoTimeline
          percentBuffered={videoPercentBuffered}
          existingRegions={existingRegions}
          regionStart={regionStart}
          regionEnd={regionEnd}
          videoDuration={videoDuration}
          currentTime={videoCurrentTime}
        />
      </Box>

      <Box sx={{ flex: `0 0 ${DETAILS_HEIGHT}px`, display: 'flex' }}>
        <Box sx={{ flexGrow: 1, textWrap: 'nowrap', overflow: 'hidden' }}>
          <AssociationsDetailsBox
            regionStart={regionStart}
            regionEnd={regionEnd}
            setStart={() => setRegionStart(videoCurrentTime)}
            setEnd={() => setRegionEnd(videoCurrentTime)}
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
            onClick={saveAssociation}
            variant="contained"
            color="tertiary"
            disabled={!saveable}
          >
            Save Association
          </StyledButton>
          <StyledButton
            onClick={handleNext}
            variant="contained"
            color={nextable ? 'secondary' : 'error'}
          >
            {nextable ? 'Next Video' : 'Skip Video'}
          </StyledButton>
        </Box>
      </Box>
    </Box>
  )
}

export default AssociationsCreateWorkspace
