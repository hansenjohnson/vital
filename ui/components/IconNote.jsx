import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const IconNote = ({ icon: IconClass, note, color = 'text.secondary' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <IconClass sx={{ color }} />
    <Typography sx={{ color }}>{note}</Typography>
  </Box>
)

export default IconNote
