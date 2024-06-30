import { useState, useRef, useEffect, useCallback } from 'react'
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
  jumpToPrevFrame,
  jumpToNextFrame,
} from '../utilities/video'
import { thumbnailFromVideoElement, thumbnailFromBitmap } from '../utilities/image'
import {
  initializePlayer,
  startSubscriptions,
  forceToHighestQuality,
  highestResolutionAvailable,
} from '../utilities/dashPlayer'
import { regionDataForLinkage } from '../utilities/transformers'
import { LINKAGE_MODES } from '../constants/routes'
import {
  STILL_FRAME_PREVIEW_WIDTH,
  THUMBNAIL_CHOICE_HEIGHT,
  THUMBNAIL_CHOICE_WIDTH,
  THUMBNAIL_HEIGHT,
  THUMBNAIL_WIDTH,
} from '../constants/dimensions'
import SETTING_KEYS from '../constants/settingKeys'
import { DRAWING_ON_SCREEN_SECONDS } from '../constants/times'

import videosAPI from '../api/videos'
import thumbnailsAPI from '../api/thumbnails'
import stillExportsAPI from '../api/stillExports'

import VideoPlayer from '../components/VideoPlayer'
import VideoTimeline from '../components/VideoTimeline'
import LinkageDetailsBox from '../components/LinkageDetailsBox'
import StyledButton from '../components/StyledButton'
import ExportStillDialog from '../components/ExportStillDialog'
import ThumbnailEditDialog from '../components/ThumbnailEditDialog'
import AnnotationDisplayLayer from '../components/AnnotationDisplayLayer'
import AnnotationDrawingLayer from '../components/AnnotationDrawingLayer'
import ToolsButtonGroup from '../components/ToolsButtonGroup'

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
  const [annotations, setAnnotations] = useValueAndSetter(useStore, 'annotations', 'setAnnotations')
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
  const hasOverlap = useStore(selectedSightingHasOverlap)
  const deleteLinkage = useStore((state) => state.deleteLinkage)

  const thumbnailCacheBuster = useStore((state) => state.thumbnailCacheBuster)
  const incrementCacheBuster = useStore((state) => state.incrementCacheBuster)
  const getThumbnailFullURL = (partialPath) => {
    let fullURL = thumbnailsAPI.formulateHostedPath(partialPath)
    if (partialPath in thumbnailCacheBuster) {
      fullURL = `${fullURL}?t=${thumbnailCacheBuster[partialPath]}`
    }
    return fullURL
  }
  const thumbnailURL = activeLinkage?.thumbnail && getThumbnailFullURL(activeLinkage?.thumbnail)

  // Video DOM Node, with special reaction to the ref based on: https://stackoverflow.com/a/60066291/3954694
  const [videoElement, setVideoElement] = useState(null)
  const onVideoElementRefChange = useCallback((node) => setVideoElement(node), [])
  const [videoElementRect, setVideoElementRect] = useState(null)

  const alertOnResize = useCallback(() => {
    if (!videoElement) return
    const { left, top, width, height } = videoElement.getBoundingClientRect()
    setVideoElementRect({ left, top, width, height })
  }, [videoElement])

  // Video State that we imperatively subscribe to
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
    if (!videoElement) return
    setAutoPause(false)
    videoElement.currentTime = frame / videoFrameRate
  }

  // DashJS Instance Create/Destroy & Actions
  const mediaPlayerRef = useRef(null)
  const stopSubscriptionsRef = useRef(null)
  useEffect(() => {
    if (!videoElement) return () => null
    if (!activeVideoURL) return () => null

    setActiveVideoLoading(true)
    const onStreamInitialized = () => {
      setActiveVideoLoading(false)
      setVideoResolution(highestResolutionAvailable(mediaPlayerRef.current))
    }

    mediaPlayerRef.current = initializePlayer(videoElement, activeVideoURL)
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
  }, [videoElement, activeVideoURL])

  // Video Hotkeys
  useEffect(() => {
    const registerHotkeys = (event) => {
      if (!videoElement) return
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        videoElement.pause()
        jumpToPrevFrame(videoElement, videoFrameRate)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        videoElement.pause()
        jumpToNextFrame(videoElement, videoFrameRate)
      } else if (event.key === ' ') {
        event.preventDefault()
        event.target.blur()
        if (videoElement.paused) {
          videoElement.play()
        } else {
          videoElement.pause()
        }
      }
    }
    window.addEventListener('keydown', registerHotkeys)
    return () => window.removeEventListener('keydown', registerHotkeys)
  }, [videoElement, videoFrameRate])

  // Convience function to be called from the LinkageSidebar
  const forceQualityTriggerNumber = useStore((state) => state.forceQualityTriggerNumber)
  useEffect(() => {
    if (forceQualityTriggerNumber <= 0) return
    forceToHighestQuality(mediaPlayerRef.current, (videoFrameNumber + 1) / videoFrameRate)
  }, [forceQualityTriggerNumber])

  // Set the playhead to the region start when a Linkage is Selected, aka Auto-Seek
  // We provide the software the ability to forego this functionality with the skipAutoSeek attribute
  const skipAutoSeek = useStore((state) => state.skipAutoSeek)
  const setSkipAutoSeek = useStore((state) => state.setSkipAutoSeek)
  const previousLinkageId = useRef(null)
  const previousVideoURL = useRef(null)
  const previousSkipAutoSeek = useRef(null)
  const autoPauseOnLinkageId = useRef(null)
  useEffect(() => {
    const update = () => {
      previousLinkageId.current = activeLinkage?.id
      previousVideoURL.current = activeVideoURL
      previousSkipAutoSeek.current = skipAutoSeek
    }

    const linkageChanged = previousLinkageId.current !== activeLinkage?.id
    const videoURLChanged = previousVideoURL.current !== activeVideoURL

    if (
      linkageMode === LINKAGE_MODES.CREATE ||
      !activeLinkage ||
      !activeVideoURL ||
      !videoElement ||
      skipAutoSeek ||
      (previousSkipAutoSeek.current === true && skipAutoSeek === false)
    ) {
      setSkipAutoSeek(false)
      update()
      return
    }

    const enableAutoPause = (pairWithId) =>
      videoElement.addEventListener(
        'seeked',
        () => {
          // There is a delay in syncing React state to VideoElement state, so we wait 100ms to compensate.
          // Otherwise we will auto-pause prematurely when seeking to a linkage before the selected one.
          setTimeout(() => (autoPauseOnLinkageId.current = pairWithId), 100)
          setAutoPause(true)
        },
        { once: true }
      )

    // The video didn't change, so just seek to the new regionStart
    if (linkageChanged && !videoURLChanged) {
      enableAutoPause(activeLinkage.id)
      seekToFrame(activeLinkage.regionStart)
      videoElement.play()
      update()
      return
    }

    // A URL change without a linkage change does not present evidence of needing to seek
    // We catch this case here since we need to know if the url changed in the above case
    if (!linkageChanged && videoURLChanged) {
      update()
      return
    }

    // At this point the change is either that we now have a new VideoElement node, or
    // the video and the linkage changed at the same time, so we need to wait
    // for that video to be avaialble before we can perform the seek
    const seekAfterVideoHasDuration = () => {
      enableAutoPause(activeLinkage.id)
      seekToFrame(activeLinkage.regionStart)
      videoElement.play()
    }
    videoElement.addEventListener('durationchange', seekAfterVideoHasDuration, { once: true })
    update()
  }, [JSON.stringify(activeLinkage), activeVideoURL, videoElement, skipAutoSeek])

  // When viewing a linkage, pause the video at the end of the region
  // Auto-pause is enabled as a counter to auto-seek
  const autoPause = useStore((state) => state.autoPause)
  const setAutoPause = useStore((state) => state.setAutoPause)
  useEffect(() => {
    if (!videoElement) return
    if (!activeLinkage) return
    if (!autoPause) return
    if (autoPauseOnLinkageId.current !== activeLinkage.id) return
    if (videoFrameNumber >= activeLinkage.regionEnd) {
      videoElement.pause()
      setAutoPause(false)
      // Note: Due to runtime delays, this might pause the video a few frames later
      // than the region end, but I felt it was too jarring to re-seek after the pause
    }
  }, [videoElement, JSON.stringify(activeLinkage), autoPause, videoFrameNumber])

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
    videoElement.pause()
    setExportStillPreviewImage(null)
    setExportStatus(null)
    thumbnailFromVideoElement(videoElement, STILL_FRAME_PREVIEW_WIDTH).then(
      setExportStillPreviewImage
    )
    setExportStillDialogOpen(true)
  }

  const handlePreviewRefresh = () => {
    stopSubscriptionsRef.current()
    // I don't know why, but seeking pushes the video back one frame, so we account for that with a +1
    forceToHighestQuality(mediaPlayerRef.current, (videoFrameNumber + 1) / videoFrameRate)
    const captureThumbnail = () => {
      thumbnailFromVideoElement(videoElement, STILL_FRAME_PREVIEW_WIDTH).then((imageBlob) => {
        setExportStillPreviewImage(imageBlob)
        mediaPlayerRef.current.off('canPlay', captureThumbnail)
      })
    }
    mediaPlayerRef.current.on('canPlay', captureThumbnail)
  }

  const [exportStatus, setExportStatus] = useState(null)
  const makeAlert = useStore((state) => state.makeAlert)
  const exportStillFrame = async (fileName) => {
    setExportStatus('exporting')
    const fileNameWithExtension = `${fileName}.jpg`
    const status = await stillExportsAPI.create(
      activeVideoId,
      fileNameWithExtension,
      videoFrameNumber,
      selectedSightingId
    )
    setExportStatus(status === 200 ? 'success' : 'error')
    if (status === 409) {
      makeAlert(
        `Export Still Frame failed.
        It appears that you have the Still Exports data file open.
        Please close it before proceeding.`,
        'error'
      )
    }
    return fileNameWithExtension
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
  const [thumbnailBlobs, setThumbnailBlobs] = useState([])
  const [thumbnailURLs, setThumbnailURLs] = useState([])
  const [selectedThumbnailIdx, setSelectedThumbnailIdx] = useState(0)
  const thumbnailEditDialogExited = () => {
    thumbnailURLs.forEach((thumbnailURL) => URL.revokeObjectURL(thumbnailURL))
    setThumbnailURLs([])
    setThumbnailBlobs([])
  }

  const generateThumbnailsForEditDialog = async () => {
    videoElement.pause()
    const prevTime = videoElement.currentTime

    // identify the 5 equally spaced frame numbers within the active region
    const startFrame = activeLinkage.regionStart
    const frameGap = activeLinkage.regionEnd - startFrame
    const frameNumbers = Array.from(Array(5)).map((_, idx) =>
      Math.round(startFrame + (frameGap / 4) * idx)
    )

    // An awaitable seek-to-frame function
    const waitForSeekToFrame = (frameNumber) =>
      new Promise((resolve) => {
        videoElement.addEventListener('seeked', resolve, { once: true })
        seekToFrame(frameNumber)
      })

    // Async loop that generates the thumbnails
    for (const frameNumber of frameNumbers) {
      await waitForSeekToFrame(frameNumber)
      const imageBlob = await thumbnailFromVideoElement(
        videoElement,
        THUMBNAIL_CHOICE_WIDTH,
        THUMBNAIL_CHOICE_HEIGHT
      )
      const thumbnailAsURL = URL.createObjectURL(imageBlob)
      setThumbnailBlobs((prevBlobs) => [...prevBlobs, imageBlob])
      setThumbnailURLs((prevURLs) => [...prevURLs, thumbnailAsURL])
    }

    // Reset the user to wherever the playhead was before
    videoElement.currentTime = prevTime
  }

  const saveThumbnailEdit = async (cropSpec) => {
    // TODO: handle error cases from the awaits
    const selectedThumbnailBlob = thumbnailBlobs[selectedThumbnailIdx]

    // Apply user provided crop while creating a bitmap (which is needed to work with a canvas element)
    const cropArgs = cropSpec ? [cropSpec.x, cropSpec.y, cropSpec.width, cropSpec.height] : []
    const newImageBitmap = await createImageBitmap(selectedThumbnailBlob, ...cropArgs)
    const newThumbnailBlob = await thumbnailFromBitmap(
      newImageBitmap,
      THUMBNAIL_WIDTH,
      THUMBNAIL_HEIGHT
    )

    // We overwrite the thumbnail at the filepath for the linkage
    // but there is nothing to update within the backend data
    await thumbnailsAPI.save(activeLinkage.thumbnail, newThumbnailBlob)
    incrementCacheBuster(activeLinkage.thumbnail)
    setThumbnailEditDialog(false)
  }

  // Annotation Draw Handling
  const drawingOnScreenFrames = DRAWING_ON_SCREEN_SECONDS * videoFrameRate
  const activeDrawTool = useStore((state) => state.activeDrawTool)
  const setActiveDrawTool = useStore((state) => state.setActiveDrawTool)
  const hoverAnnotationIndex = useStore((state) => state.hoverAnnotationIndex)
  const setHoverAnnotationIndex = useStore((state) => state.setHoverAnnotationIndex)
  const selectDrawTool = (tool) => {
    videoElement.pause()
    setActiveDrawTool(tool)
  }
  const hoverAnnotation = (index) => {
    if (linkageMode !== LINKAGE_MODES.EDIT) return
    setHoverAnnotationIndex(index)
  }
  const navigateToAnnotation = (index) => {
    videoElement.pause()
    const annotation =
      linkageMode === LINKAGE_MODES.CREATE ? annotations[index] : activeLinkage.annotations[index]
    // Since seeking isn't frame accurate, skip ahead a few frames to ensure the annotation is visible
    seekToFrame(annotation.frame + 3)
  }
  const addAnnotation = ({ type, x1, y1, x2, y2 }) => {
    const newAnnotation = {
      type,
      x1,
      y1,
      x2,
      y2,
      frame: videoFrameNumber,
    }
    if (linkageMode === LINKAGE_MODES.EDIT) {
      const newAnnotations = [...activeLinkage.annotations, newAnnotation]
      return updateLinkage(activeLinkageId, { Annotation: JSON.stringify(newAnnotations) })
    }
    if (linkageMode === LINKAGE_MODES.CREATE) {
      setAnnotations([...annotations, newAnnotation])
    }
  }
  const deleteAnnotation = (index) => {
    if (linkageMode === LINKAGE_MODES.EDIT) {
      const newAnnotations = activeLinkage.annotations.filter((_, idx) => idx !== index)
      updateLinkage(activeLinkageId, { Annotation: JSON.stringify(newAnnotations) })
    } else if (linkageMode === LINKAGE_MODES.CREATE) {
      const newAnnotations = annotations.filter((_, idx) => idx !== index)
      setAnnotations(newAnnotations)
    }
  }

  // Linkage Mode Transitions
  const transitionFromEditToCreate = () => {
    selectLinkageVideoSighting(null, activeVideo.id, null)
    setLinkageMode(LINKAGE_MODES.CREATE)
  }

  const saveAndTransitionToEdit = async () => {
    const sightingIdBeforeSave = selectedSightingId
    const newLinkageId = await saveLinkage(true)
    if (!newLinkageId) return
    selectLinkageVideoSighting(newLinkageId, activeVideo.id, sightingIdBeforeSave, true)
  }

  // Confirmation Dialog
  const setConfirmationDialogOpen = useStore((state) => state.setConfirmationDialogOpen)
  const setConfirmationDialogProps = useStore((state) => state.setConfirmationDialogProps)
  const openConfirmationDialog = (props) => {
    setConfirmationDialogOpen(true)
    setConfirmationDialogProps(props)
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative', flexGrow: 1 }}>
        <VideoPlayer
          ref={videoElement}
          onVideoElementRefChange={onVideoElementRefChange}
          url={activeVideoURL}
          siblingHeights={[TIMELINE_HEIGHT, DETAILS_HEIGHT]}
          frameRate={videoFrameRate}
          currentFrameNumber={videoFrameNumber}
          setVideoDuration={setVideoDuration}
          setCurrentFrameNumber={setVideoFrameNumber}
          setVideoRangesBuffered={setVideoRangesBuffered}
          alertOnResize={alertOnResize}
        />

        <AnnotationDisplayLayer
          rect={videoElementRect}
          annotations={annotations.length ? annotations : activeLinkage?.annotations}
          hoveredAnnotation={hoverAnnotationIndex}
          currentFrame={videoFrameNumber}
          frameRate={videoFrameRate}
        />
        <AnnotationDrawingLayer
          rect={videoElementRect}
          tool={activeDrawTool}
          addAnnotation={addAnnotation}
          disabled={
            videoFrameNumber < activeLinkage?.regionStart ||
            videoFrameNumber > activeLinkage?.regionEnd - drawingOnScreenFrames
          }
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
            setStart={() => setRegionStartAndCaptureThumbnail(videoFrameNumber, videoElement)}
            setEnd={() => setRegionEnd(videoFrameNumber)}
            regionEditDialog={regionEditDialog}
            openRegionEditDialog={openRegionEditDialog}
            closeRegionEditDialog={closeRegionEditDialog}
            saveRegionEdit={saveRegionEdit}
            sightingName={sightingName}
            openSightingDialog={() => setSightingsDialogOpen(true)}
            annotations={annotations.length ? annotations : activeLinkage?.annotations}
            hoverAnnotation={hoverAnnotation}
            navigateToAnnotation={navigateToAnnotation}
            deleteAnnotation={deleteAnnotation}
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
            <ToolsButtonGroup
              activeTool={activeDrawTool}
              setActiveTool={selectDrawTool}
              disabled={!activeVideo || activeVideoLoading}
            />
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
              onClick={() =>
                openConfirmationDialog({
                  title: 'Delete Linkage',
                  body: 'Are you sure you want to delete this linkage?',
                  onConfirm: () => deleteLinkage(activeLinkageId),
                })
              }
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
              Save & View
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
        handleSave={saveThumbnailEdit}
        existingThumbnail={thumbnailURL}
        thumbnails={thumbnailURLs}
        selectedThumbnailIdx={selectedThumbnailIdx}
        setSelectedThumbnailIdx={setSelectedThumbnailIdx}
      />
    </Box>
  )
}

export default LinkageWorkspace
