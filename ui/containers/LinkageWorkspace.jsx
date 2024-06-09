import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'

import useStore from '../store'
import useSettingsStore from '../store/settings'
import { getActiveVideo } from '../store/videos'
import {
  getSelectedSighting,
  getSelectedSightingName,
  selectedSightingHasOverlap,
} from '../store/sightings'
import { getActiveLinkage, linkagesForActiveVideo, isSaveable } from '../store/linkages'
import { getSelectedFolder } from '../store/folders'
import { useValueAndSetter } from '../store/utils'

import { leafPath } from '../utilities/paths'
import { catalogFolderString } from '../utilities/strings'
import {
  frameRateFromStr,
  timecodeFromFrameNumber,
  thumbnailFromVideoElement,
} from '../utilities/video'
import {
  initializePlayer,
  startSubscriptions,
  forceToHighestQuality,
  highestResolutionAvailable,
} from '../utilities/dashPlayer'
import { regionDataForLinkage } from '../utilities/transformers'
import { LINKAGE_MODES } from '../constants/routes'
import { STILL_FRAME_PREVIEW_WIDTH, THUMBNAIL_CHOICE_WIDTH } from '../constants/dimensions'
import SETTING_KEYS from '../constants/settingKeys'

import videosAPI from '../api/videos'
import thumbnailsAPI from '../api/thumbnails'
import stillExportsAPI from '../api/stillExports'

import VideoPlayer from '../components/VideoPlayer'
import VideoTimeline from '../components/VideoTimeline'
import LinkageDetailsBox from '../components/LinkageDetailsBox'
import StyledButton from '../components/StyledButton'
import ExportStillDialog from '../components/ExportStillDialog'
import ThumbnailEditDialog from '../components/ThumbnailEditDialog'

const TIMELINE_HEIGHT = 48
const DETAILS_HEIGHT = 245

const LinkageWorkspace = () => {
  const activeVideoId = useStore((state) => state.activeVideoId)
  const activeVideo = useStore(getActiveVideo)
  const activeVideoURL = activeVideo
    ? videosAPI.getVideoURL(activeVideo.folderId, activeVideo.fileName)
    : ''
  const activeVideoName = activeVideo ? leafPath(activeVideo.fileName) : ''
  const existingRegions = useStore((state) =>
    linkagesForActiveVideo(state).map(regionDataForLinkage)
  )
  const videoFrameRate = activeVideo && frameRateFromStr(activeVideo.frameRate)

  const settings = useSettingsStore((state) => state.settings)
  const selectedFolder = useStore(getSelectedFolder)
  const catalogFolderName = catalogFolderString(selectedFolder)

  // Linkage Creation State & Actions
  const [regionStart, setRegionStart] = useValueAndSetter(useStore, 'regionStart', 'setRegionStart')
  const [regionEnd, setRegionEnd] = useValueAndSetter(useStore, 'regionEnd', 'setRegionEnd')
  const annotations = useStore((state) => state.annotations)
  const setRegionStartAndCaptureThumbnail = useStore(
    (state) => state.setRegionStartAndCaptureThumbnail
  )
  const saveable = useStore(isSaveable)
  const saveLinkage = useStore((state) => state.saveLinkage)

  // Selected/Active Linkage State & Actions
  const activeLinkageId = useStore((state) => state.activeLinkageId)
  const activeLinkage = useStore(getActiveLinkage)
  const selectLinkageVideoSighting = useStore((state) => state.selectLinkageVideoSighting)
  const selectedSightingId = useStore((state) => state.selectedSightingId)
  const selectedSighting = useStore(getSelectedSighting)
  const sightingName = useStore(getSelectedSightingName)
  const setSightingsDialogOpen = useStore((state) => state.setSightingsDialogOpen)
  const thumbnailURL =
    activeLinkage?.thumbnail && thumbnailsAPI.formulateHostedPath(activeLinkage?.thumbnail)
  const hasOverlap = useStore(selectedSightingHasOverlap)
  const deleteLinkage = useStore((state) => state.deleteLinkage)

  // Video State that we imperatively subscribe to
  const videoElementRef = useRef(null)
  const videoFrameNumber = useStore((state) => state.videoFrameNumber)
  const setVideoFrameNumber = useStore((state) => state.setVideoFrameNumber)
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoRangesBuffered, setVideoRangesBuffered] = useState([])
  const [activeVideoLoading, setActiveVideoLoading] = useState(false)
  const [videoResolution, setVideoResolution] = useState('')

  useEffect(() => {
    setVideoDuration(0)
    setVideoFrameNumber(0)
    setVideoRangesBuffered([])
  }, [activeVideoURL])

  const seekToFrame = (frame) => {
    if (videoElementRef.current) {
      videoElementRef.current.currentTime = frame / videoFrameRate
    }
  }

  // DashJS Instance Create/Destroy & Actions
  const mediaPlayerRef = useRef(null)
  const stopSubscriptionsRef = useRef(null)
  useEffect(() => {
    if (!activeVideoURL) return () => null

    setActiveVideoLoading(true)
    const onStreamInitialized = () => {
      setActiveVideoLoading(false)
      setVideoResolution(highestResolutionAvailable(mediaPlayerRef.current))
    }

    mediaPlayerRef.current = initializePlayer(videoElementRef.current, activeVideoURL)
    stopSubscriptionsRef.current = startSubscriptions(
      mediaPlayerRef.current,
      onStreamInitialized,
      null
    )

    return () => {
      stopSubscriptionsRef.current()
      mediaPlayerRef.current.destroy()
      mediaPlayerRef.current = null
    }
  }, [activeVideoURL])

  // Set the playhead to the region start when a Linkage is Selected
  const previousVideoURL = useRef(null)
  useEffect(() => {
    if (linkageMode === LINKAGE_MODES.CREATE) return
    if (!activeLinkageId) return
    if (!activeVideoURL) return
    if (!videoElementRef.current) return

    const video = videoElementRef.current

    // The video didn't change, so just seek to the new regionStart
    if (previousVideoURL.current === activeVideoURL) {
      seekToFrame(activeLinkage?.regionStart)
      video.play()
      return
    }

    const seekAfterVideoHasDuration = () => {
      seekToFrame(activeLinkage?.regionStart)
      video.play()
      video.removeEventListener('durationchange', seekAfterVideoHasDuration)
    }

    video.addEventListener('durationchange', seekAfterVideoHasDuration)
    previousVideoURL.current = activeVideoURL

    return () => {
      video.removeEventListener('durationchange', seekAfterVideoHasDuration)
    }
  }, [activeLinkageId])

  // TODO: fix this
  // useEffect(() => {
  //   if (!videoElementRef.current) return
  //   if (videoFrameNumber >= regionEnd) {
  //     videoElementRef.current.pause()
  //   }
  // }, [videoFrameNumber])

  // Linkage Mode & Selection Handling
  const viewMode = useStore((state) => state.viewMode)
  const setViewMode = useStore((state) => state.setViewMode)
  const linkageMode = useStore((state) => state.linkageMode)
  const setLinkageMode = useStore((state) => state.setLinkageMode)
  const linkages = useStore((state) => state.linkages)
  const selectLinkageByRegion = (start, end) => {
    const linkageToSelect = linkages.find(
      (linkage) => linkage.regionStart === start && linkage.regionEnd === end
    )
    selectLinkageVideoSighting(linkageToSelect.id, activeVideo.id, linkageToSelect.sighting.id)
  }

  // Export Still Frame & Dialog Handling
  const exportStillDialogOpen = useStore((state) => state.exportStillDialogOpen)
  const setExportStillDialogOpen = useStore((state) => state.setExportStillDialogOpen)
  const exportStillPreviewImage = useStore((state) => state.exportStillPreviewImage)
  const setExportStillPreviewImage = useStore((state) => state.setExportStillPreviewImage)

  const handleExportStillClick = async () => {
    videoElementRef.current.pause()
    setExportStillPreviewImage(null)
    setExportStatus(null)
    thumbnailFromVideoElement(videoElementRef.current, STILL_FRAME_PREVIEW_WIDTH).then(
      setExportStillPreviewImage
    )
    setExportStillDialogOpen(true)
  }

  const handlePreviewRefresh = () => {
    stopSubscriptionsRef.current()
    // I don't know why, but seeking pushes the video back one frame, so we account for that with a +1
    forceToHighestQuality(mediaPlayerRef.current, (videoFrameNumber + 1) / videoFrameRate)
    const captureThumbnail = () => {
      thumbnailFromVideoElement(videoElementRef.current, STILL_FRAME_PREVIEW_WIDTH).then(
        (imageBlob) => {
          setExportStillPreviewImage(imageBlob)
          mediaPlayerRef.current.off('canPlay', captureThumbnail)
        }
      )
    }
    mediaPlayerRef.current.on('canPlay', captureThumbnail)
  }

  const [exportStatus, setExportStatus] = useState(null)
  const exportStillFrame = async (fileName) => {
    setExportStatus('exporting')
    const status = await stillExportsAPI.create(activeVideoId, `${fileName}.jpg`, videoFrameNumber)
    setExportStatus(status === true ? 'success' : 'error')
  }

  // Active Linkage Property Editing
  const clearCreatedLinkage = useStore((state) => state.clearCreatedLinkage)
  const regionEditDialog = useStore((state) => state.regionEditDialog)
  const setRegionEditDialog = useStore((state) => state.setRegionEditDialog)
  const openRegionEditDialog = () => {
    setRegionEditDialog(true)
    setRegionStart(activeLinkage.regionStart)
    setRegionEnd(activeLinkage.regionEnd)
  }
  const closeRegionEditDialog = () => {
    setRegionEditDialog(false)
    clearCreatedLinkage()
  }
  const updateLinkage = useStore((state) => state.updateLinkage)
  const saveRegionEdit = () => {
    updateLinkage(activeLinkageId, { StartTime: regionStart, EndTime: regionEnd })
  }

  const [thumbnailEditDialog, setThumbnailEditDialog] = useState(false)
  const [thumbnails, setThumbnails] = useState([])
  const [selectedThumbnailIdx, setSelectedThumbnailIdx] = useState(0)
  const thumbnailEditDialogExited = () => {
    thumbnails.forEach((thumbnailURL) => URL.revokeObjectURL(thumbnailURL))
    setThumbnails([])
  }

  const generateThumbnailsForEditDialog = async () => {
    const video = videoElementRef.current
    video.pause()
    const prevTime = video.currentTime

    // identify the 5 equally spaced frame numbers within the active region
    const startFrame = activeLinkage.regionStart
    const frameGap = activeLinkage.regionEnd - startFrame
    const frameNumbers = Array.from(Array(5)).map((_, idx) =>
      Math.round(startFrame + (frameGap / 4) * idx)
    )

    // An awaitable seek-to-frame function
    const waitForSeekToFrame = (frameNumber) => {
      return new Promise((resolve) => {
        const onCompletion = () => {
          video.removeEventListener('seeked', onCompletion)
          resolve()
        }
        video.addEventListener('seeked', onCompletion)
        seekToFrame(frameNumber)
      })
    }

    // Async loop that generates the thumbnails
    for (const frameNumber of frameNumbers) {
      await waitForSeekToFrame(frameNumber)
      const imageBlob = await thumbnailFromVideoElement(video, THUMBNAIL_CHOICE_WIDTH)
      const thumbnailAsURL = URL.createObjectURL(imageBlob)
      setThumbnails((prevThumbnails) => [...prevThumbnails, thumbnailAsURL])
    }

    // Reset the user to wherever the playhead was before
    video.currentTime = prevTime
  }

  // Linkage Mode Transitions
  const transitionFromEditToCreate = () => {
    selectLinkageVideoSighting(null, activeVideo.id, null)
    setLinkageMode(LINKAGE_MODES.CREATE)
  }

  const saveAndTransitionToEdit = async () => {
    const sightingIdBeforeSave = selectedSightingId
    const newLinkageId = await saveLinkage(true)
    selectLinkageVideoSighting(newLinkageId, activeVideo.id, sightingIdBeforeSave)
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1 }}>
        <VideoPlayer
          ref={videoElementRef}
          url={activeVideoURL}
          siblingHeights={[TIMELINE_HEIGHT, DETAILS_HEIGHT]}
          frameRate={videoFrameRate}
          currentFrameNumber={videoFrameNumber}
          setVideoDuration={setVideoDuration}
          setCurrentFrameNumber={setVideoFrameNumber}
          setVideoRangesBuffered={setVideoRangesBuffered}
        />
      </Box>

      <Box sx={{ flex: `0 0 ${TIMELINE_HEIGHT}px` }}>
        <VideoTimeline
          bufferedRegions={videoRangesBuffered}
          existingRegions={existingRegions}
          regionStart={regionStart || activeLinkage?.regionStart}
          regionEnd={regionEnd || activeLinkage?.regionEnd}
          videoDuration={videoDuration}
          currentFrameNumber={videoFrameNumber}
          seekToFrame={seekToFrame}
          showActiveRegionAsLine={regionStart == null && regionEnd == null}
          selectableRegions
          activeLinkageId={activeLinkageId}
          selectRegion={selectLinkageByRegion}
        />
      </Box>

      <Box sx={{ flex: `0 0 ${DETAILS_HEIGHT}px`, display: 'flex' }}>
        <Box sx={{ flexGrow: 1, textWrap: 'nowrap', overflow: 'hidden' }}>
          <LinkageDetailsBox
            mode={linkageMode}
            setMode={setLinkageMode}
            viewMode={viewMode}
            setViewMode={setViewMode}
            videoName={activeVideoName}
            hasOverlap={hasOverlap}
            frameRate={videoFrameRate}
            regionStart={regionStart || activeLinkage?.regionStart}
            regionEnd={regionEnd || activeLinkage?.regionEnd}
            setStart={() =>
              setRegionStartAndCaptureThumbnail(videoFrameNumber, videoElementRef.current)
            }
            setEnd={() => setRegionEnd(videoFrameNumber)}
            regionEditDialog={regionEditDialog}
            openRegionEditDialog={openRegionEditDialog}
            closeRegionEditDialog={closeRegionEditDialog}
            saveRegionEdit={saveRegionEdit}
            sightingName={sightingName}
            openSightingDialog={() => setSightingsDialogOpen(true)}
            annotations={annotations || activeLinkage?.annotations}
            deleteAnnotation={() => null}
            thumbnail={thumbnailURL}
            openThumbnailEditDialog={() => {
              setThumbnailEditDialog(true)
            }}
            saveable={saveable}
          />
        </Box>
        <Box
          sx={{
            width: '200px',
            margin: 1,
            marginLeft: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {/* Button Slot 1 */}
          {linkageMode === LINKAGE_MODES.BLANK && <StyledButton disabled>&nbsp;</StyledButton>}
          {[LINKAGE_MODES.CREATE, LINKAGE_MODES.EDIT].includes(linkageMode) && (
            <StyledButton disabled>Annotation Tools</StyledButton>
          )}

          {/* Button Slot 2 */}
          {linkageMode === LINKAGE_MODES.BLANK && <StyledButton disabled>&nbsp;</StyledButton>}
          {[LINKAGE_MODES.CREATE, LINKAGE_MODES.EDIT].includes(linkageMode) && (
            <StyledButton
              onClick={handleExportStillClick}
              disabled={
                !activeVideo ||
                activeVideoLoading ||
                (linkageMode === LINKAGE_MODES.CREATE &&
                  (!regionStart || !regionEnd || !sightingName))
              }
            >
              Export Still Frame
            </StyledButton>
          )}

          {/* Button Slot 3 */}
          {linkageMode === LINKAGE_MODES.BLANK && <StyledButton disabled>&nbsp;</StyledButton>}
          {linkageMode === LINKAGE_MODES.CREATE && (
            <StyledButton
              onClick={saveLinkage}
              color="tertiary"
              disabled={!saveable}
              style={{ fontSize: '18px' }}
            >
              Save + Add Another
            </StyledButton>
          )}
          {linkageMode === LINKAGE_MODES.EDIT && (
            <StyledButton
              onClick={() => deleteLinkage(activeLinkageId)}
              color="error"
              disabled={!activeVideo || activeVideoLoading}
            >
              Delete Linkage
            </StyledButton>
          )}

          {/* Button Slot 4 */}
          {linkageMode === LINKAGE_MODES.BLANK && <StyledButton disabled>&nbsp;</StyledButton>}
          {linkageMode === LINKAGE_MODES.CREATE && (
            <StyledButton
              onClick={saveAndTransitionToEdit}
              color="tertiary"
              variant="contained"
              disabled={!saveable}
            >
              Save Linkage
            </StyledButton>
          )}
          {linkageMode === LINKAGE_MODES.EDIT && (
            <StyledButton color="tertiary" onClick={transitionFromEditToCreate}>
              + Add Linkage
            </StyledButton>
          )}
        </Box>
      </Box>

      <ExportStillDialog
        open={exportStillDialogOpen}
        handleClose={() => setExportStillDialogOpen(false)}
        handleExport={exportStillFrame}
        handlePreviewRefresh={handlePreviewRefresh}
        // TODO: find a way to revokeObjectURL
        image={exportStillPreviewImage && URL.createObjectURL(exportStillPreviewImage)}
        videoName={activeVideoName}
        frameNumber={videoFrameNumber}
        timestamp={timecodeFromFrameNumber(videoFrameNumber, videoFrameRate)}
        resolution={videoResolution}
        sightingLetter={selectedSighting?.letter}
        stillExportDir={settings[SETTING_KEYS.STILLEXPORT_DIR_PATH]}
        subFolder={catalogFolderName}
        exportStatus={exportStatus}
      />

      <ThumbnailEditDialog
        open={thumbnailEditDialog}
        handleClose={() => setThumbnailEditDialog(false)}
        onEntered={generateThumbnailsForEditDialog}
        onExited={thumbnailEditDialogExited}
        handleSave={() => null}
        thumbnails={thumbnails}
        selectedThumbnailIdx={selectedThumbnailIdx}
        setSelectedThumbnailIdx={setSelectedThumbnailIdx}
      />
    </Box>
  )
}

export default LinkageWorkspace
