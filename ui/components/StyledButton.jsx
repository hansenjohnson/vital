import Button from '@mui/material/Button'

const StyledButton = ({ children, ...rest }) => {
  return (
    <Button
      variant="outlined"
      sx={{ width: '200px', height: '48px', fontSize: '20px', textTransform: 'none' }}
      {...rest}
    >
      {children}
    </Button>
  )
}

export default StyledButton
