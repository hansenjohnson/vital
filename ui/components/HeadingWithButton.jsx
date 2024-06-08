import Box from '@mui/material/Box'

import SectionHeading from './SectionHeading'

const HeadingWithButton = ({ heading, buttonText, showButton = true, onClick, children }) => (
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
          color: theme.palette.secondary.main,
          borderBottom: `1px dotted ${theme.palette.secondary.main}`,
          '&:hover': {
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
