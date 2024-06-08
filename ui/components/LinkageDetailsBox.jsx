import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { LINKAGE_MODES, VIEW_MODES } from '../constants/routes'
import { regionString } from '../utilities/strings'
import PillButtonGroup from './PillButtonGroup'
import AnnotationsSection from './AnnotationsSection'
import ThumbnailEditButton from './ThumbnailEditButton'
import HeadingWithButton from './HeadingWithButton'

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

const LinkageDetailsBox = ({
  mode,
  setMode,
  viewMode,
  setViewMode,
  videoName,
  hasOverlap,
  frameRate,
  regionStart,
  regionEnd,
  setStart,
  setEnd,
  sightingName,
  openSightingDialog,
  annotations,
  deleteAnnotation,
  thumbnail,
}) => {
  const theme = useTheme()

  let regionDisplay = regionString(regionStart, regionEnd, frameRate) || <em>None Set</em>

  const annotationsDisplay = (
    <AnnotationsSection annotations={annotations} handleDelete={deleteAnnotation} />
  )

  /* == Component Returns == */
  if (!videoName) {
    return <Box sx={containerStyles(theme)} />
  }

  if (mode === LINKAGE_MODES.BLANK) {
    return (
      <Box
        sx={{
          ...containerStyles(theme),
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.disabled',
        }}
      >
        Select a Linkage or&nbsp;
        <Box
          sx={{
            marginLeft: -1,
            borderBottom: `1px dotted ${theme.palette.text.disabled}`,
            '&:hover': {
              cursor: 'pointer',
              color: 'text.primary',
              borderColor: 'text.primary',
            },
          }}
          onClick={() => setMode(LINKAGE_MODES.CREATE)}
        >
          Add a new one
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={containerStyles(theme)}>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {mode === LINKAGE_MODES.EDIT && viewMode === VIEW_MODES.BY_SIGHTING && (
          <Box
            sx={{
              width: '100%',
              overflow: 'hidden',
              textWrap: 'wrap',
              wordBreak: 'break-all',
            }}
          >
            <HeadingWithButton
              heading="Video"
              buttonText="see in context"
              onClick={() => setViewMode(VIEW_MODES.BY_VIDEO)}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
                {videoName || <>&nbsp;</>}
              </Typography>
            </Box>
          </Box>
        )}

        <Box>
          <HeadingWithButton
            heading="Region"
            buttonText="edit"
            showButton={mode === LINKAGE_MODES.EDIT}
            onClick={() => null}
          >
            {hasOverlap && (
              <Typography variant="caption" color="warning.main" sx={{ fontStyle: 'italic' }}>
                overlaps another region with this letter
              </Typography>
            )}
          </HeadingWithButton>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              sx={{
                fontFamily: "'Sometype Mono Variable', monopace",
                color: hasOverlap ? 'warning.main' : 'inherit',
              }}
            >
              {regionDisplay}
            </Typography>
            {mode === LINKAGE_MODES.CREATE && (
              <PillButtonGroup
                buttons={[
                  { name: 'set in', action: setStart },
                  { name: 'set out', action: setEnd },
                ]}
              />
            )}
          </Box>
        </Box>

        <Box>
          <HeadingWithButton
            heading="Sighting"
            buttonText="edit"
            showButton={mode === LINKAGE_MODES.EDIT}
            onClick={() => null}
          />
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
              {sightingName || <em>None Set</em>}
            </Typography>
            {mode === LINKAGE_MODES.CREATE && (
              <PillButtonGroup buttons={[{ name: 'choose...', action: openSightingDialog }]} />
            )}
          </Box>
        </Box>

        {mode === LINKAGE_MODES.CREATE && annotationsDisplay}
      </Box>

      {mode === LINKAGE_MODES.EDIT && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
            alignItems: 'flex-end',
            textAlign: 'right',
          }}
        >
          <ThumbnailEditButton src={thumbnail} onClick={() => null} />
          {annotationsDisplay}
        </Box>
      )}
    </Box>
  )
}

export default LinkageDetailsBox
