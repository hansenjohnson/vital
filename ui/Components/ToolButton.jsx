import { useTheme } from '@mui/material'
import Button from '@mui/material/Button'

const ToolButton = ({ name, onClick, selected = false }) => {
  const theme = useTheme()

  return (
    <Button
      sx={{
        width: '100%',
        height: theme.spacing(4),
        paddingLeft: theme.spacing(2),
        borderRadius: theme.spacing(1),
        fontSize: theme.spacing(2),
        fontWeight: 700,
        textTransform: 'none',
        justifyContent: 'flex-start',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      }}
      color="primary"
      onClick={onClick}
      variant={selected ? 'contained' : 'text'}
    >
      {name}
    </Button>
  )
}

export default ToolButton
