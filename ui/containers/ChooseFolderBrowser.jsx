import { useState, useEffect } from 'react'
import { useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import List from '@mui/material/List'

import useStore from '../store'
import useSettingsStore from '../store/settings'
import FolderBrowserButton from '../components/FolderBrowserButton'
import { monthDayString } from '../utilities/strings'

const ChooseFolderBrowser = () => {
  const theme = useTheme()

  const settingsInitialized = useSettingsStore((state) => state.initialized)

  const selectFolder = useStore((state) => state.selectFolder)
  const folders = useStore((state) => state.folders)
  const loadFolders = useStore((state) => state.loadFolders)
  useEffect(() => {
    loadFolders()
  }, [settingsInitialized])

  const years = [...new Set(folders.map((folder) => folder.year))]
  const [selectedYear, _setSelectedYear] = useState(null)
  const setSelectedYear = (year) => {
    _setSelectedYear(year)
    setSelectedDate(null)
    setSelectedObserver(null)
  }

  const dates = [
    ...new Set(
      folders
        .filter((folder) => folder.year === selectedYear)
        .map((date) => monthDayString(date.month, date.day))
    ),
  ]
  const [selectedDate, _setSelectedDate] = useState(null)
  const setSelectedDate = (date) => {
    _setSelectedDate(date)
    setSelectedObserver(null)
  }

  const observers = [
    ...new Set(
      folders
        .filter(
          (folder) =>
            folder.year === selectedYear &&
            monthDayString(folder.month, folder.day) === selectedDate
        )
        .map((folder) => folder.observer)
    ),
  ]
  const [selectedObserver, _setSelectedObserver] = useState(null)
  const setSelectedObserver = (observer) => {
    if (!observer) {
      selectFolder(null)
      _setSelectedObserver(observer)
      return
    }

    const selectedFolder = folders.find(
      (folder) =>
        folder.year === selectedYear &&
        monthDayString(folder.month, folder.day) === selectedDate &&
        folder.observer === observer
    )
    selectFolder(selectedFolder.id)
    _setSelectedObserver(observer)
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        minHeight: 0,
        width: '100%',
        marginTop: 2,
        marginBottom: 2,
        display: 'flex',
      }}
    >
      {/* Year Column */}
      <Box
        sx={{
          flex: '1 1 33%',
          paddingLeft: 1,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ marginLeft: 1, marginBottom: 2 }}>
          <h4 style={{ margin: 0 }}>Year</h4>
        </Box>
        <List
          dense
          sx={{
            height: `calc(100% - ${theme.spacing(4)})`,
            overflow: 'auto',
            paddingRight: 1,
            paddingTop: 0,
          }}
        >
          {years.map((year) => (
            <FolderBrowserButton
              key={year}
              selected={year === selectedYear}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </FolderBrowserButton>
          ))}
        </List>
      </Box>

      {/* Date Column */}
      <Box
        sx={{
          flex: '1 1 33%',
          paddingLeft: 1,
          borderRight: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ marginLeft: 1, marginBottom: 2 }}>
          <h4 style={{ margin: 0 }}>Date</h4>
        </Box>
        <List
          dense
          sx={{
            height: `calc(100% - ${theme.spacing(4)})`,
            overflow: 'auto',
            paddingRight: 1,
            paddingTop: 0,
          }}
        >
          {dates.map((date) => (
            <FolderBrowserButton
              key={date}
              selected={date === selectedDate}
              onClick={() => setSelectedDate(date)}
            >
              {date}
            </FolderBrowserButton>
          ))}
        </List>
      </Box>

      {/* Observer Column */}
      <Box sx={{ flex: '1 1 33%', paddingLeft: 1 }}>
        <Box sx={{ marginLeft: 1, marginBottom: 2 }}>
          <h4 style={{ margin: 0 }}>Observer</h4>
        </Box>
        <List
          dense
          sx={{
            height: `calc(100% - ${theme.spacing(4)})`,
            overflow: 'auto',
            paddingRight: 1,
            paddingTop: 0,
          }}
        >
          {observers.map((observer) => (
            <FolderBrowserButton
              key={observer}
              selected={observer === selectedObserver}
              onClick={() => setSelectedObserver(observer)}
            >
              {observer}
            </FolderBrowserButton>
          ))}
        </List>
      </Box>
    </Box>
  )
}

export default ChooseFolderBrowser
