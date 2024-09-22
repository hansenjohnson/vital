import Box from '@mui/material/Box'
import TableSortLabel from '@mui/material/TableSortLabel'

import {
  TABLE_HEADER_HEIGHT,
  TABLE_HEADER_BOT_BORDER,
  STATUS_COLUMN_WIDTH,
  ERRORS_COLUMN_WIDTH,
} from '../constants/dimensions'

const HeaderCell = ({ children, align, width, sx }) => (
  <Box
    role="cell"
    sx={(theme) => ({
      // consistent styles
      fontWeight: 400,
      fontSize: '12px',
      whiteSpace: 'nowrap',
      height: `${TABLE_HEADER_HEIGHT}px`,
      backgroundColor: 'black',
      borderBottom: `${TABLE_HEADER_BOT_BORDER}px solid ${theme.palette.action.disabled}`,
      display: 'flex',
      alignItems: 'center',
      flexGrow: 0,
      flexShrink: 0,

      // variable styles per-cell/per-column
      width,
      textAlign: align ?? 'left',
      ...(sx ?? {}),
    })}
  >
    {children}
  </Box>
)

const MetadataDisplayHeader = ({ columns, order, orderBy, createSortHandler }) => (
  <Box role="row" sx={{ display: 'flex', width: '100%' }}>
    <HeaderCell width={STATUS_COLUMN_WIDTH}>
      <TableSortLabel
        active={orderBy === 'status'}
        direction={orderBy === 'status' ? order : 'asc'}
        onClick={createSortHandler('status')}
      />
    </HeaderCell>

    {columns.map((column, index) => (
      <HeaderCell
        key={`${index}-${column.key}`}
        align={column.align === 'center' ? 'right' : column.align}
        width={column.width}
      >
        <TableSortLabel
          active={orderBy === column.key}
          direction={orderBy === column.key ? order : 'asc'}
          onClick={createSortHandler(column.key, column.overwriteKey)}
          sx={{
            width: '100%',
            direction: ['right', 'center'].includes(column.align) ? 'rtl' : 'ltr',
          }}
        >
          {column.label}
        </TableSortLabel>
      </HeaderCell>
    ))}

    <HeaderCell width={ERRORS_COLUMN_WIDTH} sx={{ paddingLeft: 1 }}>
      Warnings/Errors
    </HeaderCell>
  </Box>
)

export default MetadataDisplayHeader
