import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const BlankSlate = ({ message, action, messageWidth = 50 }) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
      }}
    >
      <Typography
        variant="h5"
        color="text.disabled"
        sx={{ width: `${messageWidth}%`, textAlign: 'center' }}
      >
        {message}
      </Typography>
      {action}
    </Box>
  )
}

export default BlankSlate
