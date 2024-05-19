import Button from '@mui/material/Button'

const NavbarButton = ({ onClick, children, selected, disabled }) => (
  <Button
    sx={(theme) => ({
      height: '100%',
      paddingLeft: 1,
      paddingRight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      borderRadius: 0,
      textTransform: 'none',
      fontFamily: theme.typography.fontFamily,
      fontSize: '16px',
      fontWeight: selected ? 500 : 400,

      color: selected ? 'white' : 'white',
      backgroundColor: selected ? 'rgba(255, 255, 255, 0.1)' : theme.palette.primary.dark,
      '&:hover': {
        backgroundColor: selected ? 'rgba(255, 255, 255, 0.1)' : theme.palette.primary.main,
      },
      '&:disabled': {
        color: 'text.disabled',
      },
    })}
    variant="text"
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </Button>
)

export default NavbarButton
