import Popper from '@mui/material/Popper'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grow from '@mui/material/Grow'

import StyledPillButton from './StyledPillButton'

const RegionEditDialog = ({
  open,
  handleClose,
  getAnchor,
  setStart,
  setEnd,
  handleSave,
  disableSave,
}) => {
  return (
    <Popper
      open={open}
      anchorEl={getAnchor}
      placement="right"
      popperOptions={{
        modifiers: [
          {
            name: 'offset',
            options: {
              offset: [0, 16],
            },
          },
        ],
      }}
      transition
    >
      {({ TransitionProps }) => (
        <Grow {...TransitionProps} style={{ transformOrigin: '-12px 50% 0' }}>
          <Paper
            elevation={8}
            sx={{
              padding: 1,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 'calc(50% - 8px)',
                left: '-10px',

                width: '0px',
                height: '0px',
                borderStyle: 'solid',
                borderWidth: '8px 10px 8px 0',
                borderColor: 'transparent',
                borderRightColor: 'rgb(58, 58, 58)',
              },
            }}
          >
            <Box
              sx={{
                width: '172px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                justifyContent: 'space-between',
                color: 'text.secondary',
              }}
            >
              <StyledPillButton
                color="secondary"
                sx={{ width: '80px', paddingLeft: 0, paddingRight: 0 }}
                onClick={setStart}
              >
                set in
              </StyledPillButton>
              <StyledPillButton
                color="secondary"
                sx={{ width: '80px', paddingLeft: 0, paddingRight: 0 }}
                onClick={setEnd}
              >
                set out
              </StyledPillButton>
              <StyledPillButton
                color="inherit"
                sx={{ width: '80px', paddingLeft: 0, paddingRight: 0 }}
                onClick={handleClose}
              >
                cancel
              </StyledPillButton>
              <StyledPillButton
                color="tertiary"
                sx={{ width: '80px', paddingLeft: 0, paddingRight: 0 }}
                onClick={handleSave}
                disabled={disableSave}
              >
                save
              </StyledPillButton>
            </Box>
          </Paper>
        </Grow>
      )}
    </Popper>
  )
}

export default RegionEditDialog
