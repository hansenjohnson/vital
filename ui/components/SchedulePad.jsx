import { useEffect, useState } from 'react'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'

const SchedulePad = ({ open, onClose, parent, onCommit }) => {
  const [top, setTop] = useState(0)
  const [delayedSlide, setDelayedSlide] = useState(false)

  const [hour, setHour] = useState('10')
  const [minute, setMinute] = useState('00')
  const [period, setPerod] = useState('PM')

  useEffect(() => {
    if (open) {
      const parentDialogBox = parent.getBoundingClientRect()
      setTop(parentDialogBox.top)
      setTimeout(() => setDelayedSlide(true), 0)
    }
  }, [open])

  const handleClose = () => {
    setDelayedSlide(false)
    setTimeout(onClose, 0)
  }

  const handleCommit = () => {
    onCommit(`${hour}:${minute}:${period}`)
  }

  return (
    <Dialog
      open={open}
      onClose={(e, reason) => console.log(reason)}
      disablePortal
      hideBackdrop
      PaperProps={{
        sx: {
          position: 'fixed',
          padding: 2,
          width: '250px',
          marginTop: 0,
          top: `${top}px`,
          left: delayedSlide ? 'calc(50% + 48px)' : 'calc(50% + 48px + 250px)',
          transition: 'left 0.3s ease',
        },
      }}
      slotProps={{
        root: { sx: { width: 0 } },
      }}
    >
      Today at
      <Box sx={{ marginTop: 1, display: 'flex', gap: 0.5, alignItems: 'center' }}>
        {/* Hour */}
        <Select
          value={hour}
          onChange={(event) => setHour(event.target.value)}
          variant="standard"
          sx={{ width: '48px' }}
        >
          <MenuItem value={'01'}>01</MenuItem>
          <MenuItem value={'02'}>02</MenuItem>
          <MenuItem value={'03'}>03</MenuItem>
          <MenuItem value={'04'}>04</MenuItem>
          <MenuItem value={'05'}>05</MenuItem>
          <MenuItem value={'06'}>06</MenuItem>
          <MenuItem value={'07'}>07</MenuItem>
          <MenuItem value={'08'}>08</MenuItem>
          <MenuItem value={'09'}>09</MenuItem>
          <MenuItem value={'10'}>10</MenuItem>
          <MenuItem value={'11'}>11</MenuItem>
          <MenuItem value={'12'}>12</MenuItem>
        </Select>

        {':'}

        {/* Minute */}
        <Select
          value={minute}
          onChange={(event) => setMinute(event.target.value)}
          variant="standard"
          sx={{ width: '48px' }}
        >
          <MenuItem value={'00'}>00</MenuItem>
          <MenuItem value={'15'}>15</MenuItem>
          <MenuItem value={'30'}>30</MenuItem>
          <MenuItem value={'45'}>45</MenuItem>
        </Select>

        {/* Day Period */}
        <Select
          value={period}
          onChange={(event) => setPerod(event.target.value)}
          variant="standard"
          sx={{ width: '64px' }}
        >
          <MenuItem value={'AM'}>AM</MenuItem>
          <MenuItem value={'PM'}>PM</MenuItem>
        </Select>
      </Box>
      <Box
        sx={{
          marginTop: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ color: 'text.secondary' }}>
          <Button variant="outlined" color="inherit" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
        <Button
          variant="contained"
          color="secondary"
          disableElevation
          sx={{ color: 'white' }}
          onClick={handleCommit}
        >
          Set
        </Button>
      </Box>
    </Dialog>
  )
}

export default SchedulePad
