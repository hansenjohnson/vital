import Box from '@mui/material/Box'

import useStore from '../store'
import { useValueAndSetter } from '../store/utils'
import AssociationsViewSidebar from './AssociationsViewSidebar'
import AssociationsViewWorkspace from './AssociationsViewWorkspace'
import SightingsDialog from '../components/SightingsDialog'

const AssociationsViewContainer = () => {
  // Sighting Data
  // const sightings = useStore((state) => state.sightings)
  // const loadSightings = useStore((state) => state.loadSightings)
  // useEffect(() => {
  //   loadSightings(videoFolderName)
  // }, [videoFolderName])
  const sightings = []
  const selectSighting = useStore((state) => state.selectSighting)
  const [sightingsDialogOpen, setSightingsDialogOpen] = useValueAndSetter(
    useStore,
    'sightingsDialogOpen',
    'setSightingsDialogOpen'
  )

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AssociationsViewSidebar />
      <AssociationsViewWorkspace />

      <SightingsDialog
        open={sightingsDialogOpen}
        handleClose={() => setSightingsDialogOpen(false)}
        sightings={sightings}
        handleSelect={selectSighting}
      />
    </Box>
  )
}

export default AssociationsViewContainer
