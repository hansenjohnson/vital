import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import InputLabel from '@mui/material/InputLabel'

const StyledSelect = ({ label, value, handleChange, options }) => (
  <FormControl sx={{ width: '100%' }} size="small">
    <InputLabel
      id={`select-label-${label}`}
      sx={{ fontSize: '18px', color: 'inherit', '&.Mui-focused': { color: 'inherit' } }}
    >
      {label}
    </InputLabel>
    <Select
      labelId={`select-label-${label}`}
      id={`select-${label}`}
      value={value}
      label={label}
      onChange={handleChange}
      sx={(theme) => ({
        color: 'inherit',
        fontFamily: theme.typography.monoFamily,
        fontWeight: 500,
        '&:hover': {
          backgroundColor: 'primary.light',
        },
        '&.Mui-focused': {
          backgroundColor: 'primary.light',
        },
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: 'inherit',
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: 'inherit',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: 'inherit',
        },
        '& .MuiSvgIcon-root': {
          color: 'inherit',
        },
      })}
      MenuProps={{
        MenuListProps: {
          dense: true,
        },
        TransitionProps: {
          onExited: () => document.activeElement.blur(),
        },
      }}
    >
      {options.map((option) => (
        <MenuItem
          key={`${option}`}
          value={`${option}`}
          sx={(theme) => ({
            fontFamily: theme.typography.monoFamily,
          })}
        >
          {`${option}`}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
)

export default StyledSelect
