import { useEffect, useMemo, useState, useRef } from 'react'
import { VariableSizeList as VirtualList } from 'react-window'
import Box from '@mui/material/Box'

import MetadataDisplayRow from './MetadataDisplayRow'
import STATUSES from '../constants/statuses'
import {
  TITLEBAR_HEIGHT,
  SIDEBAR_WIDTH,
  TABLE_HEADER_HEIGHT,
  TABLE_ROW_HEIGHT,
  TABLE_ROW_INNER_HEIGHT,
} from '../constants/dimensions'
import MetadataDisplayHeader from './MetadataDisplayHeader'

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

  const virtualListRef = useRef(null)
  useEffect(() => {
    virtualListRef.current?.resetAfterIndex(0)
  }, [JSON.stringify(sortedData)])

  return (
    <Box role="table">
      <Box role="rowgroup" sx={{ backgroundColor: 'black' }}>
        <MetadataDisplayHeader
          columns={columns}
          order={order}
          orderBy={orderBy}
          createSortHandler={createSortHandler}
        />
      </Box>

      <Box role="rowgroup">
        <VirtualList
          ref={virtualListRef}
          itemData={{
            items: sortedData,
            columns,
          }}
          itemCount={sortedData.length}
          overscanCount={10}
          width={document.body.clientWidth - SIDEBAR_WIDTH}
          height={document.body.clientHeight - TITLEBAR_HEIGHT - TABLE_HEADER_HEIGHT}
          itemSize={(index) => {
            const row = sortedData[index]
            const numWarnings = row.warnings.length
            const numErrors = row.errors.length
            return Math.max(
              (numWarnings + numErrors - 1) * TABLE_ROW_INNER_HEIGHT + TABLE_ROW_HEIGHT,
              TABLE_ROW_HEIGHT
            )
          }}
        >
          {MetadataDisplayRow}
        </VirtualList>
      </Box>
    </Box>
  )
}

export default MetadataDisplayTable
