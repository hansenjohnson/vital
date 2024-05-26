import Box from '@mui/material/Box'
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
  const frameRateFloat = frameRateFromStr(frameRate)
  const regionStartTimestamp = timecodeFromFrameNumber(regionStart, frameRateFloat, false)
  const durationTimestamp = timecodeFromFrameNumber(regionEnd - regionStart, frameRateFloat, false)
  const [durationMin, durationSec] = durationTimestamp.split(':')

  return (
    <Box key={id} sx={{ border: '1px solid red' }}>
      <img src={thumbnail} />
      <Box sx={{ fontSize: '18px', lineHeight: '18px' }}>Sighting {sighting.letter}</Box>
      <Box
        sx={(theme) => ({
          color: 'text.secondary',
          fontSize: '14px',
          fontFamily: theme.typography.monoFamily,
        })}
      >
        @ {regionStartTimestamp} - {durationMin !== '00' ? `${durationMin} min` : ''} {durationSec}{' '}
        sec
      </Box>
    </Box>
  )
}

export default LinkageListItem
