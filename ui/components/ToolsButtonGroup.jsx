import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import NearMeTwoToneIcon from '@mui/icons-material/NearMeTwoTone'
import CallMadeIcon from '@mui/icons-material/CallMade'
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

import { DRAWING } from '../constants/tools'

const ToolsButtonGroup = ({ activeTool, setActiveTool, disabled }) => {
  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      value={activeTool}
      onChange={(event, newValue) => {
        if (newValue === null) return
        setActiveTool(newValue)
      }}
      disabled={disabled}
      sx={{ height: '48px' }}
    >
      <ToggleButton value={DRAWING.POINTER}>
        <NearMeTwoToneIcon sx={{ transform: 'rotate(-90deg)' }} />
      </ToggleButton>
      <ToggleButton value={DRAWING.ARROW}>
        <CallMadeIcon sx={{ color: activeTool === DRAWING.ARROW ? 'error.main' : 'inherit' }} />
      </ToggleButton>
      <ToggleButton value={DRAWING.ELLIPSE}>
        <RadioButtonUncheckedIcon
          sx={{ color: activeTool === DRAWING.ELLIPSE ? 'error.main' : 'inherit' }}
        />
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default ToolsButtonGroup
