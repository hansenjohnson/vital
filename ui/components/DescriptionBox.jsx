import Box from '@mui/material/Box'

const DescriptionBox = ({ children }) => (
  <Box
    sx={{
      width: '100%',
      padding: 2,
      borderRadius: 2,
      color: 'text.secondary',
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    }}
  >
    {children}
  </Box>
)

export default DescriptionBox
