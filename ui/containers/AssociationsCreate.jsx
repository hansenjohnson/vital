import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'

const dummyData = {
  videoFolderName: '2021-10-13 TC/DASH8',
  videoFiles: ['whale-video-001.mp4', 'whale-video-002.mp4', 'whale-video-003.mp4'],
  activeVideoFile: 'whale-video-004.mp4',
}

const AssociationsCreateContainer = () => {
  useEffect(() => {
    window.api.setTitle('Associate & Annotate')
  }, [])

  const [videoFolderName, setVideoFolderName] = useState(dummyData.videoFolderName || '')
  const [videoFiles, setVideoFiles] = useState(dummyData.videoFiles || [])
  const [activeVideoFile, setActiveVideoFile] = useState(dummyData.activeVideoFile || '')

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
        <Box>
          Viewing videos within
          <br />
          {videoFolderName}
        </Box>

        <Box>Unprocessed Videos</Box>
        {videoFiles.map((videoFile) => (
          <span key={videoFile}>{videoFile}</span>
        ))}

        <Box>
          In Progress
          <br />
          {activeVideoFile}
        </Box>

        <Box>Completed Videos &lt;</Box>
      </Box>
      <Box>right side</Box>
    </Box>
  )
}

export default AssociationsCreateContainer
