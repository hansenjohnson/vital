import { useEffect } from 'react'
import Box from '@mui/material/Box'

import useStore from '../store'
import { useValueAndSetter } from '../store/utils'
import LinkageSidebar from './LinkageSidebar'
import LinkageWorkspace from './LinkageWorkspace'
import SightingsDialog from '../components/SightingsDialog'

const LinkageAnnotationTool = () => {
  // Sighting Data
  const sightings = useStore((state) => state.sightings)
  const selectSighting = useStore((state) => state.selectSighting)
  const [sightingsDialogOpen, setSightingsDialogOpen] = useValueAndSetter(
    useStore,
    'sightingsDialogOpen',
    'setSightingsDialogOpen'
  )

  const selectedFolderId = useStore((state) => state.selectedFolderId)
  const loadSightings = useStore((state) => state.loadSightings)
  useEffect(() => {
    if (!selectedFolderId) return
    loadSightings()
  }, [selectedFolderId])

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <LinkageSidebar />
      <LinkageWorkspace />

      <SightingsDialog
        open={sightingsDialogOpen}
        handleClose={() => setSightingsDialogOpen(false)}
        sightings={sightings}
        handleSelect={selectSighting}
      />
    </Box>
  )
}

export default LinkageAnnotationTool
