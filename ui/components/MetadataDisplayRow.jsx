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

const DefaultCell = ({ value, align, firstColumn }) => (
  <TableCell
    padding="none"
    sx={(theme) => ({ ...cellStyle(theme), ...(firstColumn ? { paddingLeft: 0.5 } : {}) })}
    align={align}
  >
    {value}
  </TableCell>
)

const CellWithTooltip = ({ value, maxWidth, firstColumn }) => {
  const widthTruncStyle = maxWidth
    ? { maxWidth: `${maxWidth}px`, overflow: 'hidden', textOverflow: 'ellipsis' }
    : {}
  const firstColumnStyle = firstColumn ? { paddingLeft: 0.5 } : {}
  return (
    <StyledTooltip title={value} darker onOpen={() => maxWidth > 0} enterDelay={750}>
      <TableCell
        padding="none"
        sx={(theme) => ({
          ...cellStyle(theme),
          ...widthTruncStyle,
          ...firstColumnStyle,
        })}
      >
        {value}
      </TableCell>
    </StyledTooltip>
  )
}

const MetadataDisplayRow = ({ values, aligns, maxWidths, warnings, errors, status }) => {
  return (
    <TableRow>
      <TableCell padding="none" sx={(theme) => ({ ...cellStyle(theme), paddingLeft: 0 })}>
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
        const align = aligns[index]
        const maxWidth = maxWidths[index]
        const cell =
          maxWidth > 0 ? (
            <CellWithTooltip
              key={`${index}-${value}`}
              value={value}
              align={align}
              maxWidth={maxWidth}
              firstColumn={index === 0}
            />
          ) : (
            <DefaultCell
              key={`${index}-${value}`}
              value={value}
              align={align}
              firstColumn={index === 0}
            />
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
