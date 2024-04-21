import { useTheme } from '@mui/material'
import Button from '@mui/material/Button'

const StyledButton = ({ color = 'primary', variant = 'outlined', children, ...rest }) => {
  const theme = useTheme()

  let textColor =
    variant === 'contained' ? theme.palette[color].light : theme.palette[color].contrastText
  if (color === 'error') {
    textColor = '#D52810'
  }

  let backgroundColor = variant === 'contained' ? theme.palette[color].dark : 'transparent'
  if (color === 'error') {
    backgroundColor = '#FFBDB4'
  }

  return (
    <Button
      variant={variant}
      color={color}
      sx={() => ({
        width: '200px',
        height: '48px',
        fontSize: '20px',
        textTransform: 'none',
        boxShadow: 'none',
        color: textColor,
        backgroundColor: backgroundColor,
        '&:hover': {
          color: variant === 'contained' ? 'white' : 'inherit',
          boxShadow: 'none',
        },
      })}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default StyledButton
