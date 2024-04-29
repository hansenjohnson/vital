import Typography from '@mui/material/Typography'

const SectionHeading = ({ children, size = 24 }) => (
  <Typography
    sx={{
      color: 'text.secondary',
      fontSize: `${size}px`,
      fontWeight: 700,
      userSelect: 'none',
    }}
  >
    {children}
  </Typography>
)

export default SectionHeading
