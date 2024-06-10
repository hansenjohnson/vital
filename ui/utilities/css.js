export const dottedLine = (theme) =>
  [
    `linear-gradient(${[
      '90deg',
      `${theme.palette.tertiary.main} 0px`,
      `${theme.palette.tertiary.main} 6px`,
      'transparent 6px',
    ].join(', ')})`,
    `repeating-linear-gradient(${[
      'to right',
      `${theme.palette.tertiary.main} 6px`,
      `${theme.palette.tertiary.main} 12px`,
      'transparent 12px',
      'transparent 18px',
    ].join(', ')})`,
    `linear-gradient(${[
      '-90deg',
      `${theme.palette.tertiary.main} 0px`,
      `${theme.palette.tertiary.main} 6px`,
      'transparent 6px',
    ].join(', ')})`,
  ].join(', ')
