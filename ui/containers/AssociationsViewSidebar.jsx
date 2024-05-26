import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Box from '@mui/material/Box'

import useStore from '../store'
import Sidebar from '../components/Sidebar'
import StyledSelect from '../components/StyledSelect'

const AssociationsViewSidebar = () => {
  const [viewYear, setViewYear] = useStore(
    useShallow((state) => [state.viewYear, state.setViewYear])
  )
  const [viewSuffix, setViewSuffix] = useStore(
    useShallow((state) => [state.viewSuffix, state.setViewSuffix])
  )

  return (
    <Sidebar>
      <Box
        sx={(theme) => ({
          width: `calc(100% + ${theme.spacing(2)})`,
          margin: -1,
          padding: 1,
          color: 'black',
          backgroundColor: 'background.headerPaper',
          display: 'flex',
          gap: 1,
        })}
      >
        <Box sx={{ width: '90px' }}>
          <StyledSelect
            label="Year"
            value={viewYear}
            handleChange={(event) => setViewYear(event.target.value)}
            options={['2021', '2022', '2023', '2024']}
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          <StyledSelect
            label="Viewing"
            value={viewSuffix}
            handleChange={(event) => setViewSuffix(event.target.value)}
            options={['07-18 CWR', '07-19 GLL-DR', '10-13 TC-DASH8']}
          />
        </Box>
      </Box>

      <Box>
        <Box>Sighting 1</Box>
        <Box>Sighting 2</Box>
        <Box>Sighting 3</Box>
        <Box>Sighting 4</Box>
      </Box>
    </Sidebar>
  )
}

export default AssociationsViewSidebar
