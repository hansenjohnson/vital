import { styled } from '@mui/material/styles'
import ToolTip, { tooltipClasses } from '@mui/material/ToolTip'

const NoMaxWidthTooltip = styled(({ className, ...props }) => (
  <ToolTip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 'none',
  },
})

const darkBackground = {
  sx: { backgroundColor: 'rgba(25, 25, 25, 0.85)' },
}

const darkerBackground = {
  sx: { backgroundColor: 'rgba(0, 0, 0, 0.85)' },
}

const adjustX = (by) => ({
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, by],
      },
    },
  ],
})

const StyledTooltip = ({ title, darker = false, xAdjustment = 0, children, ...rest }) => (
  <NoMaxWidthTooltip
    title={title}
    placement="right"
    componentsProps={{
      tooltip: darker ? darkerBackground : darkBackground,
      popper: adjustX(parseInt(xAdjustment, 10)),
    }}
    {...rest}
  >
    {children}
  </NoMaxWidthTooltip>
)

export default StyledTooltip
