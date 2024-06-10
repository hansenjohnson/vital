import Box from '@mui/material/Box'

import SectionHeading from './SectionHeading'

const HeadingWithButton = ({
  heading,
  buttonText,
  showButton = true,
  disableButton,
  onClick,
  children,
}) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'baseline',
      gap: 1,
    }}
  >
    <SectionHeading size={16}>{heading}</SectionHeading>
    {showButton && (
      <Box
        onClick={onClick}
        sx={(theme) => ({
          paddingBottom: '2px',
          fontSize: '14px',
          lineHeight: '14px',
          color: disableButton ? theme.palette.action.disabled : theme.palette.secondary.main,
          borderBottom: disableButton ? 'none' : `1px dotted ${theme.palette.secondary.main}`,
          userSelect: 'none',
          '&:hover': disableButton
            ? {}
            : {
                cursor: 'pointer',
                color: 'secondary.light',
                borderColor: 'secondary.light',
              },
        })}
      >
        {buttonText}
      </Box>
    )}
    {children}
  </Box>
)

export default HeadingWithButton
