import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import SectionHeading from './SectionHeading'
import PillButtonGroup from './PillButtonGroup'
import AnnotationChip from './AnnotationChip'

const AssociationsDetailsBox = ({
  regionStart,
  regionEnd,
  setStart,
  setEnd,
  sightingName,
  openSightingDialog,
  annotations,
  deleteAnnotation,
}) => {
  let regionString = <em>None Set</em>
  if (regionStart || regionEnd) {
    regionString = `${regionStart} - ${regionEnd}`
  }
  return (
    <Box
      sx={(theme) => ({
        height: `calc(100% - ${theme.spacing(2)})`,
        margin: 1,
        padding: 1.5,
        paddingTop: 1,
        borderRadius: 1,
        backgroundColor: 'background.paper',

        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      })}
    >
      <Box>
        <SectionHeading size={16}>Region</SectionHeading>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
            {regionString}
          </Typography>
          <PillButtonGroup
            buttons={[
              { name: 'set in', action: setStart },
              { name: 'set out', action: setEnd },
            ]}
          />
        </Box>
      </Box>

      <Box>
        <SectionHeading size={16}>Sighting</SectionHeading>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
            {sightingName || <em>None Set</em>}
          </Typography>
          <PillButtonGroup buttons={[{ name: 'choose...', action: openSightingDialog }]} />
        </Box>
      </Box>

      <Box>
        <SectionHeading size={16}>Annotations</SectionHeading>
        {annotations.length === 0 ? (
          <Typography sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>None</Typography>
        ) : (
          <Box sx={{ marginTop: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
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
  )
}

export default AssociationsDetailsBox
