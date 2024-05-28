import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Box from '@mui/material/Box'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay'

import useStore from '../store'
import { getViewSuffix } from '../store/associations-view'
import thumbnailsAPI from '../api/thumbnails'
import { VIEW_MODES } from '../constants/routes'
import { leafPath } from '../utilities/paths'

import Sidebar from '../components/Sidebar'
import StyledSelect from '../components/StyledSelect'
import LinkageListItem from '../components/LinkageListItem'
import LinkageGroupHeader from '../components/LinkageGroupHeader'
import ViewModeTab from '../components/ViewModeTab'

const AssociationsViewSidebar = () => {
  const [viewYear, setViewYear] = useStore(
    useShallow((state) => [state.viewYear, state.setViewYear])
  )
  const [viewSuffix, setViewSuffix] = useStore(
    useShallow((state) => [state.viewSuffix, state.setViewSuffix])
  )

  const [viewMode, viewBySighting, viewByVideo] = useStore(
    useShallow((state) => [state.viewMode, state.viewBySighting, state.viewByVideo])
  )

  // Sightings Data Handling
  const sightings = useStore((state) => state.sightings)
  const sightingYears = [...new Set(sightings.map((sighting) => sighting.year))]
  const sightingSuffixes = [...new Set(sightings.map(getViewSuffix))]
  sightingSuffixes.sort((a, b) => a.localeCompare(b))

  // Linkage Data Handling
  const linkages = useStore((state) => state.linkages)
  const loadLinkages = useStore((state) => state.loadLinkages)
  useEffect(() => {
    // Set Default Options as initial reaction to them being available
    if (viewYear == null) {
      setViewYear(sightingYears[0])
    }
    if (viewSuffix == null) {
      setViewSuffix(sightingSuffixes[0])
    }

    loadLinkages()
  }, [viewYear, viewSuffix])

  // Make by-video groups available
  const linkageGroups = linkages.reduce((acc, linkage) => {
    const groupName = linkage.video.fileName
    if (!(groupName in acc)) {
      acc[groupName] = [linkage]
    } else {
      acc[groupName].push(linkage)
    }
    return acc
  }, {})

  // Linkage Item Handling
  const activeLinkageId = useStore((state) => state.activeLinkageId)
  const setActiveLinkage = useStore((state) => state.setActiveLinkage)

  const makeLinkageItem = (linkage) => (
    <LinkageListItem
      key={linkage.id}
      id={linkage.id}
      regionStart={linkage.regionStart}
      regionEnd={linkage.regionEnd}
      sighting={linkage.sighting}
      frameRate={linkage.video.frameRate}
      thumbnail={thumbnailsAPI.formulateHostedPath(linkage.thumbnail)}
      onClick={() => setActiveLinkage(linkage)}
      selected={linkage.id === activeLinkageId}
    />
  )

  return (
    <Sidebar noPadding noGap>
      <Box
        sx={{
          width: '100%',
          paddingTop: 1,
          paddingBottom: 0,
          color: 'black',
          backgroundColor: 'background.headerPaper',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ marginLeft: 1, marginRight: 1, display: 'flex', gap: 1 }}>
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

        <Box
          sx={{
            marginTop: '2px',
            marginBottom: '2px',
            marginRight: 1,
            alignSelf: 'flex-end',
            opacity: '0.75',
          }}
        >
          {linkages.length} Associations
        </Box>

        <Box sx={{ display: 'flex' }}>
          <ViewModeTab
            name="by sighting"
            icon={AccountTreeIcon}
            selected={viewMode === VIEW_MODES.BY_SIGHTING}
            onClick={viewBySighting}
          />
          <ViewModeTab
            name="by video"
            icon={SmartDisplayIcon}
            selected={viewMode === VIEW_MODES.BY_VIDEO}
            onClick={viewByVideo}
          />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Box sx={{ marginTop: '2px' }} />
        {viewMode === VIEW_MODES.BY_SIGHTING && linkages.map(makeLinkageItem)}
        {viewMode === VIEW_MODES.BY_VIDEO &&
          Object.entries(linkageGroups).map(([group, linkages], index) => (
            <Box key={group} sx={{ marginTop: index > 0 ? '2px' : 0 }}>
              <LinkageGroupHeader name={leafPath(group).split('.')[0]} />
              <Box sx={{ marginTop: '2px' }} />
              {linkages.map(makeLinkageItem)}
            </Box>
          ))}
        <Box sx={{ marginBottom: '4px' }} />
      </Box>
    </Sidebar>
  )
}

export default AssociationsViewSidebar
