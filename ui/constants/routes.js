const ROUTES = {
  TOOLS: 'tools',
  LINK_AND_ANNOTATE: 'link-and-annotate',
}

const TITLES = {
  [ROUTES.TOOLS]: 'Video and Image Tool for tracking Animal Lives',
  [ROUTES.LINK_AND_ANNOTATE]: 'VITAL - Link and Annotate Videos',
}

const VIEW_MODES = {
  BY_SIGHTING: 'by-sighting',
  BY_VIDEO: 'by-video',
}

const LINKAGE_MODES = {
  BLANK: 'blank',
  CREATE: 'create',
  EDIT: 'edit',
}

const JOB_PHASES = {
  INPUTS: 'inputs',
  PARSING: 'parsing',
  OPTIONS: 'options',
  EXECUTION: 'execution',
}

const JOB_MODES = {
  UNSET: 'unset',
  BY_IMAGE: 'image',
  BY_VIDEO: 'video',
}

export { TITLES, VIEW_MODES, LINKAGE_MODES, JOB_MODES, JOB_PHASES }
export default ROUTES
