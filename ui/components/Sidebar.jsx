import Box from '@mui/material/Box'

import { SIDEBAR_WIDTH } from '../constants/dimensions'

const Sidebar = ({ children, spacing = 2 }) => (
  <Box
    sx={{
      flex: `0 0 ${SIDEBAR_WIDTH}px`,
      width: `${SIDEBAR_WIDTH}px`,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      padding: spacing,
      gap: spacing,
    }}
  >
    {children}
  </Box>
)

export default Sidebar
