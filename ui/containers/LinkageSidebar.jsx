import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import AccountTreeIcon from '@mui/icons-material/AccountTree'
import SmartDisplayIcon from '@mui/icons-material/SmartDisplay'

import useStore from '../store'
import { getSelectedFolder } from '../store/folders'
import thumbnailsAPI from '../api/thumbnails'
import { LINKAGE_MODES, VIEW_MODES } from '../constants/routes'
import { leafPath } from '../utilities/paths'
import { viewSuffixString } from '../utilities/strings'

import Sidebar from '../components/Sidebar'
import StyledSelect from '../components/StyledSelect'
import LinkageListItem from '../components/LinkageListItem'
import VideoGroupHeader from '../components/VideoGroupHeader'
import ViewModeTab from '../components/ViewModeTab'

const LinkageSidebar = () => {
  const folders = useStore((state) => state.folders)
  const selectFolder = useStore((state) => state.selectFolder)
  const selectedFolder = useStore((state) => getSelectedFolder(state))

  const folderYears = [...new Set(folders.map((folder) => `${folder.year}`))]
  const [viewYear, _setViewYear] = useState(`${selectedFolder.year}`)
  const setViewYear = (year) => {
    const nextSelectedFolder = folders.filter((folder) => `${folder.year}` === year)[0]
    _setViewYear(year)
    selectFolder(nextSelectedFolder.id)
  }

  const folderSuffixes = [
    ...new Set(folders.filter((folder) => `${folder.year}` === viewYear).map(viewSuffixString)),
  ]
  const viewSuffix = viewSuffixString(selectedFolder)
  const setViewSuffix = (suffix) => {
    const nextSelectedFolder = folders.find(
      (folder) => `${folder.year}` === viewYear && viewSuffixString(folder) === suffix
    )
    selectFolder(nextSelectedFolder.id)
  }

  // Load the following every time the viewSuffix changes
  const linkages = useStore((state) => state.linkages)
  const loadLinkages = useStore((state) => state.loadLinkages)
  const videos = useStore((state) => state.videos)
  const loadVideos = useStore((state) => state.loadVideos)
  useEffect(() => {
    if (viewSuffix == null) return
    loadLinkages()
    loadVideos()
  }, [viewSuffix])

  // View Mode Handling
  const viewMode = useStore((state) => state.viewMode)
  const setViewMode = useStore((state) => state.setViewMode)

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

  // Video & Linkage Item Handling
  const activeVideoId = useStore((state) => state.activeVideoId)
  const activeLinkageId = useStore((state) => state.activeLinkageId)
  const setLinkageMode = useStore((state) => state.setLinkageMode)
  const selectLinkageVideoSighting = useStore((state) => state.selectLinkageVideoSighting)
  const playVideoOnly = (videoId) => {
    setLinkageMode(LINKAGE_MODES.BLANK)
    selectLinkageVideoSighting(null, videoId, null)
  }

  const triggerForceToHighestQuality = useStore((state) => state.triggerForceToHighestQuality)

  const makeLinkageItem = (linkage) => (
    <LinkageListItem
      key={linkage.id}
      id={linkage.id}
      regionStart={linkage.regionStart}
      regionEnd={linkage.regionEnd}
      sighting={linkage.sighting}
      frameRate={linkage.video.frameRate}
      thumbnail={thumbnailsAPI.formulateHostedPath(linkage.thumbnail)}
      onClick={() => selectLinkageVideoSighting(linkage.id, linkage.video.id, linkage.sighting.id)}
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
                options={folderYears}
              />
            )}
          </Box>
          <Box sx={{ flex: 1 }}>
            {viewSuffix && (
              <StyledSelect
                label="Viewing"
                value={viewSuffix}
                handleChange={(event) => setViewSuffix(event.target.value)}
                options={folderSuffixes}
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
          {linkages.length} total Linkages
        </Box>

        <Box sx={{ display: 'flex' }}>
          <ViewModeTab
            name="by video"
            icon={SmartDisplayIcon}
            selected={viewMode === VIEW_MODES.BY_VIDEO}
            onClick={() => setViewMode(VIEW_MODES.BY_VIDEO)}
          />
          <ViewModeTab
            name="by sighting"
            icon={AccountTreeIcon}
            selected={viewMode === VIEW_MODES.BY_SIGHTING}
            onClick={() => setViewMode(VIEW_MODES.BY_SIGHTING)}
          />
        </Box>
      </Box>

      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <Box sx={{ marginTop: '2px' }} />
        {viewMode === VIEW_MODES.BY_SIGHTING && linkages.map(makeLinkageItem)}

        {viewMode === VIEW_MODES.BY_VIDEO &&
          videos.map((video, index) => {
            const { id, fileName } = video
            const videoBaseName = leafPath(fileName).split('.')[0]
            const linkagesForGroup = linkageGroups[fileName]
            return (
              <Box key={id} sx={{ marginTop: index > 0 ? '2px' : 0 }}>
                <VideoGroupHeader
                  name={videoBaseName}
                  onHide={() => null}
                  onReload={triggerForceToHighestQuality}
                  onPlay={() => playVideoOnly(video.id)}
                  isPlaying={id === activeVideoId}
                />
                {linkagesForGroup && linkagesForGroup.map(makeLinkageItem)}
              </Box>
            )
          })}
        <Box sx={{ marginBottom: '4px' }} />
      </Box>
    </Sidebar>
  )
}

export default LinkageSidebar
