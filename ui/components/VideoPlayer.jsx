import { useEffect, useRef, useState, forwardRef } from 'react'
import { MediaPlayer } from 'dashjs'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

import useWindowSize from '../hooks/useWindowSize'
import { timecodeFromFrameNumber } from '../utilities/video'
import BlankSlate from './BlankSlate'

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

const VideoPlayer = forwardRef((props, videoElementRef) => {
  const {
    url,
    changingActiveVideo,
    setChangingActiveVideo,
    siblingHeights,
    setVideoDuration,
    frameRate,
    currentFrameNumber,
    setCurrentFrameNumber,
    setVideoRangesBuffered,
  } = props
  const theme = useTheme()

  // Responding to Window Resize with a Lock to 16/9 Aspect Ratio
  const heightToLeaveForSiblings = siblingHeights.reduce((acc, height) => acc + height, 0)
  const { windowWidth, windowHeight } = useWindowSize()
  const videoContainerRef = useRef(null)
  const [widerContainer, setWiderContainer] = useState(false)
  useEffect(() => {
    if (!videoContainerRef.current) return
    const { clientWidth, clientHeight } = videoContainerRef.current
    const videoContainerAspectRatio = clientWidth / clientHeight
    const tooMuchAspectRatio = videoContainerAspectRatio > 16 / 9
    const enoughHeightForSiblings = windowHeight - clientHeight > heightToLeaveForSiblings
    if (!enoughHeightForSiblings || tooMuchAspectRatio) {
      setWiderContainer(true)
    } else {
      setWiderContainer(false)
    }
  }, [videoContainerRef, windowWidth, windowHeight])

  // Video Player, Init/Destroy Loop, URL reactivity
  const playerRef = useRef(null)
  const [videoIs, setVideoIs] = useState(VIDEO_STATES.LOADING)

  useEffect(() => {
    if (changingActiveVideo) {
      setVideoIs(VIDEO_STATES.LOADING)
    }
  }, [changingActiveVideo])

  const loadingFinished = () => {
    // move immediatley from Loading to Playing because of Auto-Play
    setVideoIs(VIDEO_STATES.PLAYING)
    setChangingActiveVideo(false)
  }

  const initializePlayer = (videoElement, url) => {
    playerRef.current = MediaPlayer().create()
    playerRef.current.initialize()
    playerRef.current.on('canPlay', loadingFinished)

    playerRef.current.updateSettings({
      streaming: {
        buffer: {
          bufferTimeAtTopQuality: 120,
          bufferTimeAtTopQualityLongForm: 120,
          bufferToKeep: 120,
        },
      },
    })

    if (videoElement) {
      playerRef.current.attachView(videoElement)
    }

    if (url) {
      console.log('Attaching Source:', url)
      playerRef.current.attachSource(url)
    }
  }

  const destroyPlayer = () => {
    if (!playerRef.current) return
    playerRef.current.off('canPlay', loadingFinished)
    playerRef.current.destroy()
    playerRef.current = null
  }

  useEffect(() => {
    setVideoIs(VIDEO_STATES.LOADING)
    initializePlayer(videoElementRef.current, url)
    return destroyPlayer
  }, [url])

  // Play Controls
  const playVideo = () => {
    const video = videoElementRef.current
    if (!video) return

    video.play()
    setVideoIs(VIDEO_STATES.PLAYING)
  }
  const pauseVideo = () => {
    const video = videoElementRef.current
    if (!video) return
    video.pause()
    setVideoIs(VIDEO_STATES.PAUSED)
  }

  // Sync Video Element state with UI components
  useEffect(() => {
    if (!videoElementRef.current) return

    const reportOnDuration = () => {
      const durationAsFrames = Math.floor(videoElementRef.current?.duration * frameRate)
      setVideoDuration(durationAsFrames)
    }

    const reportOnBuffer = () => {
      const bufferedRanges = Array.from(Array(videoElementRef.current?.buffered.length || 0)).map(
        (_, index) => {
          const bufferStartAsFrameNum = videoElementRef.current?.buffered.start(index) * frameRate
          const bufferendAsFrameNum = videoElementRef.current?.buffered.end(index) * frameRate
          return [bufferStartAsFrameNum, bufferendAsFrameNum]
        }
      )
      setVideoRangesBuffered(bufferedRanges)
    }

    const handleVideoEnded = () => {
      setVideoIs(VIDEO_STATES.PAUSED)
    }

    videoElementRef.current?.addEventListener('durationchange', reportOnDuration)
    videoElementRef.current?.addEventListener('progress', reportOnBuffer)
    videoElementRef.current?.addEventListener('ended', handleVideoEnded)

    return () => {
      videoElementRef.current?.removeEventListener('durationchange', reportOnDuration)
      videoElementRef.current?.removeEventListener('progress', reportOnBuffer)
      videoElementRef.current?.removeEventListener('ended', handleVideoEnded)
    }
  }, [frameRate, url])

  // High-Frequency Timestamp Reporting
  useEffect(() => {
    const video = videoElementRef.current
    if (!video) return

    let callbackId
    const videoFrameCallback = (now, metadata) => {
      const timeInSeconds = metadata.mediaTime
      const frameNumber = Math.floor(timeInSeconds * frameRate)
      setCurrentFrameNumber(frameNumber)
      callbackId = video.requestVideoFrameCallback(videoFrameCallback)
    }
    // Initial spawn
    callbackId = video.requestVideoFrameCallback(videoFrameCallback)
    return () => video.cancelVideoFrameCallback(callbackId)
  }, [frameRate, url])

  // Fullscreen Controls
  // Chromium renders default controls on Fullscreen Video,
  // so we don't need to implement our own exitFullscreen
  const enterFullscreen = () => {
    if (!videoElementRef.current) return
    videoElementRef.current.requestFullscreen()
  }

  if (!url) {
    return <BlankSlate message="Select a Video or Linkage to get started" messageWidth={100} />
  }

  return (
    <Box
      ref={videoContainerRef}
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
          ref={videoElementRef}
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
