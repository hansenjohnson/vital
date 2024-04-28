import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'

import AssociationsCreateSidebar from './AssociationsCreateSidebar'
import AssociationsCreateWorkspace from './AssociationsCreateWorkspace'
import { splitPath } from '../utilities/paths'
import { creation as dummyData } from '../constants/dummyData'

import VideosApi from '../api/videos'
import { act } from 'react-dom/test-utils'

const AssociationsCreateContainer = ({ folderOfVideosToCreate }) => {
  useEffect(() => {
    window.api.setTitle('Associate & Annotate')
  }, [])

  const folderPathParts = splitPath(folderOfVideosToCreate)
  const videoFolderName = folderPathParts[folderPathParts.length - 1]

  const [videoFiles, setVideoFiles] = useState([])
  const [activeVideoFile, setActiveVideoFile] = useState(dummyData.activeVideoFile || '')
  const [completedVideoFiles, setCompletedVideoFiles] = useState(
    dummyData.completedVideoFiles || []
  )

  useEffect(() => {
    fetchVideoFiles()
  }, [])

  const saveAssociation = () => {}
  const skipVideo = () => {}

  const fetchVideoFiles = async () => {
    const videos = await VideosApi.getList()
    setVideoFiles(videos)
    setActiveVideoFile(videos[0])
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AssociationsCreateSidebar
        videoFolderName={videoFolderName}
        videoFiles={videoFiles}
        activeVideoFile={activeVideoFile}
        completedVideoFiles={completedVideoFiles}
      />
      {activeVideoFile ? (
        <AssociationsCreateWorkspace
          handleSave={saveAssociation}
          handleSkip={skipVideo}
          activeVideoFile={activeVideoFile}
        />
      ) : (
        <div>Loading...</div>
      )}
    </Box>
  )
}

export default AssociationsCreateContainer
