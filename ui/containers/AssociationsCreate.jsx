import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import AssociationsCreateSidebar from './AssociationsCreateSidebar'
import AssociationsCreateWorkspace from './AssociationsCreateWorkspace'
import BlankSlate from '../components/BlankSlate'
import filepathsAPI from '../api/filepaths'
import associationsAPI from '../api/associations'
import { splitPath } from '../utilities/paths'
import ROUTES from '../constants/routes'

const AssociationsCreateContainer = ({ setRoute, folderOfVideosToCreate }) => {
  useEffect(() => {
    window.api.setTitle('Associate & Annotate')
  }, [])

  const folderPathParts = splitPath(folderOfVideosToCreate)
  const videoFolderName = folderPathParts[folderPathParts.length - 1]

  const [videoFiles, setVideoFiles] = useState([])
  const [activeVideoFile, setActiveVideoFile] = useState('')
  const [completedVideoFiles, setCompletedVideoFiles] = useState([])
  const [allDone, setAllDone] = useState(false)

  useEffect(() => {
    filepathsAPI.listDirectory(folderOfVideosToCreate).then((filepaths) => {
      setActiveVideoFile(filepaths[0])
      setVideoFiles(filepaths.slice(1))
    })
  }, [folderOfVideosToCreate])

  const saveAssociation = (associationData) => {
    associationsAPI.create(associationData)
  }

  const nextVideo = () => {
    if (activeVideoFile) {
      setCompletedVideoFiles([...completedVideoFiles, activeVideoFile])
    }
    if (videoFiles.length === 0) {
      setActiveVideoFile('')
      setAllDone(true)
      return
    }
    setActiveVideoFile(videoFiles[0])
    setVideoFiles(videoFiles.slice(1))
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AssociationsCreateSidebar
        videoFolderName={videoFolderName}
        videoFiles={videoFiles}
        activeVideoFile={activeVideoFile}
        completedVideoFiles={completedVideoFiles}
      />
      {allDone ? (
        <BlankSlate
          message="You've completed creating assoications for this folder of videos."
          messageWidth={55}
          action={
            <Button sx={{ paddingLeft: 2, paddingRight: 2 }} onClick={() => setRoute(ROUTES.TOOLS)}>
              Return Home
            </Button>
          }
        />
      ) : (
        <AssociationsCreateWorkspace handleSave={saveAssociation} handleNext={nextVideo} />
      )}
    </Box>
  )
}

export default AssociationsCreateContainer
