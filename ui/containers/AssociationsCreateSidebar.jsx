import { useState } from 'react'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ArtTrackIcon from '@mui/icons-material/ArtTrack'
import PostAddIcon from '@mui/icons-material/PostAdd'

import Sidebar from '../components/Sidebar'
import CreationHeader from '../components/CreationHeader'
import SectionHeading from '../components/SectionHeading'
import IconNote from '../components/IconNote'

const AssociationsCreateSidebar = ({
  videoFolderName,
  videoFiles,
  activeVideoFile,
  completedVideoFiles,
}) => {
  const [showCompletedVideos, setShowCompletedVideos] = useState(false)
  const NUM_VIDEOS_TO_SHOW = showCompletedVideos ? 5 : 10
  const additionalVideos =
    videoFiles.length > NUM_VIDEOS_TO_SHOW ? videoFiles.length - NUM_VIDEOS_TO_SHOW : 0

  return (
    <Sidebar>
      <CreationHeader videoFolderName={videoFolderName} />

      <Box
        sx={{
          height: '100%',
          overflowY: 'auto',
          overflowX: 'hidden',
          wordBreak: 'break-all',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Unprocessed Videos Section */}
        <Box sx={{ flexGrow: 1 }}>
          <SectionHeading>Unprocessed Videos</SectionHeading>
          {videoFiles.slice(0, NUM_VIDEOS_TO_SHOW).map((videoFile, index) => (
            <Typography key={videoFile} sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
              {videoFile}
              <Box component="span" sx={{ color: 'text.disabled' }}>
                {index === 0 ? ' - up next' : ''}
              </Box>
            </Typography>
          ))}
          {additionalVideos > 0 && (
            <Typography sx={{ color: 'text.secondary' }}>+ {additionalVideos} more</Typography>
          )}
        </Box>

        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />

        {/* In Progress Video Section */}
        <Box>
          <SectionHeading>In Progress</SectionHeading>
          <Typography
            sx={{
              fontFamily: "'Sometype Mono Variable', monopace",
              color: 'secondary.main',
              fontSize: '20px',
            }}
          >
            {activeVideoFile}
          </Typography>
          <IconNote icon={ArtTrackIcon} note="3 Associations Added" color="secondary.light" />
          <IconNote icon={PostAddIcon} note="1 Association Pending" />
        </Box>

        <Divider sx={{ marginTop: 1, marginBottom: 1 }} />

        {/* Completed Videos Section */}
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ flexGrow: 1 }}>
              <SectionHeading>Completed Videos ({completedVideoFiles.length})</SectionHeading>
            </Box>
            {completedVideoFiles.length > 0 && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <IconButton onClick={() => setShowCompletedVideos(!showCompletedVideos)}>
                  <PlayArrowIcon
                    sx={{ transform: showCompletedVideos ? 'rotate(90deg)' : 'rotate(180deg)' }}
                  />
                </IconButton>
              </Box>
            )}
          </Box>
          {showCompletedVideos &&
            completedVideoFiles.map((videoFile) => (
              <Typography key={videoFile} sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
                {videoFile}
              </Typography>
            ))}
        </Box>
      </Box>
    </Sidebar>
  )
}

export default AssociationsCreateSidebar
