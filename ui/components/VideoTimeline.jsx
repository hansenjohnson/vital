import { useState, useRef, useEffect, useCallback } from 'react'
import Box from '@mui/material/Box'
import throttle from 'lodash.throttle'

import { determineNonOverlappingTracksForRegions } from '../utilities/numbers'

const VideoTimeline = ({
  bufferedRegions, // array of [start, end] of unit frames, sorted by start
  existingRegions, // array of [start, end] of unit frames, sorted by start
  regionStart, // unit frames
  regionEnd, // unit frames
  videoDuration: videoDurationProp, // unit frames
  currentFrameNumber, // unit frames
  seekToFrame,
}) => {
  const videoDuration = videoDurationProp || 1 // prevent division by zero

  // Lock playhead at 0 in edge case scenarios
  const playheadPosition = videoDurationProp === 0 ? 0 : (currentFrameNumber / videoDuration) * 100
  const regionStartPosition = (regionStart / videoDuration) * 100
  const regionEndPosition = (regionEnd / videoDuration) * 100
  const accountForPlayheadWidthNearRightEdge = playheadPosition > 50 ? 2 : 0

  const trackForRegion = determineNonOverlappingTracksForRegions(existingRegions)

  const containerRef = useRef(null)

  const seekToPointerEvent = (event) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const xOffset = event.clientX - rect.x
    const xPercent = xOffset / rect.width
    const seekTo = xPercent * videoDuration
    seekToFrame(seekTo)
  }

  const [showClickLine, setShowClickLine] = useState(false)
  const [clickLineXPercent, setClickLineXPercent] = useState(null)
  const setClickLine = (event) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const xOffset = event.clientX - rect.x
    const xPercent = (xOffset / rect.width) * 100
    setClickLineXPercent(xPercent)
  }

  const [isDragging, setIsDragging] = useState(false)
  const dragToSeek = useCallback(
    throttle((event) => {
      seekToPointerEvent(event)
    }, 100),
    [videoDuration]
  )

  const handlePointerMove = (event) => {
    setShowClickLine(true)
    setClickLine(event)
    if (isDragging) {
      dragToSeek(event)
    }
  }

  const handlePointerUp = () => {
    dragToSeek.cancel()
    setIsDragging(false)
  }

  useEffect(() => {
    window.addEventListener('pointerup', handlePointerUp)
    return () => {
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'background.paper',
        position: 'relative',
        overflowX: 'clip',
        overflowY: 'visible',
      }}
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setShowClickLine(false)}
    >
      {/* Clickable Scrubber/Seeker */}
      <Box sx={{ width: '100%', height: '100%' }} onClick={seekToPointerEvent} />
      {showClickLine && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: `${clickLineXPercent}%`,
            width: '2px',
            height: '100%',
            backgroundColor: 'secondary.main',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Existing Regions */}
      {existingRegions.map((region, index) => {
        const [start, end] = region
        const track = trackForRegion[index]
        return (
          <Box
            key={`${start}-${end}`}
            sx={{
              position: 'absolute',
              top: `calc(${track * 10}px + 6px)`,
              left: `${(start / videoDuration) * 100}%`,
              width: `${((end - start) / videoDuration) * 100}%`,
              height: '4px',
              backgroundColor: 'tertiary.main',
            }}
          />
        )
      })}

      {/* Current Region */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 'calc(5% + 4px)',
          left: `${regionStartPosition}%`,
          width: `calc(${regionEndPosition - regionStartPosition}%)`,
          height: 'calc(90% - 4px)',
          backgroundColor: 'tertiary.dark',
          opacity: 0.1,
          borderRadius: '4px',
          visibility: regionStart == null || regionEnd == null ? 'hidden' : 'visible',
        }}
      />
      <Box
        sx={(theme) => ({
          position: 'absolute',
          bottom: 'calc(5% + 4px)',
          left: `${regionStartPosition}%`,
          width: '6px',
          height: 'calc(90% - 4px)',
          border: `2px solid ${theme.palette.tertiary.dark}`,
          borderRight: 'none',
          borderTopLeftRadius: '4px',
          borderBottomLeftRadius: '4px',
          visibility: regionStart == null ? 'hidden' : 'visible',
        })}
      />
      <Box
        sx={(theme) => ({
          position: 'absolute',
          bottom: 'calc(5% + 4px)',
          left: `calc(${regionEndPosition}% - 4px)`,
          width: '6px',
          height: 'calc(90% - 4px)',
          border: `2px solid ${theme.palette.tertiary.dark}`,
          borderLeft: 'none',
          borderTopRightRadius: '4px',
          borderBottomRightRadius: '4px',
          visibility: regionEnd == null ? 'hidden' : 'visible',
        })}
      />

      {/* Buffer Bar */}
      {bufferedRegions.map((region, index) => {
        const [start, end] = region
        return (
          <Box
            key={`${index}`}
            sx={(theme) => ({
              position: 'absolute',
              bottom: 0,
              left: `${(start / videoDuration) * 100}%`,
              width: `${((end - start) / videoDuration) * 100}%`,
              height: '4px',
              backgroundColor: 'action.selected',
              transition: `width ${theme.transitions.duration.shortest}ms ease-in-out`,
            })}
          />
        )
      })}

      {/* Playhead */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: `calc(${playheadPosition}% - ${accountForPlayheadWidthNearRightEdge}px)`,
          width: '2px',
          height: '100%',
          backgroundColor: 'secondary.main',
        }}
      />
      <Box
        sx={(theme) => ({
          position: 'absolute',
          bottom: 0,
          left: `calc(${playheadPosition}% - 5px - ${accountForPlayheadWidthNearRightEdge}px)`,
          width: '0px',
          height: '0px',
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderBottom: `6px solid ${theme.palette.secondary.main}`,

          '&:hover': {
            width: '16px',
            height: '16px',
            border: `2px solid ${theme.palette.action.active}`,
            borderRadius: '8px',
            backgroundColor: theme.palette.secondary.main,
            transform: 'translate(-2px, 5px)',
            boxShadow: theme.shadows[4],
          },
        })}
        onPointerDown={() => setIsDragging(true)}
      />
      {isDragging && (
        <Box
          sx={(theme) => ({
            position: 'absolute',
            bottom: 0,
            left: `${clickLineXPercent}%`,
            width: '16px',
            height: '16px',
            border: `2px solid ${theme.palette.action.active}`,
            borderRadius: '8px',
            backgroundColor: theme.palette.secondary.main,
            transform: 'translate(-7px, 5px)',
            boxShadow: theme.shadows[4],
          })}
        />
      )}
    </Box>
  )
}

export default VideoTimeline
