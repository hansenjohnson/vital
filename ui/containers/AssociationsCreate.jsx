import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'

import AssociationsCreateSidebar from './AssociationsCreateSidebar'
import AssociationsCreateWorkspace from './AssociationsCreateWorkspace'
import { splitPath } from '../utilities/paths'
import { creation as dummyData } from '../constants/dummyData'

const AssociationsCreateContainer = ({ folderOfVideosToCreate }) => {
  useEffect(() => {
    window.api.setTitle('Associate & Annotate')
  }, [])

  const folderPathParts = splitPath(folderOfVideosToCreate)
  const videoFolderName = folderPathParts[folderPathParts.length - 1]

  const [videoFiles, setVideoFiles] = useState(dummyData.videoFiles || [])
  const [activeVideoFile, setActiveVideoFile] = useState(dummyData.activeVideoFile || '')
  const [completedVideoFiles, setCompletedVideoFiles] = useState(
    dummyData.completedVideoFiles || []
  )

  const saveAssociation = () => {}
  const skipVideo = () => {}

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AssociationsCreateSidebar
        videoFolderName={videoFolderName}
        videoFiles={videoFiles}
        activeVideoFile={activeVideoFile}
        completedVideoFiles={completedVideoFiles}
      />
      <AssociationsCreateWorkspace handleSave={saveAssociation} handleSkip={skipVideo} />
    </Box>
  )
}

export default AssociationsCreateContainer
