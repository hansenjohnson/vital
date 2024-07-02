import { useEffect, useCallback, useState, forwardRef } from 'react'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

import useWindowSize from '../hooks/useWindowSize'
import { timecodeFromFrameNumber } from '../utilities/video'
import { TITLEBAR_HEIGHT } from '../constants/dimensions'
import BlankSlate from './BlankSlate'

const MORE_TRUE_TITLEBAR_HEIGHT = TITLEBAR_HEIGHT - 0.5
const PLAYER_CONTROLS_WIDTH = 150
const PLAYER_CONTROLS_HEIGHT = 50
const CONTENT_SHADOW = '0px 0px 4px rgba(255, 255, 255, 0.7)'
const VIDEO_STATES = {
  LOADING: 'LOADING',
  PLAYING: 'PLAYING',
  PAUSED: 'PAUSED',
}

const controlIconStyle = {
  fontSize: '20px',
  filter: `drop-shadow(${CONTENT_SHADOW})`,
}

const VideoPlayer = forwardRef((props, videoElement) => {
  const {
    onVideoElementRefChange,
    url,
    siblingHeights,
    setVideoDuration,
    frameRate,
    currentFrameNumber,
    setCurrentFrameNumber,
    setVideoRangesBuffered,
    alertOnResize,
  } = props
  const theme = useTheme()

  // Container DOM Node, with special reaction to the ref based on: https://stackoverflow.com/a/60066291/3954694
  const [videoContainer, setVideoContainer] = useState(null)
  const onVideoContainerRefChange = useCallback((node) => setVideoContainer(node), [])

  // Responding to Window Resize with a Lock to 16/9 Aspect Ratio
  const heightToLeaveForSiblings = siblingHeights.reduce((acc, height) => acc + height, 0)
  const { windowWidth, windowHeight } = useWindowSize()
  const [widerContainer, setWiderContainer] = useState(false)
  useEffect(() => {
    if (!videoContainer) return
    const { clientWidth, clientHeight } = videoContainer
    const videoContainerAspectRatio = clientWidth / clientHeight
    const tooMuchAspectRatio = videoContainerAspectRatio > 16 / 9
    const enoughHeightForSiblings =
      windowHeight - MORE_TRUE_TITLEBAR_HEIGHT - clientHeight >= heightToLeaveForSiblings
    if (!enoughHeightForSiblings || tooMuchAspectRatio) {
      setWiderContainer(true)
    } else {
      setWiderContainer(false)
    }

    // Wait one tick so that React can re-render the video element based on the new size,
    // and more importantly, the new widerContainer
    const timeoutId = setTimeout(alertOnResize, 0)
    return () => clearTimeout(timeoutId)
  }, [videoContainer, windowWidth, windowHeight, alertOnResize])

  // Play Controls
  const playVideo = () => {
    if (!videoElement) return
    videoElement.play()
  }
  const pauseVideo = () => {
    if (!videoElement) return
    videoElement.pause()
  }

  const [videoIs, setVideoIs] = useState(VIDEO_STATES.LOADING)
  const handleLoadStart = () => {
    setVideoIs(VIDEO_STATES.LOADING)
  }
  const handleVideoCanPlay = () => {
    // Sometimes canplay gets in a race with play
    if (videoElement.paused === true) {
      setVideoIs(VIDEO_STATES.PAUSED)
    }
  }
  const handleVideoPlay = () => {
    setVideoIs(VIDEO_STATES.PLAYING)
  }
  const handleVideoPause = () => {
    setVideoIs(VIDEO_STATES.PAUSED)
  }
  const handleVideoEnded = () => {
    setVideoIs(VIDEO_STATES.PAUSED)
  }

  // Sync Video Element state with UI components
  useEffect(() => {
    if (!videoElement) return

    const reportOnDuration = () => {
      const durationAsFrames = Math.floor(videoElement.duration * frameRate)
      setVideoDuration(durationAsFrames)
    }

    const reportOnBuffer = () => {
      const bufferedRanges = Array.from(Array(videoElement.buffered.length || 0)).map(
        (_, index) => {
          const bufferStartAsFrameNum = videoElement.buffered.start(index) * frameRate
          const bufferendAsFrameNum = videoElement.buffered.end(index) * frameRate
          return [bufferStartAsFrameNum, bufferendAsFrameNum]
        }
      )
      setVideoRangesBuffered(bufferedRanges)
    }

    const listeners = {
      durationchange: reportOnDuration,
      progress: reportOnBuffer,
      loadstart: handleLoadStart,
      canplay: handleVideoCanPlay,
      play: handleVideoPlay,
      pause: handleVideoPause,
      ended: handleVideoEnded,
    }
    Object.entries(listeners).forEach(([event, handler]) => {
      videoElement.addEventListener(event, handler)
    })
    return () => {
      Object.entries(listeners).forEach(([event, handler]) => {
        videoElement.removeEventListener(event, handler)
      })
    }
  }, [videoElement, frameRate, url])

  // High-Frequency Timestamp Reporting
  useEffect(() => {
    if (!videoElement) return

    let callbackId
    const videoFrameCallback = (now, metadata) => {
      const timeInSeconds = metadata.mediaTime
      const frameNumber = Math.floor(timeInSeconds * frameRate)
      setCurrentFrameNumber(frameNumber)
      callbackId = videoElement.requestVideoFrameCallback(videoFrameCallback)
    }
    // Initial spawn
    callbackId = videoElement.requestVideoFrameCallback(videoFrameCallback)
    return () => videoElement.cancelVideoFrameCallback(callbackId)
  }, [videoElement, frameRate, url])

  // Fullscreen Controls
  // Chromium renders default controls on Fullscreen Video,
  // so we don't need to implement our own exitFullscreen
  const enterFullscreen = () => {
    if (!videoElement) return
    videoElement.requestFullscreen()
  }
  useEffect(() => {
    if (!videoElement) return
    const fullscreenChanged = () => {
      if (!document.fullscreenElement) {
        alertOnResize()
      }
    }
    document.addEventListener('fullscreenchange', fullscreenChanged)
    return () => document.removeEventListener('fullscreenchange', fullscreenChanged)
  }, [videoElement])

  if (!url) {
    return <BlankSlate message="Select a Video or Linkage to get started" messageWidth={100} />
  }

  return (
    <Box
      ref={onVideoContainerRefChange}
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        display: 'grid',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          // enable for debugging
          // backgroundColor: 'rgba(255, 0, 0, 0.3)',
          width: widerContainer ? 'auto' : '100%',
          height: widerContainer ? '100%' : 'auto',
          aspectRatio: '16 / 9',
          objectFit: 'contain',
          overflow: 'hidden',
          margin: 'auto',
          position: 'relative',
        }}
      >
        <video
          ref={onVideoElementRefChange}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectPosition: 'center',
            objectFit: 'contain',
          }}
        ></video>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: theme.spacing(-1),
          width: `calc(${PLAYER_CONTROLS_WIDTH}px + ${theme.spacing(3)})`,
          height: `${PLAYER_CONTROLS_HEIGHT}px`,
          zIndex: 5,
        }}
      >
        {/* Video Controls Backdrop */}
        <Box
          sx={{
            position: 'absolute',
            width: `calc(${PLAYER_CONTROLS_WIDTH}px + ${theme.spacing(1)})`,
            height: `calc(${PLAYER_CONTROLS_HEIGHT}px + ${theme.spacing(1)})`,
            background: 'linear-gradient(0deg, rgba(0, 0, 0, 1) 40%, rgba(0, 0, 0, 0) 90%)',
            filter: 'blur(6px)',
          }}
        />

        {/* Video Controls */}
        <Box
          sx={{
            position: 'absolute',
            bottom: theme.spacing(0.25),
            left: theme.spacing(1.25),
            width: `${PLAYER_CONTROLS_WIDTH}px`,
            height: `calc(${PLAYER_CONTROLS_HEIGHT}px - ${theme.spacing(2)})`,
            fontFamily: "'Sometype Mono Variable', monopace",
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
          }}
        >
          {videoIs === VIDEO_STATES.LOADING ? (
            <CircularProgress
              color="inherit"
              size={16}
              sx={{ marginLeft: 0.25, textShadow: CONTENT_SHADOW }}
            />
          ) : (
            <>
              <IconButton
                sx={{ width: '24px', height: '24px' }}
                onClick={videoIs === VIDEO_STATES.PLAYING ? pauseVideo : playVideo}
              >
                {videoIs === VIDEO_STATES.PLAYING ? (
                  <PauseIcon sx={controlIconStyle} />
                ) : (
                  <PlayArrowIcon sx={controlIconStyle} />
                )}
              </IconButton>
              <IconButton sx={{ width: '24px', height: '24px' }} onClick={enterFullscreen}>
                <FullscreenIcon sx={controlIconStyle} />
              </IconButton>
              <Box sx={{ marginLeft: 0.25, textShadow: CONTENT_SHADOW }}>
                {timecodeFromFrameNumber(currentFrameNumber, frameRate)}
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  )
})

VideoPlayer.displayName = 'VideoPlayer'
export default VideoPlayer
