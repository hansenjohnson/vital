import { useMemo, useState } from 'react'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TableSortLabel from '@mui/material/TableSortLabel'

import MetadataDisplayRow from './MetadataDisplayRow'
import STATUSES, { WARNINGS, ERRORS } from '../constants/statuses'

const tableHeaderCellStyle = {
  fontWeight: 400,
  fontSize: '12px',
  whiteSpace: 'nowrap',
}

const standardComparator = (a, b, orderBy, orderByAlt, transformer) => {
  const currentA = orderByAlt ? a[orderByAlt] : a[orderBy]
  const currentB = orderByAlt ? b[orderByAlt] : b[orderBy]
  const trueA = transformer ? transformer(currentA) : currentA
  const trueB = transformer ? transformer(currentB) : currentB
  if (trueB < trueA) return -1
  if (trueB > trueA) return 1
  return 0
}

const getDirectionalSorter = (order, orderBy, orderByAlt, transformer) => {
  return order === 'desc'
    ? (a, b) => standardComparator(a, b, orderBy, orderByAlt, transformer)
    : (a, b) => -standardComparator(a, b, orderBy, orderByAlt, transformer)
}

const statusTransformer = (status) => {
  if (status === STATUSES.SUCCESS) return 0
  if (status === STATUSES.WARNING) return 1
  if (status === STATUSES.ERROR) return 2
  return 3
}

const MetadataDisplayTable = ({ columns, data }) => {
  // Sort by File Name as Default (aka index 0)
  const [order, setOrder] = useState('asc')
  const [orderBy, setOrderBy] = useState(columns[0].key)
  const [orderByAlt, setOrderByAlt] = useState(columns[0].key)

  const createSortHandler =
    (property, altProperty = null) =>
    () => {
      const isAsc = orderBy === property && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(property)
      setOrderByAlt(altProperty)
    }

  const sortedData = useMemo(() => {
    const columnData = columns.find((column) => column.key === orderBy)
    const transformer = orderBy === 'status' ? statusTransformer : columnData?.comparatorTransformer
    const directionalSorter = getDirectionalSorter(order, orderBy, orderByAlt, transformer)
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
              }}
              sortDirection={orderBy === 'status' ? order : false}
            >
              <TableSortLabel
                active={orderBy === 'status'}
                direction={orderBy === 'status' ? order : 'asc'}
                onClick={createSortHandler('status')}
              />
            </TableCell>

            {columns.map((column, index) => (
              <TableCell
                key={`${index}-${column.key}`}
                padding="none"
                sx={{
                  ...tableHeaderCellStyle,
                  ...(index === 0 ? { paddingLeft: 0.5 } : {}),
                }}
                align={column.align === 'center' ? 'right' : column.align}
                sortDirection={orderBy === column.key ? order : false}
              >
                <TableSortLabel
                  active={orderBy === column.key}
                  direction={orderBy === column.key ? order : 'asc'}
                  onClick={createSortHandler(column.key, column.overwriteKey)}
                >
                  {column.label}
                </TableSortLabel>
              </TableCell>
            ))}

            <TableCell
              padding="none"
              sx={{ ...tableHeaderCellStyle, paddingLeft: 1, minWidth: '200px' }}
            >
              Warnings/Errors
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedData.map((row) => (
            <MetadataDisplayRow
              key={JSON.stringify(row)}
              values={columns.map((column) => {
                let value = row[column.key]
                if (column.overwriteKey) {
                  value = row[column.overwriteKey] ?? value
                }
                if ('transformer' in column) {
                  return column.transformer(value)
                }
                return value
              })}
              aligns={columns.map((column) => column.align)}
              maxWidths={columns.map((column) => column.maxWidth)}
              warnings={row.warnings.map((warning) => WARNINGS.get(warning).message)}
              errors={row.errors.map((error) => ERRORS.get(error).message)}
              status={row.status}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default MetadataDisplayTable
