import { createTheme } from '@mui/material/styles'

const defaultTheme = createTheme()

const theme = createTheme({
  palette: {
    mode: 'dark',

    primary: {
      dark: '#16A7B3',
      main: '#51CCD3',
      light: '#B2EAEB',
    },

    secondary: {
      dark: '#107BD5',
      main: '#00AFFF',
      light: '#B4E7FF',
    },

    // augmentColor is a step that Material-UI automatically does for the standard palette colors.
    tertiary: defaultTheme.palette.augmentColor({
      color: {
        dark: '#16B36F',
        main: '#6DCA9A',
        light: '#C1E7D2',
      },
      name: 'tertiary',
    }),
  },

  spacing: 12,
})

export default theme
