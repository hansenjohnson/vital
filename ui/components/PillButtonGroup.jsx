import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'

const PillButton = ({ children, onClick, first, last }) => (
  <ButtonBase
    sx={(theme) => ({
      backgroundColor: 'rgba(255, 255, 255, 1)',
      color: theme.palette.background.paper,

      paddingLeft: 1.5,
      paddingRight: 1.5,
      paddingTop: '2px',
      paddingBottom: '2px',
      marginLeft: !first ? '1px' : 0,

      borderTopLeftRadius: first ? theme.spacing(1) : 0,
      borderBottomLeftRadius: first ? theme.spacing(1) : 0,
      borderTopRightRadius: last ? theme.spacing(1) : 0,
      borderBottomRightRadius: last ? theme.spacing(1) : 0,

      fontFamily: theme.typography.fontFamily,
      fontSize: '14px',
      fontWeight: 500,
      textTransform: 'lowercase',

      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
      },
    })}
    onClick={onClick}
  >
    {children}
  </ButtonBase>
)

const PillButtonGroup = ({ buttons }) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {buttons.map((button, index) => (
        <PillButton
          key={button.name}
          first={index === 0}
          last={index === buttons.length - 1}
          onClick={button.action}
        >
          {button.name}
        </PillButton>
      ))}
    </Box>
  )
}

export default PillButtonGroup
