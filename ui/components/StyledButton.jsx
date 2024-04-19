import Button from '@mui/material/Button'

const StyledButton = ({ children }) => {
  return (
    <Button
      variant="outlined"
      sx={{ width: '200px', height: '48px', fontSize: '20px', textTransform: 'none' }}
    >
      {children}
    </Button>
  )
}

export default StyledButton
