import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'

import MetadataDisplayRow from './MetadataDisplayRow'

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
              values={columns.map((column) => row[column.key])}
              warnings={row.warnings}
              errors={row.errors}
            />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default MetadataDisplayTable
