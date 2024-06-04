import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

import useStore from '../../store'
import { useValueAndSetter } from '../../store/utils'
import ROUTES from '../../constants/routes'
import AssociationsCreateSidebar from './AssociationsCreateSidebar'
import AssociationsCreateWorkspace from '../AssociationsCreateWorkspace'
import BlankSlate from '../../components/BlankSlate'
import SightingsDialog from '../../components/SightingsDialog'

const AssociationsCreateContainer = () => {
  const [resetStore, setRoute] = useStore(useShallow((state) => [state.resetStore, state.setRoute]))
  const [videoFolderId, videoFolderName] = useStore(
    useShallow((state) => [state.videoFolderId, state.videoFolderName])
  )

  // Video Data
  const activeVideo = useStore((state) => state.activeVideo)
  const remainingVideos = useStore((state) => state.remainingVideos)
  const completedVideos = useStore((state) => state.completedVideos)
  const loadVideos = useStore((state) => state.loadVideos)
  useEffect(() => {
    if (!videoFolderId) return
    loadVideos(videoFolderId)
  }, [videoFolderId])

  // Sighting Data
  const sightings = useStore((state) => state.sightings)
  const loadSightings = useStore((state) => state.loadSightings)
  useEffect(() => {
    loadSightings(videoFolderName)
  }, [videoFolderName])
  const selectSighting = useStore((state) => state.selectSighting)
  const [sightingsDialogOpen, setSightingsDialogOpen] = useValueAndSetter(
    useStore,
    'sightingsDialogOpen',
    'setSightingsDialogOpen'
  )

  const returnHome = () => {
    setRoute(ROUTES.TOOLS)
    resetStore()
  }

  const allDone = activeVideo == null && remainingVideos.length === 0 && completedVideos.length > 0
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AssociationsCreateSidebar />

      {allDone ? (
        <BlankSlate
          message="You've completed creating assoications for this folder of videos."
          messageWidth={55}
          action={
            <Button sx={{ paddingLeft: 2, paddingRight: 2 }} onClick={returnHome}>
              Return Home
            </Button>
          }
        />
      ) : (
        <AssociationsCreateWorkspace />
      )}

      <SightingsDialog
        open={sightingsDialogOpen}
        handleClose={() => setSightingsDialogOpen(false)}
        sightings={sightings}
        handleSelect={selectSighting}
      />
    </Box>
  )
}

export default AssociationsCreateContainer
