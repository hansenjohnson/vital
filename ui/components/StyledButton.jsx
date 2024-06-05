import { useTheme } from '@mui/material'
import Button from '@mui/material/Button'

const StyledButton = ({ color = 'primary', variant = 'outlined', children, sx, ...rest }) => {
  const theme = useTheme()

  let textColor = theme.palette[color].contrastText
  if (variant === 'contained') {
    textColor = theme.palette[color].light
    textColor = 'white'
  } else if (variant === 'outlined') {
    textColor = theme.palette[color].dark
  }
  if (color === 'error') {
    textColor = '#E43933'
  }

  let backgroundColor = variant === 'contained' ? theme.palette[color].dark : 'transparent'
  if (variant === 'contained' && color === 'error') {
    backgroundColor = '#FFBDB4'
  }

  return (
    <Button
      variant={variant}
      color={color}
      sx={() => ({
        ...sx,
        width: '200px',
        height: '48px',
        fontSize: '20px',
        textTransform: 'none',
        boxShadow: 'none',
        color: textColor,
        backgroundColor: backgroundColor,
        '&:hover': {
          backgroundColor: variant === 'contained' ? theme.palette[color].main : undefined,
          color: variant === 'contained' && color === 'error' ? 'white' : undefined,
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
