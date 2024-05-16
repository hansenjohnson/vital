import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import associationsAPI from '../api/linkages'
import sightingsAPI from '../api/sightings'
import videosAPI from '../api/videos'
import { baseURL } from '../api/config'
import { transformSightingData, sortSightingData } from '../utilities/transformers'
import ROUTES from '../constants/routes'

import AssociationsCreateSidebar from './AssociationsCreateSidebar'
import AssociationsCreateWorkspace from './AssociationsCreateWorkspace'
import BlankSlate from '../components/BlankSlate'
import SightingsDialog from '../components/SightingsDialog'

const AssociationsCreateContainer = ({ setRoute, videoFolderId, videoFolderName }) => {
  useEffect(() => {
    window.api.setTitle('Associate & Annotate')
  }, [])

  const [videoFiles, setVideoFiles] = useState([])
  const [completedVideoFiles, setCompletedVideoFiles] = useState([])
  const [allDone, setAllDone] = useState(false)

  const [changingActiveVideo, setChangingActiveVideo] = useState(true)
  const [activeVideoFile, setActiveVideoFileString] = useState('')
  const activeVideoURL = activeVideoFile
    ? `${baseURL}/videos/${videoFolderId}/${activeVideoFile}`
    : ''
  const setActiveVideoFile = async (videoFile) => {
    setChangingActiveVideo(true)
    setChangingActiveVideo(false)
    setActiveVideoFileString(videoFile)
  }
  useEffect(() => {
    if (!videoFolderId) return
    videosAPI.getList(videoFolderId).then((videos) => {
      const videoFileNames = videos.map((video) => video.OptimizedFileName)
      const [firstVideo, ...nonFirstVideos] = videoFileNames
      setActiveVideoFile(firstVideo)
      setVideoFiles(nonFirstVideos)
    })
  }, [videoFolderId])

  const [sightingData, setSightingData] = useState([])
  useEffect(() => {
    sightingsAPI.get(videoFolderName).then((data) => {
      const transformedData = data.map(transformSightingData)
      const sortedData = sortSightingData(transformedData)
      setSightingData(sortedData)
    })
  }, [])

  const [regionStart, setRegionStart] = useState(null)
  const [regionEnd, setRegionEnd] = useState(null)
  const [sightingId, setSightingId] = useState(null)

  const selectedSighting = sightingData.find((sighting) => sighting.id === sightingId)
  const sightingName = selectedSighting
    ? `${selectedSighting.date} ${selectedSighting.observer} ${selectedSighting.letter}`
    : null
  const saveable = regionStart != null && regionEnd != null && sightingName != null

  const [sightingsDialogOpen, setSightingsDialogOpen] = useState(false)
  const selectSighting = (id) => {
    setSightingId(id)
    setSightingsDialogOpen(false)
  }

  const [annotations, setAnnotations] = useState([])
  const deleteAnnotation = () => {}

  const [existingRegions, setExistingRegions] = useState([])

  const clearAssociation = () => {
    setRegionStart(null)
    setRegionEnd(null)
    setSightingId(null)
    setAnnotations([])
  }
  const saveAssociation = async () => {
    const status = await associationsAPI.create({
      StartTime: regionStart,
      EndTime: regionEnd,
      SightingId: sightingId,
      Annotation: annotations,
      VideoFilePath: '',
      ThumbnailFilePath: '',
      CreatedBy: '',
      CreatedDate: `${new Date()}`,
    })

    if (status === true) {
      setExistingRegions([...existingRegions, [regionStart, regionEnd]])
      clearAssociation()
    }
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
    setExistingRegions([])
    clearAssociation()
    setActiveVideoFile(videoFiles[0])
    setVideoFiles(videoFiles.slice(1))
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AssociationsCreateSidebar
        videoFolderName={videoFolderName}
        videoFiles={videoFiles}
        activeVideoFile={activeVideoFile}
        associationsAdded={existingRegions.length}
        associationIsPending={saveable}
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
        <AssociationsCreateWorkspace
          activeVideoURL={activeVideoURL}
          changingActiveVideo={changingActiveVideo}
          handleNext={nextVideo}
          existingRegions={existingRegions}
          regionStart={regionStart}
          regionEnd={regionEnd}
          sightingName={sightingName}
          annotations={annotations}
          setRegionStart={setRegionStart}
          setRegionEnd={setRegionEnd}
          setSightingsDialogOpen={setSightingsDialogOpen}
          deleteAnnotation={deleteAnnotation}
          saveable={saveable}
          saveAssociation={saveAssociation}
        />
      )}

      <SightingsDialog
        open={sightingsDialogOpen}
        handleClose={() => setSightingsDialogOpen(false)}
        sightings={sightingData}
        handleSelect={selectSighting}
      />
    </Box>
  )
}

export default AssociationsCreateContainer
