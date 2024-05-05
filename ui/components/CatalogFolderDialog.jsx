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
      <TableCell>Year</TableCell>
      <TableCell>Month</TableCell>
      <TableCell>Day</TableCell>
      <TableCell>Observer</TableCell>
      <TableCell align="right"></TableCell>
    </TableRow>
  </TableHead>
)

const CatalogFolderDialog = ({ open, handleClose, catalogFolders, handleSelect }) => {
  const makeTableRow = ({ id, year, month, day, observer }) => (
    <TableRow
      key={id}
      sx={{
        '&:last-child td, &:last-child th': { border: 0 },
      }}
    >
      <TableCell sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>{year}</TableCell>
      <TableCell sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
        {`${month}`.padStart(2, '0')}
      </TableCell>
      <TableCell sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>
        {`${day}`.padStart(2, '0')}
      </TableCell>
      <TableCell sx={{ fontFamily: "'Sometype Mono Variable', monopace" }}>{observer}</TableCell>
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
        Choose a Catalog Folder of Videos
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
            <TableBody>{catalogFolders.map(makeTableRow)}</TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  )
}

export default CatalogFolderDialog
