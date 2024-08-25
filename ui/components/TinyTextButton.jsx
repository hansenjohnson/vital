import Box from '@mui/material/Box'

const TinyTextButton = ({ children, onClick, disabled = false }) => (
  <Box
    onClick={onClick}
    sx={(theme) => ({
      paddingBottom: '2px',
      fontSize: '14px',
      lineHeight: '14px',
      color: disabled ? theme.palette.action.disabled : theme.palette.secondary.main,
      borderBottom: disabled ? 'none' : `1px dotted ${theme.palette.secondary.main}`,
      userSelect: 'none',
      '&:hover': disabled
        ? {}
        : {
            cursor: 'pointer',
            color: 'secondary.light',
            borderColor: 'secondary.light',
          },
    })}
  >
    {children}
  </Box>
)

export default TinyTextButton
