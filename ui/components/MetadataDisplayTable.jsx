import { useMemo, useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableSortLabel from '@mui/material/TableSortLabel'
import Box from '@mui/material/Box'
import { visuallyHidden } from '@mui/utils'

import MetadataDisplayRow from './MetadataDisplayRow'
import { WARNING_MESSAGES, ERROR_MESSAGES } from '../constants/statuses'

const tableHeaderCellStyle = {
  fontWeight: 400,
  fontSize: '12px',
  whiteSpace: 'nowrap',
  paddingLeft: 1,
}

const standardComparator = (a, b, orderBy, transformer) => {
  const trueA = transformer ? transformer(a[orderBy]) : a[orderBy]
  const trueB = transformer ? transformer(b[orderBy]) : b[orderBy]
  if (trueB < trueA) return -1
  if (trueB > trueA) return 1
  return 0
}

const getDirectionalSorter = (order, orderBy, transformer) => {
  return order === 'desc'
    ? (a, b) => standardComparator(a, b, orderBy, transformer)
    : (a, b) => -standardComparator(a, b, orderBy, transformer)
}

const MetadataDisplayTable = ({ columns, data }) => {
  // Sort by File Name as Default (aka index 0)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState(columns[0].key)

  const createSortHandler = (property) => () => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const sortedData = useMemo(() => {
    const columnData = columns.find((column) => column.key === orderBy)
    const directionalSorter = getDirectionalSorter(
      order,
      orderBy,
      columnData?.comparatorTransformer
    )
    return data.slice().sort(directionalSorter)
  }, [JSON.stringify(columns), JSON.stringify(data), order, orderBy])

  return (
    <TableContainer>
      <Table size="small">
        <TableHead sx={{ backgroundColor: 'black' }}>
          <TableRow>
            <TableCell
              padding="none"
              sx={{
                ...tableHeaderCellStyle,
                paddingLeft: 0,
                paddingTop: 0.5,
                paddingBottom: 0.5,
                width: '24px',
              }}
            >
              &nbsp;
            </TableCell>

            {columns.map((column, index) => (
              <TableCell
                key={`${index}-${column.key}`}
                padding="none"
                sx={{ ...tableHeaderCellStyle }}
                align={column.align === 'center' ? 'right' : column.align}
                sortDirection={orderBy === column.key ? order : false}
              >
                <TableSortLabel
                  active={orderBy === column.key}
                  direction={orderBy === column.key ? order : 'asc'}
                  onClick={createSortHandler(column.key)}
                >
                  {column.label}
                  {orderBy === column.key ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
            ))}

            <TableCell padding="none" sx={{ ...tableHeaderCellStyle }}>
              Warnings/Errors
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedData.map((row) => (
            <MetadataDisplayRow
              key={JSON.stringify(row)}
              values={columns.map((column) => {
                if ('transformer' in column) {
                  return column.transformer(row[column.key])
                }
                return row[column.key]
              })}
              aligns={columns.map((column) => column.align)}
              maxWidths={columns.map((column) => column.maxWidth)}
              warnings={row.warnings.map((warning) => WARNING_MESSAGES[warning])}
              errors={row.errors.map((error) => ERROR_MESSAGES[error])}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default MetadataDisplayTable
