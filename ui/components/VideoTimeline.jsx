import Box from '@mui/material/Box'

import { determineNonOverlappingTracksForRegions } from '../utilities/numbers'

const VideoTimeline = ({
  percentBuffered, // TODO: this needs to be a list of regions
  existingRegions, // array of [start, end] of unit frames, sorted by start
  regionStart, // unit frames
  regionEnd, // unit frames
  videoDuration, // unit frames
  currentTime, // unit frames
}) => {
  const playheadPosition = (currentTime / videoDuration) * 100
  const regionStartPosition = (regionStart / videoDuration) * 100
  const regionEndPosition = (regionEnd / videoDuration) * 100
  const accountForPlayheadWidthNearRightEdge = playheadPosition > 50 ? 2 : 0

  const trackForRegion = determineNonOverlappingTracksForRegions(existingRegions)

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: 'background.paper',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
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
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: `${percentBuffered}%`,
          height: '4px',
          backgroundColor: 'action.selected',
        }}
      />

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
        })}
      />
    </Box>
  )
}

export default VideoTimeline
