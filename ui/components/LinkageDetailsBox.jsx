import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Typography from '@mui/material/Typography'

import SectionHeading from './SectionHeading'
import AnnotationChip from './AnnotationChip'
import { timecodeFromFrameNumber } from '../utilities/video'

const containerStyles = (theme) => ({
  height: `calc(100% - ${theme.spacing(2)})`,
  margin: 1,
  padding: 1.5,
  paddingTop: 1,
  borderRadius: 1,
  backgroundColor: 'background.paper',
  display: 'flex',
  gap: 1,
})

const LinkageEditBox = ({
  videoName,
  frameRate,
  regionStart,
  regionEnd,
  sightingName,
  annotations,
  deleteAnnotation,
  thumbnail,
}) => {
  const theme = useTheme()

  if (!videoName) {
    return <Box sx={containerStyles(theme)} />
  }

  return (
    <Box sx={containerStyles(theme)}>
      <Box
        sx={{
          maxWidth: '70%',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        <Box
          sx={{
            width: '100%',
            overflow: 'hidden',
            textWrap: 'wrap',
            wordBreak: 'break-all',
          }}
        >
          <SectionHeading size={16}>Video</SectionHeading>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
              {videoName || <>&nbsp;</>}
            </Typography>
          </Box>
        </Box>

        <Box>
          <SectionHeading size={16}>Region</SectionHeading>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
              {timecodeFromFrameNumber(regionStart, frameRate)} -{' '}
              {timecodeFromFrameNumber(regionEnd, frameRate)}
            </Typography>
          </Box>
        </Box>

        <Box>
          <SectionHeading size={16}>Sighting</SectionHeading>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
              {sightingName || <>&nbsp;</>}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'flex-end',
          textAlign: 'right',
        }}
      >
        <ButtonBase
          sx={{
            position: 'relative',
            width: '100px',
            height: '56px',
            borderRadius: 0.5,
          }}
        >
          <img
            src={thumbnail}
            style={{
              width: '100px',
              borderRadius: theme.spacing(0.5),
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box
              sx={{
                fontSize: '16px',
                fontFamily: theme.typography.fontFamily,
                textShadow: '0px 0px 12px black',
              }}
            >
              edit
            </Box>
          </Box>
        </ButtonBase>

        <Box>
          <SectionHeading size={16}>Annotations</SectionHeading>
          {annotations.length === 0 ? (
            <Typography sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>None</Typography>
          ) : (
            <Box
              sx={{
                marginTop: 0.5,
                display: 'flex',
                gap: 0.5,
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
              }}
            >
              {annotations.map((annotationName) => (
                <AnnotationChip
                  key={annotationName}
                  annotationName={annotationName}
                  onDelete={() => deleteAnnotation(annotationName)}
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default LinkageEditBox
