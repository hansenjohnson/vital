import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

const MainActionButton = ({ note, action, onClick, noteFirst = false, color = 'primary' }) => {
  const theme = useTheme()

  const bgColor = theme.palette[color].dark
  const noteComponent = (
    <Box
      sx={{
        width: '130px',
        fontSize: '20px',
        lineHeight: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: noteFirst ? 'left' : 'right',
        color: theme.palette[color].light,
      }}
    >
      {note}
    </Box>
  )

  return (
    <Box
      sx={() => ({
        width: '574px',
        height: '140px',
        border: `4px solid ${bgColor}`,
        borderRadius: theme.spacing(2),
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
          borderRadius: `calc(${theme.spacing(2)} - 4px)`,
          boxShadow: `0 0 0 4px ${bgColor}`,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          fontSize: '40px',
          lineHeight: '40px',
          fontWeight: 700,
          textTransform: 'none',
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
