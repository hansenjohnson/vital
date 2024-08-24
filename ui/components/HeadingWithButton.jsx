import Box from '@mui/material/Box'

import SectionHeading from './SectionHeading'
import TinyTextButton from './TinyTextButton'

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
      <TinyTextButton disabled={disableButton} onClick={onClick}>
        {buttonText}
      </TinyTextButton>
    )}
    {children}
  </Box>
)

export default HeadingWithButton
