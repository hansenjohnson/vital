import WarningRoundedIcon from '@mui/icons-material/WarningRounded'
import ReportIcon from '@mui/icons-material/Report'
import CheckIcon from '@mui/icons-material/Check'

const StatusIcon = ({ status }) => {
  if (status === 'error') {
    return <ReportIcon color="error" fontSize="small" />
  }
  if (status === 'warning') {
    return <WarningRoundedIcon color="warning" fontSize="small" />
  }
  // Represents status === 'success'
  return <CheckIcon color="success" fontSize="small" />
}

export default StatusIcon
