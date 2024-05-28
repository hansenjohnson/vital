import Box from '@mui/material/Box'
import ToolTip, { tooltipClasses } from '@mui/material/ToolTip'
import { styled } from '@mui/material/styles'

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <ToolTip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
})

const LinkageGroupHeader = ({ name }) => (
  <NoMaxWidthTooltip
    title={name}
    placement="right"
    sx={{
      '&.MuiTooltip-tooltip': {
        maxWidth: 'none',
      },
    }}
  >
    <Box
      sx={(theme) => ({
        fontSize: '14px',
        fontFamily: theme.typography.monoFamily,

        width: '100%',
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: '2px',
        paddingBottom: '2px',

        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        wordBreak: 'keep-all',

        backgroundColor: `${theme.palette.background.headerPaper}44`,
      })}
    >
      {name}
    </Box>
  </NoMaxWidthTooltip>
)

export default LinkageGroupHeader
