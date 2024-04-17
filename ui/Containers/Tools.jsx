import Box from '@mui/material/Box'

import MainActionButton from '../Components/MainActionButton'
import ROUTES from '../routes'

const ToolsContainer = ({ setRoute }) => {
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ width: '400px', backgroundColor: 'primary.dark' }}>Left Side</Box>
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
            setRoute(ROUTES.ASSOCIATIONS_CREATE)
          }}
        />
      </Box>
    </Box>
  )
}

export default ToolsContainer
