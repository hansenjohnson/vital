import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'

import useStore from '../store'
import { getActiveVideo } from '../store/videos'
import { getSelectedSightingName } from '../store/sightings'
import { linkagesForActiveVideo } from '../store/linkages'
import { useValueAndSetter } from '../store/utils'
import { leafPath } from '../utilities/paths'
import { frameRateFromStr } from '../utilities/video'
import { regionDataForLinkage } from '../utilities/transformers'
import videosAPI from '../api/videos'
import stillExportsAPI from '../api/stillExports'

import VideoPlayer from '../components/VideoPlayer'
import VideoTimeline from '../components/VideoTimeline'
import LinkageEditBox from '../components/LinkageEditBox'
import StyledButton from '../components/StyledButton'

const TIMELINE_HEIGHT = 48
const DETAILS_HEIGHT = 245

const LinkageWorkspace = () => {
  const activeVideo = useStore(getActiveVideo)
  const activeVideoURL = activeVideo
    ? videosAPI.getVideoURL(activeVideo.folderId, activeVideo.fileName)
    : ''
  const [activeVideoLoading, setActiveVideoLoading] = useValueAndSetter(
    useStore,
    'activeVideoLoading',
    'setActiveVideoLoading'
  )
  const activeVideoName = activeVideo ? leafPath(activeVideo.fileName) : ''
  // TODO: maybe use a useShallow here?
  const existingRegions = useStore((state) =>
    linkagesForActiveVideo(state).map(regionDataForLinkage)
  )
  const videoFrameRate = activeVideo && frameRateFromStr(activeVideo.frameRate)

  // Active Linkage State
  const activeLinkageId = useStore((state) => state.activeLinkageId)
  const [regionStart, setRegionStart] = useValueAndSetter(useStore, 'regionStart', 'setRegionStart')
  const [regionEnd, setRegionEnd] = useValueAndSetter(useStore, 'regionEnd', 'setRegionEnd')
  const annotations = useStore((state) => state.annotations)
  const setSightingsDialogOpen = useStore((state) => state.setSightingsDialogOpen)
  const sightingName = useStore(getSelectedSightingName)
  const saveAssociation = useStore((state) => state.saveAssociation)
  const linkageThumbnail = useStore((state) => state.linkageThumbnail)
  const deleteLinkage = useStore((state) => state.deleteLinkage)

  // Video State that we imperatively subscribe to
  const videoElementRef = useRef(null)
  const [videoDuration, setVideoDuration] = useState(0)
  const [videoFrameNumber, setVideoFrameNumber] = useState(0)
  const [videoRangesBuffered, setVideoRangesBuffered] = useState([])

  // Reset state when video changes
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

  // Set the playhead to the region start
  const previousVideoURL = useRef(null)
  useEffect(() => {
    if (!activeVideoURL) return
    if (!videoElementRef.current) return
    const video = videoElementRef.current

    // The video didn't change, so we can just react to the region start changing
    if (previousVideoURL.current === activeVideoURL) {
      seekToFrame(regionStart)
      video.play()
      return
    }

    const seekAfterVideoHasDuration = () => {
      seekToFrame(regionStart)
      video.play()
      video.removeEventListener('durationchange', seekAfterVideoHasDuration)
    }

    video.addEventListener('durationchange', seekAfterVideoHasDuration)
    previousVideoURL.current = activeVideoURL

    return () => {
      video.removeEventListener('durationchange', seekAfterVideoHasDuration)
    }
  }, [activeVideoURL, regionStart])

  // TODO: fix this
  // useEffect(() => {
  //   if (!videoElementRef.current) return
  //   if (videoFrameNumber >= regionEnd) {
  //     videoElementRef.current.pause()
  //   }
  // }, [videoFrameNumber])

  // Linkage Selection via Timeline
  const linkages = useStore((state) => state.linkages)
  const setActiveLinkage = useStore((state) => state.setActiveLinkage)
  const selectLinkageByRegion = (start, end) => {
    const linkageToSelect = linkages.find(
      (linkage) => linkage.regionStart === start && linkage.regionEnd === end
    )
    setActiveLinkage(linkageToSelect)
  }

  const enterAddMode = () => {}

  const exportStillFrame = () => {
    stillExportsAPI.create(
      activeVideo.id,
      `test-${Math.floor(Math.random() * 10000)}.jpg`,
      videoFrameNumber
    )
  }

  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ flexGrow: 1 }}>
        <VideoPlayer
          ref={videoElementRef}
          url={activeVideoURL}
          changingActiveVideo={activeVideoLoading}
          setChangingActiveVideo={setActiveVideoLoading}
          siblingHeights={[TIMELINE_HEIGHT, DETAILS_HEIGHT]}
          setVideoDuration={setVideoDuration}
          frameRate={videoFrameRate}
          setFrameRate={() => null}
          currentFrameNumber={videoFrameNumber}
          setCurrentFrameNumber={setVideoFrameNumber}
          setVideoRangesBuffered={setVideoRangesBuffered}
        />
      </Box>

      <Box sx={{ flex: `0 0 ${TIMELINE_HEIGHT}px` }}>
        <VideoTimeline
          bufferedRegions={videoRangesBuffered}
          existingRegions={existingRegions}
          regionStart={regionStart}
          regionEnd={regionEnd}
          videoDuration={videoDuration}
          currentFrameNumber={videoFrameNumber}
          seekToFrame={seekToFrame}
          showRegionAsSelected
          selectableRegions
          selectRegion={selectLinkageByRegion}
        />
      </Box>

      <Box sx={{ flex: `0 0 ${DETAILS_HEIGHT}px`, display: 'flex' }}>
        <Box sx={{ flexGrow: 1, textWrap: 'nowrap', overflow: 'hidden' }}>
          <LinkageEditBox
            videoName={activeVideoName}
            frameRate={videoFrameRate}
            regionStart={regionStart}
            regionEnd={regionEnd}
            sightingName={sightingName}
            annotations={annotations}
            deleteAnnotation={() => null}
            thumbnail={linkageThumbnail}
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
          <StyledButton disabled>Annotation Tools</StyledButton>
          <StyledButton onClick={exportStillFrame}>Export Still Frame</StyledButton>
          <StyledButton
            onClick={enterAddMode}
            color="tertiary"
            disabled={!activeVideo || activeVideoLoading}
          >
            Add Association
          </StyledButton>
          <StyledButton
            onClick={() => deleteLinkage(activeLinkageId)}
            variant="contained"
            color="error"
            disabled={!activeVideo || activeVideoLoading}
          >
            Delete
          </StyledButton>
        </Box>
      </Box>
    </Box>
  )
}

export default LinkageWorkspace
