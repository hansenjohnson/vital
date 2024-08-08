import Box from '@mui/material/Box'
import ToolTip from '@mui/material/ToolTip'

import StatusIcon from './StatusIcon'

const MetadataSubfolder = ({ status, statusText, children }) => (
  <Box
    sx={(theme) => ({
      paddingLeft: 2.5,
      paddingRight: 2.5,
      paddingTop: 0.5,
      borderRadius: `0 ${theme.spacing(1)} 0 0`,
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
    })}
  >
    <Box sx={{ color: 'text.disabled' }}>Subfolder</Box>
    <ToolTip
      title={statusText}
      placement="top"
      arrow
      componentsProps={{
        tooltip: {
          sx: (theme) => ({ backgroundColor: theme.palette?.[status]?.main }),
        },
        arrow: {
          sx: (theme) => ({ color: theme.palette?.[status]?.main }),
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StatusIcon status={status} />
      </Box>
    </ToolTip>
    <Box>{children}</Box>
  </Box>
)

export default MetadataSubfolder
