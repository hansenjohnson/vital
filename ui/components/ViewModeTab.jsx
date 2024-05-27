import { useTheme } from '@mui/material'
import ButtonBase from '@mui/material/ButtonBase'

const ViewModeTab = ({ name, icon: Icon, selected, onClick }) => {
  const theme = useTheme()
  const deselectedStyles = !selected
    ? {
        color: `${theme.palette.background.paper}77`,
        backgroundColor: `${theme.palette.background.paper}44`,
        '&:hover': {
          color: theme.palette.background.paper,
          backgroundColor: 'primary.light',
        },
      }
    : {}

  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '50%',
        paddingTop: 0.5,
        paddingBottom: 0.5,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: theme.typography.fontFamily,
        fontSize: '16px',
        gap: 1,

        ...deselectedStyles,
      }}
    >
      <Icon sx={{ fontSize: '16px' }} />
      {name}
    </ButtonBase>
  )
}

export default ViewModeTab
