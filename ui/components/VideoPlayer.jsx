import { useEffect, useRef, useState } from 'react'
import { MediaPlayer } from 'dashjs'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

import useWindowSize from '../hooks/useWindowSize'

import dashjs from 'dashjs'

const PLAYER_CONTROLS_WIDTH = 150
const PLAYER_CONTROLS_HEIGHT = 50
const CONTENT_SHADOW = '0px 0px 4px rgba(255, 255, 255, 0.5)'

const controlIconStyle = {
  fontSize: '20px',
  filter: `drop-shadow(${CONTENT_SHADOW})`,
}

const VideoPlayer = ({
  url,
  siblingHeights,
  setVideoDuration,
  setVideoCurrentTime,
  setVideoPercentBuffered,
}) => {
  const theme = useTheme()

  useEffect(() => {
    let player
    if (videoRef.current) {
      // Initialize dash.js player
      player = dashjs.MediaPlayer().create()
      player.initialize(videoRef.current, url, true)
    }

  // Video Player, Init/Destroy Loop, URL reactivity
  const playerRef = useRef(null)
  const videoElementRef = useRef(null)
  const [isLoading, setIsLoading] = useState(false)
  const [playing, setPlaying] = useState(false)
  const loadingFinished = () => {
    setIsLoading(false)
    setPlaying(true) // because Auto-Play
  }

  const initializePlayer = (videoElement, url) => {
    playerRef.current = MediaPlayer().create()
    playerRef.current.initialize()
    playerRef.current.on('canPlay', loadingFinished)

    playerRef.current.updateSettings({
      streaming: {
        buffer: {
          stableBufferTime: 120,
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
    setPlaying(false)
    setIsLoading(true)
    initializePlayer(videoElementRef.current, url)
    return destroyPlayer
  }, [url])

  // Play Controls
  const playVideo = () => {
    const video = videoElementRef.current
    if (!video) return

    video.play()
    setPlaying(true)
  }
  const pauseVideo = () => {
    const video = videoElementRef.current
    if (!video) return
    video.pause()
    setPlaying(false)
  }

  // Sync Video Element state with UI components
  // TODO: convert this to a timestamp (which requires frame rate as well)
  const [currentTime, setCurrentTime] = useState(0)
  useEffect(() => {
    if (!videoElementRef.current) return

    const reportOnDuration = () => {
      setVideoDuration(videoElementRef.current?.duration)
    }
    const reportOnTime = () => {
      setVideoCurrentTime(videoElementRef.current?.currentTime)
      setCurrentTime(videoElementRef.current?.currentTime)
    }
    // TODO: publish this to setVideoPercentBuffered
    const reportOnBuffer = () => {
      Array.from(Array(videoElementRef.current?.buffered.length)).forEach((_, index) => {
        console.log(
          `Buffered: ${videoElementRef.current?.buffered.start(index)} - ${videoElementRef.current?.buffered.end(index)}`
        )
      })
    }

    videoElementRef.current?.addEventListener('durationchange', reportOnDuration)
    videoElementRef.current?.addEventListener('timeupdate', reportOnTime)
    videoElementRef.current?.addEventListener('progress', reportOnBuffer)

    return () => {
      videoElementRef.current?.removeEventListener('durationchange', reportOnDuration)
      videoElementRef.current?.removeEventListener('timeupdate', reportOnTime)
      videoElementRef.current?.removeEventListener('progress', reportOnBuffer)
    }
  }, [])

  // Fullscreen Controls
  // Chromium renders default controls on Fullscreen Video,
  // so we don't need to implement our own exitFullscreen
  const enterFullscreen = () => {
    if (!videoElementRef.current) return
    videoElementRef.current.requestFullscreen()
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
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          width: widerContainer ? 'auto' : '100%',
          height: widerContainer ? '100%' : 'auto',
          aspectRatio: '16 / 9',
          objectFit: 'contain',
          overflow: 'hidden',
          margin: 'auto',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <video
            ref={videoElementRef}
            style={{ width: '100%', objectPosition: 'center', objectFit: 'scale-down' }}
          ></video>
        </Box>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: theme.spacing(-1),
          width: `calc(${PLAYER_CONTROLS_WIDTH}px + ${theme.spacing(3)})`,
          height: `${PLAYER_CONTROLS_HEIGHT}px`,
          clipPath: `rect(auto auto auto ${theme.spacing(1)})`,
        }}
      >
        {/* Video Controls Backdrop */}
        <Box
          sx={{
            position: 'absolute',
            width: `calc(${PLAYER_CONTROLS_WIDTH}px + ${theme.spacing(1)})`,
            height: `calc(${PLAYER_CONTROLS_HEIGHT}px + ${theme.spacing(1)})`,
            background: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 85%)',
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
          <IconButton
            sx={{ width: '24px', height: '24px' }}
            onClick={playing ? pauseVideo : playVideo}
          >
            {playing ? (
              <PauseIcon sx={controlIconStyle} />
            ) : (
              <PlayArrowIcon sx={controlIconStyle} />
            )}
          </IconButton>
          <IconButton sx={{ width: '24px', height: '24px' }} onClick={enterFullscreen}>
            <FullscreenIcon sx={controlIconStyle} />
          </IconButton>
          <Box sx={{ marginLeft: 0.25, textShadow: CONTENT_SHADOW }}>{currentTime.toFixed(2)}</Box>
        </Box>
      </Box>
    </Box>
  )
}

export default VideoPlayer
