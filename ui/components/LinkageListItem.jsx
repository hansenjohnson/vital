import { useState } from 'react'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Skeleton from '@mui/material/Skeleton'

import { timecodeFromFrameNumber, frameRateFromStr } from '../utilities/video'

const LinkageListItem = ({
  id,
  regionStart,
  regionEnd,
  sighting,
  frameRate,
  thumbnail,
  onClick,
  selected,
}) => {
  const theme = useTheme()

  const [thumbnailLoaded, setThumbnailLoaded] = useState(false)
  const onThumbnailLoad = () => {
    setThumbnailLoaded(true)
  }

  const frameRateFloat = frameRateFromStr(frameRate)
  const regionStartTimestamp = timecodeFromFrameNumber(regionStart, frameRateFloat, false)
  const durationTimestamp = timecodeFromFrameNumber(regionEnd - regionStart, frameRateFloat, false)
  const [durationMin, durationSec] = durationTimestamp.split(':')

  return (
    <ButtonBase
      key={id}
      onClick={onClick}
      sx={{
        width: '100%',
        paddingTop: 0.25,
        paddingBottom: 0.25,
        paddingLeft: 0.5,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 0.5,

        ...(selected
          ? {
              color: theme.palette.primary.dark,
              backgroundColor: theme.palette.primary.light,
            }
          : {
              '&:hover': {
                backgroundColor: selected ? 'inherit' : theme.palette.action.hover,
              },
            }),
      }}
    >
      <img
        src={thumbnail}
        onLoad={onThumbnailLoad}
        style={{
          display: thumbnailLoaded ? 'block' : 'none',
          width: '100px',
          borderRadius: theme.spacing(0.5),
        }}
      />
      {!thumbnailLoaded && (
        <Skeleton variant="rectangular" width={100} height={56} sx={{ flexShrink: 0 }} />
      )}

      <Box sx={{ width: '100%' }}>
        <Box
          sx={{
            fontFamily: theme.typography.fontFamily,
            fontSize: '18px',
            lineHeight: '18px',
            marginBottom: 0.5,
            textAlign: 'left',
          }}
        >
          Sighting {sighting.letter}
        </Box>
        <Box
          sx={(theme) => ({
            color: selected ? `inherit` : theme.palette.text.secondary,
            fontFamily: theme.typography.monoFamily,
            fontSize: '14px',
            lineHeight: '14px',
            width: '100%',
            paddingRight: 1,
            display: 'flex',
            justifyContent: 'space-between',
          })}
        >
          <Box>@ {regionStartTimestamp}</Box>
          <Box>
            {durationMin !== '00' ? `${durationMin} min` : ''} {durationSec} sec
          </Box>
        </Box>
      </Box>
    </ButtonBase>
  )
}

export default LinkageListItem
