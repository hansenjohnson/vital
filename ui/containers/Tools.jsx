import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import ROUTES from '../constants/routes'
import TOOLS from '../constants/tools'
import SETTINGS_KEYS from '../constants/settingKeys'
import MainActionButton from '../components/MainActionButton'
import ToolButton from '../components/ToolButton'
import Sidebar from '../components/Sidebar'
import CatalogFolderDialog from '../components/CatalogFolderDialog'
import settingsAPI from '../api/settings'
import catalogFoldersAPI from '../api/catalogFolders'
import { sortCatalogFolderData } from '../utilities/transformers'

const ToolsContainer = ({ setRoute }) => {
  useEffect(() => {
    window.api.setTitle('Video Catalog Suite')
  }, [])

  const [tool, setTool] = useState(TOOLS.ASSOCIATE_ANNOTATE)

  const [catalogFolders, setCatalogFolders] = useState([])
  const [catalogFoldersDialog, setCatalogFoldersDialog] = useState(false)
  const [catalogFoldersRedirect, setCatalogFoldersRedirect] = useState(null)
  useEffect(() => {
    catalogFoldersAPI.get().then((data) => {
      const { folders } = data
      const sortedFolders = sortCatalogFolderData(folders)
      setCatalogFolders(sortedFolders)
    })
  }, [])

  const handleClickViewAssociations = () => {
    alert('not implemented yet!')
  }

  const handleClickCreateAssociations = () => {
    setCatalogFoldersRedirect(ROUTES.ASSOCIATIONS_CREATE)
    setCatalogFoldersDialog(true)
  }

  const handleSelectCatalogFolder = async (catalogFolderId) => {
    await settingsAPI.save({ [SETTINGS_KEYS.FOLDER_OF_VIDEOS]: catalogFolderId })
    setRoute(catalogFoldersRedirect)
  }

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* Tool Selector */}
      <Sidebar>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 300 }}>
          TOOLS
        </Typography>
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
        catalogFolders={catalogFolders.map((entry) => ({
          id: entry.CatalogFolderId,
          year: entry.FolderYear,
          month: entry.FolderMonth,
          day: entry.FolderDay,
          observer: entry.ObserverCode,
        }))}
        handleSelect={handleSelectCatalogFolder}
      />
    </Box>
  )
}

export default ToolsContainer
