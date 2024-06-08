import { forwardRef } from 'react'

import { useTheme } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'
import Slide from '@mui/material/Slide'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import { LINKAGE_MODES } from '../constants/routes'
import StyledPillButton from './StyledPillButton'
import StyledButton from './StyledButton'

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const TableHeader = ({ mode }) => (
  <TableHead>
    <TableRow>
      <TableCell>Date</TableCell>
      <TableCell align="left">Observer</TableCell>
      <TableCell align="right">Time</TableCell>
      <TableCell align="right">Letter</TableCell>
      {/* To hold text indicating the currently "saved" sighting id */}
      {mode === LINKAGE_MODES.EDIT && <TableCell align="right" sx={{ width: '100px' }}></TableCell>}
      <TableCell
        align="right"
        sx={{ width: mode === LINKAGE_MODES.EDIT ? '100px' : undefined }}
      ></TableCell>
    </TableRow>
  </TableHead>
)

const SightingsDialog = ({
  open,
  handleClose,
  mode,
  sightings,
  selectSighting,
  selectedSightingId,
  newSightingId,
  setNewSightingId,
  newSightingHasOverlap,
  saveable,
  handleSave,
}) => {
  const theme = useTheme()

  // 4 - for button height, 1 - for margin
  const actionContainerHeight =
    mode === LINKAGE_MODES.EDIT ? `calc(${theme.spacing(4)} + ${theme.spacing(1)})` : '0px'

  const handleSelect = (id) => {
    if (mode === LINKAGE_MODES.EDIT) {
      setNewSightingId(id)
    } else {
      selectSighting(id)
    }
  }

  const makeTableRow = ({ id, date, observer, time, letter }) => {
    const showAsSelected = newSightingId !== null ? id === newSightingId : id === selectedSightingId
    const showAsOverlap = newSightingHasOverlap && id === newSightingId
    return (
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
        {mode === LINKAGE_MODES.EDIT && (
          <TableCell
            sx={{
              fontFamily: "'Sometype Mono Variable', monopace",
              fontStyle: 'italic',
              color: showAsOverlap ? 'warning.main' : 'text.secondary',
            }}
            align="right"
          >
            {id === selectedSightingId ? 'current' : ''}
            {showAsOverlap ? 'overlaps' : ''}
          </TableCell>
        )}
        <TableCell sx={{ fontFamily: "'Sometype Mono Variable', monopace" }} align="right">
          <StyledPillButton
            onClick={() => handleSelect(id)}
            color={showAsSelected ? 'secondary' : 'primary'}
            variant={showAsSelected ? 'contained' : 'outlined'}
            sx={{ maxWidth: '89px' }}
          >
            {showAsSelected ? 'selected' : 'select'}
          </StyledPillButton>
        </TableCell>
      </TableRow>
    )
  }

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
        sx={{
          position: 'absolute',
          right: theme.spacing(1),
          top: theme.spacing(1),
          color: 'primary.dark',
        }}
      >
        <CloseIcon sx={{ fontSize: '30px' }} />
      </IconButton>

      <DialogContent sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <TableContainer
          component={Paper}
          sx={{ boxShadow: 'none', maxHeight: `calc(100% - ${actionContainerHeight})` }}
        >
          <Table sx={{ minWidth: 650 }} size="small" stickyHeader>
            <TableHeader mode={mode} />
            <TableBody>{sightings.map(makeTableRow)}</TableBody>
          </Table>
        </TableContainer>

        {mode === LINKAGE_MODES.EDIT && (
          <Box
            sx={{
              flexGrow: 1,
              height: actionContainerHeight,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
            }}
          >
            <StyledButton color="plain" onClick={handleClose}>
              Cancel
            </StyledButton>
            {newSightingHasOverlap && (
              <Typography
                variant="caption"
                color="warning.main"
                sx={{ fontSize: '16px', fontStyle: 'italic', marginBottom: 1 }}
              >
                overlaps another region with this letter
              </Typography>
            )}
            <StyledButton variant="contained" onClick={handleSave} disabled={!saveable}>
              Save
            </StyledButton>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default SightingsDialog
