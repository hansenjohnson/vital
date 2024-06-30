import Chip from '@mui/material/Chip'

const AnnotationChip = ({ annotationName, onHover, onClick, onDelete }) => {
  return (
    <Chip
      label={annotationName}
      size="small"
      sx={{
        height: '20px',
        paddingLeft: 0.5,
        fontFamily: "'Sometype Mono Variable', monopace",
        fontWeight: 500,
        '& .MuiChip-deleteIcon': {
          marginLeft: 0.5,
          fontSize: '14px',
        },
      }}
      onClick={onClick}
      onDelete={onDelete}
      onPointerOver={() => onHover(true)}
      onPointerOut={() => onHover(false)}
    />
  )
}

export default AnnotationChip
