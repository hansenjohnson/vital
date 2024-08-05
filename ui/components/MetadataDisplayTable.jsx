import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'

import MetadataDisplayRow from './MetadataDisplayRow'
import { WARNING_MESSAGES, ERROR_MESSAGES } from '../constants/statuses'

const MetadataDisplayTable = ({ columns, data }) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead sx={{ backgroundColor: 'black' }}>
          <TableRow sx={{}}>
            <TableCell
              padding="none"
              sx={{
                fontWeight: 400,
                paddingTop: 0.5,
                paddingBottom: 0.5,
                width: '24px',
                whiteSpace: 'nowrap',
              }}
            >
              &nbsp;
            </TableCell>

            {columns.map((column, index) => (
              <TableCell
                key={`${index}-${column.key}`}
                padding="none"
                sx={{ fontWeight: 400, whiteSpace: 'nowrap', paddingLeft: 1 }}
              >
                {column.label}
              </TableCell>
            ))}

            <TableCell
              padding="none"
              sx={{ fontWeight: 400, whiteSpace: 'nowrap', paddingLeft: 1 }}
            >
              Warnings/Errors
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
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
