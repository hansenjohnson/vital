import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const IconNote = ({ icon: IconClass, iconFontSize, note, color = 'text.secondary' }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box sx={{ width: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <IconClass sx={{ color, fontSize: iconFontSize }} />
    </Box>
    <Typography sx={{ color }}>{note}</Typography>
  </Box>
)

export default IconNote
