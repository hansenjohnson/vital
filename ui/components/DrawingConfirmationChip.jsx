import ButtonBase from '@mui/material/ButtonBase'

const DrawingConfirmationChip = ({ label, icon, onClick }) => (
  <ButtonBase
    sx={(theme) => ({
      backgroundColor: `${theme.palette.background.paper}F0`,
      borderRadius: 2,
      color: 'rgba(255, 255, 255, 0.9)',
      paddingTop: 0.5,
      paddingBottom: 0.5,
      paddingLeft: 1,
      paddingRight: 0.5,
      fontSize: '14px',
      fontFamily: theme.typography.monoFamily,
      fontWeight: 500,
      boxShadow: theme.shadows[6],

      display: 'flex',
      alignItems: 'center',
      gap: 1,
      whiteSpace: 'nowrap',

      '&:hover': {
        color: 'white',
        backgroundColor: theme.palette.background.paper,
      },
    })}
    onClick={onClick}
  >
    {label}
    {icon}
  </ButtonBase>
)

export default DrawingConfirmationChip
