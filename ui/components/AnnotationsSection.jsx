import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import SectionHeading from './SectionHeading'
import AnnotationChip from './AnnotationChip'
import { LINKAGE_MODES } from '../constants/routes'

const AnnotationsSection = ({ mode, annotations, handleClick, handleDelete }) => (
  <Box>
    <SectionHeading size={16}>Annotations</SectionHeading>
    {!annotations || annotations.length === 0 ? (
      <Typography sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>None</Typography>
    ) : (
      <Box
        sx={{
          width: '100%',
          maxWidth: mode === LINKAGE_MODES.EDIT ? '220px' : '100%',
          height: mode === LINKAGE_MODES.EDIT ? '100px' : '48px',
          overflowY: 'auto',
          marginTop: 0.5,

          display: 'flex',
          gap: 0.5,
          flexWrap: 'wrap',
          justifyContent: mode === LINKAGE_MODES.EDIT ? 'flex-end' : 'flex-start',
          alignContent: 'flex-start',
        }}
      >
        {annotations.map(({ type }, index) => {
          const annotationKey = `${type} ${index + 1}`
          return (
            <AnnotationChip
              key={annotationKey}
              annotationName={annotationKey}
              onClick={() => handleClick(index)}
              onDelete={() => handleDelete(index)}
            />
          )
        })}
      </Box>
    )}
  </Box>
)

export default AnnotationsSection
