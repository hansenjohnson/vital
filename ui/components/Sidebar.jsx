import Box from '@mui/material/Box'

const Sidebar = ({ children, noPadding = false, noGap = false }) => (
  <Box
    sx={{
      flex: '0 0 400px',
      width: '400px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: noPadding ? 0 : 2,
      gap: noGap ? 0 : 2,
    }}
  >
    {children}
  </Box>
)

export default Sidebar
