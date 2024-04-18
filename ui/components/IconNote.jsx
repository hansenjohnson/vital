import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const IconNote = ({ icon: IconClass, note }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <IconClass sx={{ color: 'text.secondary' }} />
    <Typography sx={{ color: 'text.secondary' }}>{note}</Typography>
  </Box>
)

export default IconNote
