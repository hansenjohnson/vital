import { forwardRef } from 'react'

import { useTheme } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grow from '@mui/material/Grow'

const Transition = forwardRef(function Transition(props, ref) {
  return <Grow ref={ref} {...props} />
})

// variants: 'warning' | 'error'
const AlertDialog = ({ open, onClose, variant = 'warning', body }) => {
  const theme = useTheme()

  return (
    <Dialog
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
      keepMounted
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') return
        onClose()
      }}
      slotProps={{ root: { sx: { zIndex: theme.zIndex.modal + 50 } } }}
    >
      <DialogTitle
        sx={{
          color: theme.palette[variant].contrastText,
          backgroundColor: theme.palette[variant].main,
          fontSize: 24,
          paddingTop: 1,
          paddingBottom: 1,
        }}
      >
        {variant === 'warning' ? 'Warning' : 'Error'}
      </DialogTitle>

      <DialogContent
        sx={{ marginTop: 2, height: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}
      >
        <Box sx={{ flexGrow: 1, fontSize: '18px', whiteSpace: 'pre-line' }}>{body}</Box>
      </DialogContent>
      <DialogActions>
        <Button variant="text" color={variant} onClick={onClose}>
          Okay
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AlertDialog
