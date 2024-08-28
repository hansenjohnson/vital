const ROUTES = {
  TOOLS: 'tools',
  LINK_AND_ANNOTATE: 'link-and-annotate',
  INGEST: 'ingest',
}

const TITLES = {
  [ROUTES.TOOLS]: 'Video and Image Tool for tracking Animal Lives',
  [ROUTES.LINK_AND_ANNOTATE]: 'VITAL - Link and Annotate Videos',
  [ROUTES.INGEST]: 'VITAL - Ingest and Transcode new media',
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
  // `inputs` isn't really used for rendering or UI state, but more to indicate that the job
  // is not "in progress" yet, and so we shouldn't recover it beyond an app crash / app quit
  INPUTS: 'inputs',
  PARSE: 'parse',
  CHOOSE_OPTIONS: 'choose-options',
  EXECUTE: 'execute',
}

const JOB_MODES = {
  UNSET: 'unset',
  BY_IMAGE: 'image',
  BY_VIDEO: 'video',
}

export { TITLES, VIEW_MODES, LINKAGE_MODES, JOB_MODES, JOB_PHASES }
export default ROUTES
