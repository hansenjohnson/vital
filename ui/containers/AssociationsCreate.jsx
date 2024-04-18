import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { Divider, IconButton, Typography } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import ArtTrackIcon from '@mui/icons-material/ArtTrack'
import PostAddIcon from '@mui/icons-material/PostAdd'

import openFolderIcon from '../assets/open-folder-64.png'
import { blackPixelToTheme } from '../theme'

const dummyData = {
  videoFolderName: '2021-10-13 TC/DASH8',
  videoFiles: [
    'whale-video-007.mp4',
    'whale-video-008.mp4',
    'whale-video-012.mp4',
    'whale-video-009.mp4',
    'whale-video-013.mp4',
    'whale-video-001.mp4',
    'whale-video-002.mp4',
    'whale-video-003.mp4',
    'whale-video-004.mp4',
    'whale-video-005.mp4',
    'whale-video-006.mp4',
    'whale-video-014.mp4',
    'whale-video-015.mp4',
    'whale-video-016.mp4',
    'whale-video-017.mp4',
    'whale-video-018.mp4',
    'whale-video-019.mp4',
    'whale-video-020.mp4',
  ],
  activeVideoFile: 'whale-video-004.mp4',
  completedVideoFiles: [
    'whale-video-101.mp4',
    'whale-video-102.mp4',
    'whale-video-103.mp4',
    'whale-video-104.mp4',
    'whale-video-105.mp4',
    'whale-video-106.mp4',
    'whale-video-107.mp4',
    'whale-video-108.mp4',
    'whale-video-109.mp4',
    'whale-video-110.mp4',
    'whale-video-111.mp4',
    'whale-video-112.mp4',
    'whale-video-113.mp4',
    'whale-video-114.mp4',
  ],
}

const sectionHeading = {
  color: 'text.secondary',
  fontSize: '24px',
  fontWeight: 700,
}
//wordBreak: 'break-all',
const AssociationsCreateContainer = () => {
  useEffect(() => {
    window.api.setTitle('Associate & Annotate')
  }, [])

  const [videoFolderName, setVideoFolderName] = useState(dummyData.videoFolderName || '')
  const [videoFiles, setVideoFiles] = useState(dummyData.videoFiles || [])
  const [activeVideoFile, setActiveVideoFile] = useState(dummyData.activeVideoFile || '')
  const [completedVideoFiles, setCompletedVideoFiles] = useState(
    dummyData.completedVideoFiles || []
  )
  const [showCompletedVideos, setShowCompletedVideos] = useState(false)

  const NUM_VIDEOS_TO_SHOW = showCompletedVideos ? 5 : 10
  const additionalVideos =
    videoFiles.length > NUM_VIDEOS_TO_SHOW ? videoFiles.length - NUM_VIDEOS_TO_SHOW : 0

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box
        sx={{
          width: '400px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: 1,
          gap: 1,
        }}
      >
        {/* Viewing Folder Header */}
        <Box
          sx={{
            width: '100%',
            padding: 1,
            borderRadius: 1,
            backgroundColor: 'primary.light',
            color: 'primary.dark',
          }}
        >
          <Typography sx={{ lineHeight: '16px', marginBottom: 0.5 }}>
            viewing videos within
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              overflow: 'hidden',
              wordBreak: 'break-all',
            }}
          >
            <img
              src={openFolderIcon}
              alt="open folder"
              style={{
                width: '24px',
                height: '24px',
                filter: blackPixelToTheme.palette.primary.dark,
              }}
            />
            <Typography sx={{ fontSize: '24px', lineHeight: '24px', fontWeight: 700 }}>
              {videoFolderName}
            </Typography>
          </Box>
        </Box>

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
            <Typography sx={sectionHeading}>Unprocessed Videos</Typography>
            {videoFiles.slice(0, NUM_VIDEOS_TO_SHOW).map((videoFile, index) => (
              <Typography key={videoFile} sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
                {videoFile}
                <Box sx={{ display: 'inline', color: 'text.disabled' }}>
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
            <Typography sx={sectionHeading}>In Progress</Typography>
            <Typography
              sx={{
                fontFamily: "'Sometype Mono Variable', monopace",
                color: 'secondary.main',
                fontSize: '20px',
              }}
            >
              {activeVideoFile}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ArtTrackIcon sx={{ color: 'secondary.light' }} />
              <Typography sx={{ color: 'secondary.light' }}>3 Associations Added</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PostAddIcon sx={{ color: 'text.secondary' }} />
              <Typography sx={{ color: 'text.secondary' }}>1 Association Pending</Typography>
            </Box>
          </Box>

          <Divider sx={{ marginTop: 1, marginBottom: 1 }} />

          {/* Completed Videos Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography sx={sectionHeading}>
                  Completed Videos ({completedVideoFiles.length})
                </Typography>
              </Box>
              {completedVideoFiles.length > 0 && (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <IconButton>
                    <PlayArrowIcon
                      sx={{
                        transform: showCompletedVideos ? 'rotate(90deg)' : 'rotate(180deg)',
                      }}
                      onClick={() => setShowCompletedVideos(!showCompletedVideos)}
                    />
                  </IconButton>
                </Box>
              )}
            </Box>
            {showCompletedVideos &&
              completedVideoFiles.map((videoFile) => (
                <Typography
                  key={videoFile}
                  sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}
                >
                  {videoFile}
                </Typography>
              ))}
          </Box>
        </Box>
      </Box>
      <Box>right side</Box>
    </Box>
  )
}

export default AssociationsCreateContainer
