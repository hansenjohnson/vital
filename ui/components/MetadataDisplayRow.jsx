import Box from '@mui/material/Box'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'

import StatusIcon from './StatusIcon'
import StyledTooltip from './StyledTooltip'

const cellStyle = (theme) => ({
  fontFamily: theme.typography.monoFamily,
  fontSize: '12px',
  whiteSpace: 'nowrap',
  paddingLeft: 1,
  paddingTop: '2px',
  paddingBottom: '2px',
})

const DefaultCell = ({ children }) => (
  <TableCell padding="none" sx={cellStyle}>
    {children}
  </TableCell>
)

const CellWithTooltip = ({ value, maxWidth }) => {
  const widthTruncStyle = maxWidth
    ? { maxWidth: `${maxWidth}px`, overflow: 'hidden', textOverflow: 'ellipsis' }
    : {}
  return (
    <StyledTooltip title={value} darker onOpen={() => maxWidth > 0}>
      <TableCell
        padding="none"
        sx={(theme) => ({
          ...cellStyle(theme),
          ...widthTruncStyle,
        })}
      >
        {value}
      </TableCell>
    </StyledTooltip>
  )
}

const MetadataDisplayRow = ({ values, maxWidths, warnings, errors }) => {
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

      {values.map((value, index) => {
        const maxWidth = maxWidths[index]
        const cell =
          maxWidth > 0 ? (
            <CellWithTooltip key={`${index}-${value}`} value={value} maxWidth={maxWidth} />
          ) : (
            <DefaultCell key={`${index}-${value}`}>{value}</DefaultCell>
          )
        return cell
      })}

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
