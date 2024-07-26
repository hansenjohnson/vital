import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'

import useStore from '../store'
import { activeLinkageWithNewSightingHasOverlap } from '../store/sightings'

import LinkageSidebar from './LinkageSidebar'
import LinkageWorkspace from './LinkageWorkspace'
import SightingsDialog from '../components/SightingsDialog'

const LinkageAnnotationPage = () => {
  const sightingsDialogOpen = useStore((state) => state.sightingsDialogOpen)
  const setSightingsDialogOpen = useStore((state) => state.setSightingsDialogOpen)
  const selectSighting = useStore((state) => state.selectSighting)
  const selectedSightingId = useStore((state) => state.selectedSightingId)

  const sightings = useStore((state) => state.sightings)
  const loadSightings = useStore((state) => state.loadSightings)
  const selectedFolderId = useStore((state) => state.selectedFolderId)
  const selectLinkageVideoSighting = useStore((state) => state.selectLinkageVideoSighting)
  useEffect(() => {
    if (!selectedFolderId) return
    selectLinkageVideoSighting(null, null, null)
    loadSightings()
  }, [selectedFolderId])

  // Active Linkage Sighting Editing
  const linkageMode = useStore((state) => state.linkageMode)
  const [newSightingId, setNewSightingId] = useState(null)
  const closeSightingsDialog = () => {
    setSightingsDialogOpen(false)
    setNewSightingId(null)
  }
  const newSightingHasOverlap = useStore((state) =>
    activeLinkageWithNewSightingHasOverlap(state, newSightingId)
  )
  const activeLinkageId = useStore((state) => state.activeLinkageId)
  const updateLinkage = useStore((state) => state.updateLinkage)
  const saveSightingEdit = async () => {
    await updateLinkage(activeLinkageId, { SightingId: newSightingId })
    // TODO: only call this id the update completed successfully
    selectSighting(newSightingId)
  }

  // Spacebar capture/overwrite
  useEffect(() => {
    const registerHotkeys = (event) => {
      if (event.key === ' ') {
        event.preventDefault()
        event.target.blur()
      }
    }
    window.addEventListener('keydown', registerHotkeys)
    return () => window.removeEventListener('keydown', registerHotkeys)
  }, [])

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <LinkageSidebar />
      <LinkageWorkspace />

      <SightingsDialog
        open={sightingsDialogOpen}
        handleClose={closeSightingsDialog}
        mode={linkageMode}
        sightings={sightings}
        selectSighting={selectSighting}
        selectedSightingId={selectedSightingId}
        newSightingId={newSightingId}
        setNewSightingId={setNewSightingId}
        newSightingHasOverlap={newSightingHasOverlap}
        saveable={newSightingId !== null && !newSightingHasOverlap}
        handleSave={saveSightingEdit}
      />
    </Box>
  )
}

export default LinkageAnnotationPage
