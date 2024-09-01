import { forwardRef } from 'react'

import { useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Grow from '@mui/material/Grow'

import StyledButton from './StyledButton'

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

const ConfirmationDialog = ({ open, title, body, onClose, onConfirm }) => {
  const theme = useTheme()

  const handleConfirm = () => {
    onConfirm()
    onClose()
  }

  return (
    <Dialog
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      keepMounted
      open={open}
      onClose={onClose}
    >
      <DialogTitle
        sx={{
          color: 'rgba(0, 0, 0, 0.7)',
          backgroundColor: 'warning.light',
          fontSize: 24,
          paddingTop: 1,
          paddingBottom: 1,
        }}
      >
        {title}
      </DialogTitle>

      <IconButton
        onClick={onClose}
        size="small"
        sx={{
          position: 'absolute',
          right: theme.spacing(1),
          top: theme.spacing(1),
          color: 'rgba(0, 0, 0, 0.7)',
        }}
      >
        <CloseIcon sx={{ fontSize: '30px' }} />
      </IconButton>

      <DialogContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Box sx={{ flexGrow: 1, fontSize: '20px', whiteSpace: 'pre-line' }}>{body}</Box>
        <Box
          sx={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <StyledButton color="plain" onClick={onClose}>
            Cancel
          </StyledButton>
          <StyledButton variant="contained" color="warning" onClick={handleConfirm}>
            Confirm
          </StyledButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
