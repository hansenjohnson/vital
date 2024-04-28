import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import ROUTES from '../constants/routes'
import TOOLS from '../constants/tools'
import FILE_TYPES from '../constants/fileTypes'
import MainActionButton from '../components/MainActionButton'
import ToolButton from '../components/ToolButton'
import Sidebar from '../components/Sidebar'

import Settings from '../api/settings'

const ToolsContainer = ({ setRoute, setFolderOfVideosToCreate }) => {
  useEffect(() => {
    window.api.setTitle('Video Catalog Suite')
  }, [])

  const [tool, setTool] = useState(TOOLS.ASSOCIATE_ANNOTATE)

  const handleClickViewAssociations = () => {
    alert('not implemented yet!')
  }

  const handleClickCreateAssociations = async () => {
    const folderPath = await window.api.selectFile(FILE_TYPES.FOLDER)
    if (!folderPath) return
    setFolderOfVideosToCreate(folderPath)
    setRoute(ROUTES.ASSOCIATIONS_CREATE)
    await Settings.save({ folder_of_videos: folderPath })
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
    </Box>
  )
}

export default ToolsContainer
