import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import ReportIcon from '@mui/icons-material/Report'
import CheckIcon from '@mui/icons-material/Check'

import STATUSES from '../constants/statuses'

const StatusIcon = ({ status }) => {
  if (status === STATUSES.ERROR) {
    return <ReportIcon color="error" fontSize="small" />
  }
  if (status === STATUSES.WARNING) {
    return <WarningRoundedIcon color="warning" fontSize="small" />
  }
  // Represents status === STATUSES.SUCCESS
  return <CheckIcon color="success" fontSize="small" />
}

export default StatusIcon
