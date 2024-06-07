import { useEffect } from 'react'
import Box from '@mui/material/Box'

import useStore from '../store'
import { getActiveVideo } from '../store/videos'
import stillExportsAPI from '../api/stillExports'
import { frameRateFromStr, timecodeFromFrameNumber } from '../utilities/video'
import { leafPath } from '../utilities/paths'

import LinkageSidebar from './LinkageSidebar'
import LinkageWorkspace from './LinkageWorkspace'
import SightingsDialog from '../components/SightingsDialog'
import ExportStillDialog from '../components/ExportStillDialog'

const LinkageAnnotationTool = () => {
  const selectSighting = useStore((state) => state.selectSighting)
  const sightingsDialogOpen = useStore((state) => state.sightingsDialogOpen)
  const setSightingsDialogOpen = useStore((state) => state.setSightingsDialogOpen)

  const sightings = useStore((state) => state.sightings)
  const loadSightings = useStore((state) => state.loadSightings)
  const selectedFolderId = useStore((state) => state.selectedFolderId)
  useEffect(() => {
    if (!selectedFolderId) return
    loadSightings()
  }, [selectedFolderId])

  const activeVideoId = useStore((state) => state.activeVideoId)
  const activeVideo = useStore(getActiveVideo)
  const videoFrameNumber = useStore((state) => state.videoFrameNumber)
  const videoFrameRate = activeVideo && frameRateFromStr(activeVideo.frameRate)
  const activeVideoName = activeVideo ? leafPath(activeVideo.fileName) : ''

  const exportStillDialogOpen = useStore((state) => state.exportStillDialogOpen)
  const setExportStillDialogOpen = useStore((state) => state.setExportStillDialogOpen)
  const exportStillPreviewImage = useStore((state) => state.exportStillPreviewImage)
  const exportStillFrame = () => {
    stillExportsAPI.create(
      activeVideoId,
      `test-${Math.floor(Math.random() * 10000)}.jpg`,
      videoFrameNumber
    )
  }

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

      <ExportStillDialog
        open={exportStillDialogOpen}
        handleClose={() => setExportStillDialogOpen(false)}
        handleExport={exportStillFrame}
        image={exportStillPreviewImage && URL.createObjectURL(exportStillPreviewImage)}
        videoName={activeVideoName}
        timestamp={timecodeFromFrameNumber(videoFrameNumber, videoFrameRate)}
        resolution="0000x0000"
      />
    </Box>
  )
}

export default LinkageAnnotationTool
