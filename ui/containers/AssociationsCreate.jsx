import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import useStore from '../store'
import linkagesAPI from '../api/linkages'
import sightingsAPI from '../api/sightings'
import videosAPI from '../api/videos'
import thumbnailsAPI from '../api/thumbnails'
import { baseURL } from '../api/config'

import {
  transformVideoData,
  transformSightingData,
  sortSightingData,
} from '../utilities/transformers'
import { doRegionsOverlap } from '../utilities/numbers'
import ROUTES from '../constants/routes'

import AssociationsCreateSidebar from './AssociationsCreateSidebar'
import AssociationsCreateWorkspace from './AssociationsCreateWorkspace'
import BlankSlate from '../components/BlankSlate'
import SightingsDialog from '../components/SightingsDialog'

const AssociationsCreateContainer = () => {
  const setRoute = useStore((state) => state.setRoute)
  const [videoFolderId, videoFolderName] = useStore(
    useShallow((state) => [state.videoFolderId, state.videoFolderName])
  )

  const [remainingVideos, setRemainingVideos] = useState([])
  const [completedVideos, setCompletedVideos] = useState([])
  const [allDone, setAllDone] = useState(false)

  const [changingActiveVideo, setChangingActiveVideo] = useState(true)
  const [activeVideo, setActiveVideoObj] = useState(null)
  const setActiveVideo = (videoObj) => {
    setChangingActiveVideo(true)
    setActiveVideoObj(videoObj)
  }
  const activeVideoFileName = activeVideo ? activeVideo.fileName : ''
  const activeVideoURL = activeVideo
    ? `${baseURL}/videos/${videoFolderId}/${activeVideoFileName}`
    : ''

  useEffect(() => {
    if (!videoFolderId) return
    videosAPI.getList(videoFolderId).then((videoRows) => {
      const videos = videoRows.map(transformVideoData)
      const [firstVideo, ...nonFirstVideos] = videos
      setActiveVideo(firstVideo)
      setRemainingVideos(nonFirstVideos)
    })
  }, [videoFolderId])

  const [sightingData, setSightingData] = useState([])
  useEffect(() => {
    sightingsAPI.get(videoFolderName).then((data) => {
      const transformedData = data.map(transformSightingData)
      const sortedData = sortSightingData(transformedData)
      setSightingData(sortedData)
    })
  }, [videoFolderName])

  const [existingRegions, setExistingRegions] = useState([])

  const [regionStart, setRegionStart] = useState(null)
  const [regionEnd, setRegionEnd] = useState(null)
  const [sightingId, setSightingId] = useState(null)

  const selectedSighting = sightingData.find((sighting) => sighting.id === sightingId)
  const sightingName = selectedSighting
    ? `${selectedSighting.date} ${selectedSighting.observer} ${selectedSighting.letter}`
    : null

  const overlapsAnotherRegionForThisLetter = existingRegions
    .filter((region) => region.letter === selectedSighting.letter)
    .some((region) => doRegionsOverlap(region.start, region.end, regionStart, regionEnd))
  const saveable = (() => {
    if (regionStart == null) return false
    if (regionEnd == null) return false
    if (sightingName == null) return false
    if (overlapsAnotherRegionForThisLetter) return false
    return true
  })()

  const [sightingsDialogOpen, setSightingsDialogOpen] = useState(false)
  const selectSighting = (id) => {
    setSightingId(id)
    setSightingsDialogOpen(false)
  }

  const [annotations, setAnnotations] = useState([])
  const deleteAnnotation = () => {}

  const clearAssociation = (clearAll = false) => {
    setRegionStart(null)
    setRegionEnd(null)
    setAnnotations([])
    // NOTE: we do not clear sightingId. This enables the user to more quickly tag the same mammal
    // within the current video. They only need to set a new region.
    if (clearAll) {
      setSightingId(null)
    }
  }

  const saveAssociation = async (thumbnailBlob) => {
    const thumbnailPartialPath = thumbnailsAPI.formulatePath(
      sightingId,
      selectedSighting.date,
      activeVideoFileName,
      regionStart
    )
    const thumbnailStatus = await thumbnailsAPI.save(thumbnailPartialPath, thumbnailBlob)

    const status =
      thumbnailStatus &&
      (await linkagesAPI.create({
        CatalogVideoId: activeVideo.id,
        StartTime: regionStart,
        EndTime: regionEnd,
        SightingId: sightingId,
        Annotation: annotations,
        ThumbnailFilePath: thumbnailPartialPath,
        CreatedDate: `${new Date()}`,
      }))

    if (status === true) {
      const newRegion = {
        letter: selectedSighting.letter,
        start: regionStart,
        end: regionEnd,
      }
      setExistingRegions([...existingRegions, newRegion])
      clearAssociation()
    }
  }

  const nextVideo = () => {
    if (activeVideo) {
      setCompletedVideos([...completedVideos, activeVideo])
    }
    if (remainingVideos.length === 0) {
      setActiveVideo(null)
      setAllDone(true)
      return
    }
    setExistingRegions([])
    clearAssociation(true)
    setActiveVideo(remainingVideos[0])
    setRemainingVideos(remainingVideos.slice(1))
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AssociationsCreateSidebar
        videoFolderName={videoFolderName}
        videoFiles={remainingVideos.map((video) => video.fileName)}
        activeVideoFile={activeVideoFileName}
        associationsAdded={existingRegions.length}
        associationIsPending={saveable}
        completedVideoFiles={completedVideos.map((video) => video.fileName)}
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
          setChangingActiveVideo={setChangingActiveVideo}
          handleNext={nextVideo}
          existingRegions={existingRegions}
          hasOverlap={overlapsAnotherRegionForThisLetter}
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
