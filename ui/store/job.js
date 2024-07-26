import { create } from 'zustand'

import { valueSetter } from './utils'
import { JOB_PHASES, JOB_MODES } from '../constants/routes'
import ingestAPI from '../api/ingest'

const initialState = {
  phase: JOB_PHASES.INPUTS,
  sourceFolder: '',
  numFiles: { images: null, videos: null },
  jobMode: JOB_MODES.UNSET,
  localOutputFolder: '',
  batchRenameRules: {
    trimStart: 0,
    trimEnd: 0,
    prefix: '',
    suffix: '',
    insertAt: -1,
    insertText: '',
    findString: '',
    replaceString: '',
  },
  compressionBuckets: {
    small: {},
    medium: {},
    large: {},
  },
  steps: [],
}

const useJobStore = create((set, get) => ({
  ...initialState,
  reset: () => set(initialState),

  setPhase: (nextPhase) => {
    if (nextPhase === JOB_PHASES.PARSE) {
      ingestAPI.parse({})
    } else if (nextPhase === JOB_PHASES.CHOOSE_OPTIONS) {
      ingestAPI.getCompressionOptions({})
    } else if (nextPhase === JOB_PHASES.EXECUTE) {
      ingestAPI.execute({})
    }
    set({ phase: nextPhase })
  },

  setSourceFolder: valueSetter(set, 'sourceFolder'),

  countFiles: async () => {
    const { sourceFolder } = get()
    const numFiles = await ingestAPI.countFiles(sourceFolder)
    set({ numFiles })
  },

  setJobMode: valueSetter(set, 'jobMode'),

  setLocalOutputFolder: valueSetter(set, 'localOutputFolder'),

  setBatchRenameRules: valueSetter(set, 'batchRenameRules'),

  setCompressionBuckets: valueSetter(set, 'compressionBuckets'),

  /** Step Schema:
   * - fileName: str
   * - newName: str | optional
   * - transcodeSettings: {}
   */
  setSteps: valueSetter(set, 'steps'),
}))

const canParse = (state) => {
  const { sourceFolder, jobMode, localOutputFolder } = state
  if (!sourceFolder) return false
  if (jobMode === JOB_MODES.UNSET) return false
  if (jobMode === JOB_MODES.BY_IMAGE && !localOutputFolder) return false
  return true
}

export { canParse }
export default useJobStore
