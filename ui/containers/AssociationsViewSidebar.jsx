import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Box from '@mui/material/Box'

import useStore from '../store'
import { getViewSuffix } from '../store/associations-view'
import Sidebar from '../components/Sidebar'
import StyledSelect from '../components/StyledSelect'

const AssociationsViewSidebar = () => {
  const [viewYear, setViewYear] = useStore(
    useShallow((state) => [state.viewYear, state.setViewYear])
  )
  const [viewSuffix, setViewSuffix] = useStore(
    useShallow((state) => [state.viewSuffix, state.setViewSuffix])
  )

  const sightings = useStore((state) => state.sightings)
  const sightingYears = [...new Set(sightings.map((sighting) => sighting.year))]
  const sightingSuffixes = [...new Set(sightings.map(getViewSuffix))]
  sightingSuffixes.sort((a, b) => a.localeCompare(b))

  // Set Default Options as initial reaction to them being available
  useEffect(() => {
    if (viewYear == null) {
      setViewYear(sightingYears[0])
    }
    if (viewSuffix == null) {
      setViewSuffix(sightingSuffixes[0])
    }
  }, [viewYear, viewSuffix])

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
          {viewYear && (
            <StyledSelect
              label="Year"
              value={viewYear}
              handleChange={(event) => setViewYear(event.target.value)}
              options={sightingYears}
            />
          )}
        </Box>
        <Box sx={{ flex: 1 }}>
          {viewSuffix && (
            <StyledSelect
              label="Viewing"
              value={viewSuffix}
              handleChange={(event) => setViewSuffix(event.target.value)}
              options={sightingSuffixes}
            />
          )}
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
