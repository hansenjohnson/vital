import { useRef } from 'react'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { LINKAGE_MODES, VIEW_MODES } from '../constants/routes'
import { regionString } from '../utilities/strings'
import PillButtonGroup from './PillButtonGroup'
import AnnotationsSection from './AnnotationsSection'
import ThumbnailEditButton from './ThumbnailEditButton'
import HeadingWithButton from './HeadingWithButton'
import RegionEditDialog from './RegionEditDialog'

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
  regionEditDialog,
  openRegionEditDialog,
  closeRegionEditDialog,
  saveRegionEdit,
  sightingName,
  openSightingDialog,
  annotations,
  deleteAnnotation,
  thumbnail,
  openThumbnailEditDialog,
  saveable,
}) => {
  const theme = useTheme()

  const annotationsDisplay = (
    <AnnotationsSection mode={mode} annotations={annotations} handleDelete={deleteAnnotation} />
  )

  const regionDisplayRef = useRef(null)
  const getRegionDisplayRef = () => regionDisplayRef.current
  let regionDisplay = regionString(regionStart, regionEnd, frameRate) || <em>None Set</em>
  let regionDisplayColor = 'inherit'
  if (hasOverlap) {
    regionDisplayColor = 'warning.main'
  } else if (regionEditDialog) {
    regionDisplayColor = 'secondary.main'
  }

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
            userSelect: 'none',
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
            disableButton={regionEditDialog}
            onClick={openRegionEditDialog}
          >
            {hasOverlap && (
              <Typography variant="caption" color="warning.main" sx={{ fontStyle: 'italic' }}>
                overlaps another region with this letter
              </Typography>
            )}
          </HeadingWithButton>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              ref={regionDisplayRef}
              sx={{
                fontFamily: "'Sometype Mono Variable', monopace",
                color: regionDisplayColor,
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
            onClick={openSightingDialog}
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
          <ThumbnailEditButton src={thumbnail} onClick={openThumbnailEditDialog} />
          {annotationsDisplay}
        </Box>
      )}

      {mode === LINKAGE_MODES.EDIT && (
        <RegionEditDialog
          open={regionEditDialog}
          getAnchor={getRegionDisplayRef}
          setStart={setStart}
          setEnd={setEnd}
          handleClose={closeRegionEditDialog}
          handleSave={saveRegionEdit}
          disableSave={!saveable}
        />
      )}
    </Box>
  )
}

export default LinkageDetailsBox
