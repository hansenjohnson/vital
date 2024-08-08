import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Switch from '@mui/material/Switch'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'

const IssueSummaryControls = ({
  title,
  orderedIssuesWithCounts,
  issueConstants,
  ignorable = false,
}) => (
  <Box>
    <Box
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        alignItems: 'flex-end',
      })}
    >
      <Box sx={{ fontSize: '20px' }}>{title}</Box>
      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ width: '48px', fontSize: '12px', textAlign: 'center' }}>Count</Box>
      <Box sx={{ width: '48px', fontSize: '12px', textAlign: 'center' }}>Show Only</Box>
      <Box sx={{ width: '48px', fontSize: '12px', textAlign: 'center' }}>
        {ignorable && 'Accept & Ignore'}
      </Box>
    </Box>

    {orderedIssuesWithCounts
      .filter(([, count]) => count !== 0)
      .map(([issue, count]) => (
        <Box key={issue} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box>{issueConstants.get(issue).summary}</Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box
            sx={(theme) => ({
              width: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: theme.typography.monoFamily,
            })}
          >
            {count}
          </Box>
          <Box
            sx={{
              width: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconButton size="small">
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
            <Box
              sx={{
                width: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
            {ignorable && <Switch size="small" />}
            </Box>
        </Box>
      ))}
  </Box>
)

export default IssueSummaryControls
