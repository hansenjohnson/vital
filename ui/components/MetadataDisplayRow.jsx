import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import StatusIcon from './StatusIcon'

const cellStyle = (theme) => ({
  fontFamily: theme.typography.monoFamily,
  fontSize: '12px',
  whiteSpace: 'nowrap',
  paddingLeft: 1,
  paddingTop: '2px',
  paddingBottom: '2px',
})

const MetadataDisplayRow = ({ values, warnings, errors }) => {
  const status = (() => {
    if (errors.length > 0) {
      return 'error'
    } else if (warnings.length > 0) {
      return 'warning'
    }
    return 'success'
  })()

  return (
    <TableRow>
      <TableCell padding="none" sx={(theme) => ({ ...cellStyle(theme), paddingLeft: '4px' })}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <StatusIcon status={status} />
        </Box>
      </TableCell>

      {values.map((value, index) => (
        <TableCell key={`${index}-${value}`} padding="none" sx={cellStyle}>
          {value}
        </TableCell>
      ))}

      <TableCell padding="none" sx={(theme) => ({ ...cellStyle(theme), whiteSpace: 'pre' })}>
        <Box component="span" sx={{ color: 'warning.main' }}>
          {warnings.join('\n')}
        </Box>
        {warnings.length > 0 && <br />}
        <Box component="span" sx={{ color: 'error.main' }}>
          {errors.join('\n')}
        </Box>
      </TableCell>
    </TableRow>
  )
}

export default MetadataDisplayRow
