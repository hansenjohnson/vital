import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import ROUTES from '../constants/routes'
import TOOLS from '../constants/tools'
import MainActionButton from '../components/MainActionButton'
import ToolButton from '../components/ToolButton'
import Sidebar from '../components/Sidebar'

const ToolsContainer = ({ setRoute }) => {
  useEffect(() => {
    window.api.setTitle('Video Catalog Suite')
  }, [])

  const [tool, setTool] = useState(TOOLS.ASSOCIATE_ANNOTATE)

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
              onClick={() => alert('not implemented yet!')}
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
              onClick={() => {
                // TODO: launch a file picker dialog instead of changing the route
                setRoute(ROUTES.ASSOCIATIONS_CREATE)
              }}
            />
          </>
        )}

        {tool === TOOLS.INGEST_TRANSCODE && <div>Not Implemented Yet</div>}
      </Box>
    </Box>
  )
}

export default ToolsContainer
