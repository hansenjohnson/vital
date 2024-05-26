import { useState, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import Box from '@mui/material/Box'

import useStore from '../store'
import useSettingsStore from '../store/settings'
import ROUTES from '../constants/routes'
import TOOLS from '../constants/tools'
import catalogFoldersAPI from '../api/catalogFolders'
import { transformCatalogFolderData, sortCatalogFolderData } from '../utilities/transformers'

import MainActionButton from '../components/MainActionButton'
import ToolButton from '../components/ToolButton'
import Sidebar from '../components/Sidebar'
import CatalogFolderDialog from '../components/CatalogFolderDialog'

const ToolsContainer = () => {
  const setRoute = useStore((state) => state.setRoute)
  const settingsInitialized = useSettingsStore((state) => state.initialized)
  const [setVideoFolderId, setVideoFolderName] = useStore(
    useShallow((state) => [state.setVideoFolderId, state.setVideoFolderName])
  )

  const [tool, setTool] = useState(TOOLS.ASSOCIATE_ANNOTATE)

  const [catalogFolders, setCatalogFolders] = useState([])
  const [catalogFoldersDialog, setCatalogFoldersDialog] = useState(false)
  const [catalogFoldersRedirect, setCatalogFoldersRedirect] = useState(null)
  useEffect(() => {
    catalogFoldersAPI.getList().then((data) => {
      const { folders } = data
      const transformedData = folders.map(transformCatalogFolderData)
      const sortedFolders = sortCatalogFolderData(transformedData)
      setCatalogFolders(sortedFolders)
    })
  }, [settingsInitialized])

  const loadSightings = useStore((state) => state.loadSightings)
  const handleClickViewAssociations = async () => {
    await loadSightings()
    setRoute(ROUTES.ASSOCIATIONS_VIEW)
  }

  const handleClickCreateAssociations = () => {
    setCatalogFoldersRedirect(ROUTES.ASSOCIATIONS_CREATE)
    setCatalogFoldersDialog(true)
  }

  const handleSelectCatalogFolder = (catalogFolderId) => {
    const catalogFolder = catalogFolders.find((entry) => entry.id === catalogFolderId)
    setVideoFolderId(catalogFolderId)
    setVideoFolderName(`${catalogFolder.date}-${catalogFolder.observer}`)
    setRoute(catalogFoldersRedirect)
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Tool Selector */}
      <Sidebar>
        <ToolButton
          name="Associate & Annotate"
          selected={tool === TOOLS.ASSOCIATE_ANNOTATE}
          onClick={() => setTool(TOOLS.ASSOCIATE_ANNOTATE)}
        />
        <ToolButton
          name="Ingest & Transcode"
          selected={tool === TOOLS.INGEST_TRANSCODE}
          onClick={() => setTool(TOOLS.INGEST_TRANSCODE)}
        />
      </Sidebar>

      {/* Contents of Tool View */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
        }}
      >
        {tool === TOOLS.ASSOCIATE_ANNOTATE && (
          <>
            <MainActionButton
              note={
                <div>
                  <div style={{ fontSize: '36px', marginBottom: '-18px' }}>156</div>
                  <br />
                  <div style={{ fontSize: '16px' }}>
                    associations
                    <br />
                    created
                    <br />
                    this week
                  </div>
                </div>
              }
              action="View Existing Associations"
              noteFirst
              onClick={handleClickViewAssociations}
            />
            <MainActionButton
              action="Create New Associations"
              note={
                <div style={{ marginRight: '0px' }}>
                  select
                  <br />a folder
                  <br />
                  of videos
                </div>
              }
              color="secondary"
              onClick={handleClickCreateAssociations}
            />
          </>
        )}

        {tool === TOOLS.INGEST_TRANSCODE && <div>Not Implemented Yet</div>}
      </Box>

      <CatalogFolderDialog
        open={catalogFoldersDialog}
        handleClose={() => setCatalogFoldersDialog(false)}
        catalogFolders={catalogFolders}
        handleSelect={handleSelectCatalogFolder}
      />
    </Box>
  )
}

export default ToolsContainer
