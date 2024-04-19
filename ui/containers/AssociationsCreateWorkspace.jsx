import Box from '@mui/material/Box'

import VideoPlayer from '../components/VideoPlayer'
import VideoTimeline from '../components/VideoTimeline'
import AssociationsDetailsBox from '../components/AssociationDetialsBox'
import StyledButton from '../components/StyledButton'

const AssociationsCreateWorkspace = () => {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <VideoPlayer />

      <VideoTimeline />

      <Box sx={{ flexGrow: 1, display: 'flex' }}>
        <AssociationsDetailsBox />
        <Box
          sx={(theme) => ({
            width: '200px',
            height: `calc(100% - ${theme.spacing(2)})`,
            margin: 1,
            marginLeft: 0,
            display: 'flex',
            flexDirection: 'column',
          })}
        >
          <StyledButton>Annotation Tools</StyledButton>
          <Box sx={{ flexGrow: 1 }} />
          <StyledButton>Export Still Frame</StyledButton>
          <Box sx={{ flexGrow: 1 }} />
          <StyledButton>Save Association</StyledButton>
          <Box sx={{ flexGrow: 1 }} />
          <StyledButton>Skip Video</StyledButton>
        </Box>
      </Box>
    </Box>
  )
}

export default AssociationsCreateWorkspace
