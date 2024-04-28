import { forwardRef } from 'react'

import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Slide from '@mui/material/Slide'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const PillButton = ({ children, ...rest }) => (
  <Button
    variant="outlined"
    sx={{
      paddingLeft: 2,
      paddingRight: 2,
      paddingTop: '2px',
      paddingBottom: '2px',
      fontSize: '14px',
      lineHeight: 1,
      fontWeight: 500,
      textTransform: 'lowercase',
      boxShadow: 'none',
      '&:hover': {
        boxShadow: 'none',
      },
    }}
    {...rest}
  >
    {children}
  </Button>
)

const TableHeader = () => (
  <TableHead>
    <TableRow>
      <TableCell>Date</TableCell>
      <TableCell align="left">Observer</TableCell>
      <TableCell align="right">Time</TableCell>
      <TableCell align="right">Letter</TableCell>
      <TableCell align="right"></TableCell>
    </TableRow>
  </TableHead>
)

const SightingsDialog = ({ open, handleClose, sightings, handleSelect }) => {
  const makeTableRow = ({ id, date, observer, time, letter }) => (
    <TableRow
      key={id}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell
        sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}
        component="th"
        scope="row"
      >
        {date}
      </TableCell>
      <TableCell sx={{ fontFamily: "'Sometype Mono Variable', monopace" }} align="left">
        {observer}
      </TableCell>
      <TableCell sx={{ fontFamily: "'Sometype Mono Variable', monopace" }} align="right">
        {time}
      </TableCell>
      <TableCell sx={{ fontFamily: "'Sometype Mono Variable', monopace" }} align="right">
        {letter}
      </TableCell>
      <TableCell sx={{ fontFamily: "'Sometype Mono Variable', monopace" }} align="right">
        <PillButton onClick={() => handleSelect(id)}>select</PillButton>
      </TableCell>
    </TableRow>
  )

  return (
    <Dialog
      TransitionComponent={Transition}
      maxWidth="md"
      fullWidth
      keepMounted
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { height: '80vh' },
      }}
    >
      <DialogTitle
        sx={{
          color: 'primary.dark',
          backgroundColor: 'primary.light',
          fontSize: 24,
          paddingTop: 1,
          paddingBottom: 1,
        }}
      >
        Choose a Sighting
      </DialogTitle>

      <IconButton
        onClick={handleClose}
        color="primary"
        size="small"
        sx={(theme) => ({
          position: 'absolute',
          right: theme.spacing(1),
          top: theme.spacing(1),
          color: 'primary.dark',
        })}
      >
        <CloseIcon sx={{ fontSize: '30px' }} />
      </IconButton>

      <DialogContent sx={{ height: '100%' }}>
        <TableContainer component={Paper} sx={{ boxShadow: 'none', maxHeight: '100%' }}>
          <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
            <TableHeader />
            <TableBody>{sightings.map(makeTableRow)}</TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  )
}

export default SightingsDialog
