import Box from '@mui/material/Box'

import MainActionButton from '../Components/MainActionButton'
import ROUTES from '../routes'

const ToolsContainer = ({ setRoute }) => {
  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <Box sx={{ width: '300px', backgroundColor: 'primary.dark' }}>Left Side</Box>
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
          note="156 Associations this week"
          action="View Existing Associations"
          noteFirst
          onClick={() => alert('not implemented yet!')}
        />
        <MainActionButton
          action="Create New Associations"
          note="Select a Folder of Videos"
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
