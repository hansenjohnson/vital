import Button from '@mui/material/Button'

const StyledPillButton = ({ children, sx, ...rest }) => (
  <Button
    variant="outlined"
    sx={{
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: '2px',
      paddingBottom: '2px',
      fontSize: '14px',
      lineHeight: 1,
      fontWeight: 500,
      textTransform: 'lowercase',
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none',
      },
      // Added to match spacing from the border on the outlined variant
      ...(rest.variant === 'contained'
        ? {
            marginTop: '1px',
            marginBottom: '1px',
          }
        : {}),
      ...sx,
    }}
    {...rest}
  >
    {children}
  </Button>
)

export default StyledPillButton
