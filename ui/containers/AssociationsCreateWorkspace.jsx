import { useState } from 'react'
import Box from '@mui/material/Box'

import VideoPlayer from '../components/VideoPlayer'
import VideoTimeline from '../components/VideoTimeline'
import AssociationsDetailsBox from '../components/AssociationDetailsBox'
import StyledButton from '../components/StyledButton'
import SightingsDialog from '../components/SightingsDialog'
import {
  association as dummyAssociation,
  video as dummyVideo,
  sightings as dummySightings,
} from '../constants/dummyData'

const TIMELINE_HEIGHT = 48
const DETAILS_HEIGHT = 245

const AssociationsCreateWorkspace = ({ handleSave, handleSkip, activeVideoFile }) => {
  const setStart = () => {}
  const setEnd = () => {}

  // const saveable = regionStart || regionEnd || sightingName
  const saveable = true

  const [sightingsDialogOpen, setSightingsDialogOpen] = useState(false)
  const openSightingDialog = () => {
    setSightingsDialogOpen(true)
  }

  const deleteAnnotation = () => {}

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1 }}>
        <VideoPlayer url={`http://localhost:5000/videos/${activeVideoFile}.mpd`} />
      </Box>

      <Box sx={{ flex: `0 0 ${TIMELINE_HEIGHT}px` }}>
        <VideoTimeline
          percentBuffered={dummyVideo.percentBuffered}
          existingRegions={dummyVideo.existingRegions}
          regionStart={dummyVideo.regionStart}
          regionEnd={dummyVideo.regionEnd}
          videoDuration={dummyVideo.videoDuration}
          currentTime={dummyVideo.currentTime}
        />
      </Box>

      <Box sx={{ flex: `0 0 ${DETAILS_HEIGHT}px`, display: 'flex' }}>
        <Box sx={{ flexGrow: 1, textWrap: 'nowrap', overflow: 'hidden' }}>
          <AssociationsDetailsBox
            regionStart={dummyAssociation.regionStart}
            regionEnd={dummyAssociation.regionEnd}
            setStart={setStart}
            setEnd={setEnd}
            sightingName={dummyAssociation.sightingName}
            annotations={dummyAssociation.annotations}
            openSightingDialog={openSightingDialog}
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
            onClick={handleSave}
            variant="contained"
            color="tertiary"
            disabled={!saveable}
          >
            Save Association
          </StyledButton>
          <StyledButton
            onClick={handleSkip}
            variant="contained"
            color={saveable ? 'secondary' : 'error'}
          >
            {saveable ? 'Next Video' : 'Skip Video'}
          </StyledButton>
        </Box>
      </Box>

      <SightingsDialog
        open={sightingsDialogOpen}
        handleClose={() => setSightingsDialogOpen(false)}
        sightings={dummySightings}
      />
    </Box>
  )
}

export default AssociationsCreateWorkspace
