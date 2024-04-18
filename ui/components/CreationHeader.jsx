import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

import openFolderIcon from '../assets/open-folder-64.png'
import { blackPixelToTheme } from '../theme'

const CreationHeader = ({ videoFolderName }) => (
  <Box
    sx={{
      width: '100%',
      padding: 1,
      borderRadius: 1,
      backgroundColor: 'primary.light',
      color: 'primary.dark',
    }}
  >
    <Typography sx={{ lineHeight: '16px', marginBottom: 0.5 }}>viewing videos within</Typography>
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        overflow: 'hidden',
        wordBreak: 'break-all',
      }}
    >
      <img
        src={openFolderIcon}
        alt="open folder"
        style={{
          width: '24px',
          height: '24px',
          filter: blackPixelToTheme.palette.primary.dark,
        }}
      />
      <Typography sx={{ fontSize: '24px', lineHeight: '24px', fontWeight: 700 }}>
        {videoFolderName}
      </Typography>
    </Box>
  </Box>
)

export default CreationHeader
