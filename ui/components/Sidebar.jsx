import Box from '@mui/material/Box'

const Sidebar = ({ children }) => (
  <Box
    sx={{
      flex: '0 0 400px',
      width: '400px',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: 1,
      gap: 1,
    }}
  >
    {children}
  </Box>
)

export default Sidebar
