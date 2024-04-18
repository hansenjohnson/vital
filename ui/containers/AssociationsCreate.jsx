import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'

import AssociationsCreateSidebar from './AssociationsCreateSidebar'
import AssociationsCreateWorkspace from './AssociationsCreateWorkspace'
import { creation as dummyData } from '../constants/dummyData'

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

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AssociationsCreateSidebar
        videoFolderName={videoFolderName}
        videoFiles={videoFiles}
        activeVideoFile={activeVideoFile}
        completedVideoFiles={completedVideoFiles}
      />
      <AssociationsCreateWorkspace />
    </Box>
  )
}

export default AssociationsCreateContainer
