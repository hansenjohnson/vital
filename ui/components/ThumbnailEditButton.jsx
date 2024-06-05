import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'

const ThumbnailEditButton = ({ src, onClick }) => (
  <ButtonBase
    sx={{
      position: 'relative',
      width: '100px',
      height: '56px',
      borderRadius: 0.5,
    }}
    onClick={onClick}
  >
    <Box
      component="img"
      src={src}
      sx={(theme) => ({
        width: '100px',
        borderRadius: theme.spacing(0.5),
      })}
    />
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={(theme) => ({
          fontSize: '16px',
          fontFamily: theme.typography.fontFamily,
          textShadow: '0px 0px 12px black',
        })}
      >
        edit
      </Box>
    </Box>
  </ButtonBase>
)

export default ThumbnailEditButton
