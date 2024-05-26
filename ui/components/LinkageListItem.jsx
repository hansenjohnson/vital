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
        paddingTop: '2px',
        paddingBottom: '2px',
        paddingLeft: 0.5,
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 0.5,

        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
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
      {!thumbnailLoaded && <Skeleton variant="rectangular" width={100} height={56} />}

      <Box>
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
            color: 'text.secondary',
            fontFamily: theme.typography.monoFamily,
            fontSize: '14px',
            lineHeight: '14px',
          })}
        >
          @ {regionStartTimestamp} - {durationMin !== '00' ? `${durationMin} min` : ''}{' '}
          {durationSec} sec
        </Box>
      </Box>
    </ButtonBase>
  )
}

export default LinkageListItem
