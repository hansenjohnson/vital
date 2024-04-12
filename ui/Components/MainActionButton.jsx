import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const MainActionButton = ({ note, action, onClick, noteFirst = false, color = 'primary' }) => {
  const theme = useTheme()

  const bgColor = theme.palette[color].dark
  const noteComponent = (
    <Box
      sx={{
        width: '100px',
        padding: 0.5,
        fontSize: '14px',
        lineHeight: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        color: theme.palette[color].light,
      }}
    >
      {note}
    </Box>
  )

  return (
    <Box
      sx={() => ({
        width: '400px',
        height: '96px',
        border: `4px solid ${bgColor}`,
        borderRadius: 4,
        display: 'flex',
        boxShadow: theme.shadows[6],
      })}
    >
      {noteFirst && noteComponent}

      <Button
        sx={{
          flex: 1,
          backgroundColor: bgColor,
          color: theme.palette[color].light,
          borderRadius: 2.5,
          padding: 0.5,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: '24px',
          lineHeight: '30px',
          fontWeight: 700,
          '&:hover': {
            color: theme.palette[color].main,
          },
        }}
        color={color}
        onClick={onClick}
      >
        {action}
      </Button>

      {!noteFirst && noteComponent}
    </Box>
  )
}

export default MainActionButton
