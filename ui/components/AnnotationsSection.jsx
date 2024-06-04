import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import SectionHeading from './SectionHeading'
import AnnotationChip from './AnnotationChip'

const AnnotationsSection = ({ annotations, handleDelete }) => (
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
            onDelete={() => handleDelete(annotationName)}
          />
        ))}
      </Box>
    )}
  </Box>
)

export default AnnotationsSection
