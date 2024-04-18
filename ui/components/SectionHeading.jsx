import Typography from '@mui/material/Typography'

const SectionHeading = ({ children }) => (
  <Typography
    sx={{
      color: 'text.secondary',
      fontSize: '24px',
      fontWeight: 700,
    }}
  >
    {children}
  </Typography>
)

export default SectionHeading
