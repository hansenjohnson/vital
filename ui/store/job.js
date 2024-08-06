import { create } from 'zustand'

import { valueSetter } from './utils'
import { JOB_PHASES, JOB_MODES } from '../constants/routes'
import ingestAPI from '../api/ingest'
import { leafPath } from '../utilities/paths'

const initialState = {
  phase: JOB_PHASES.INPUTS,
  sourceFolder: '',
  sourceFolderValid: true,
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
  jobId: null,
}

const validateSourceFolder = (folderPath) => {
  const folderName = leafPath(folderPath)
  // Check for YYYY-MM-DD-ObserverCode
  return folderName.match(/^\d{4}-\d{2}-\d{2}-[a-z].*$/i)
}

const useJobStore = create((set, get) => ({
  ...initialState,
  reset: () => set(initialState),

  setPhase: async (nextPhase) => {
    set({ phase: nextPhase })
    if (nextPhase === JOB_PHASES.PARSE) {
      get().triggerParse()
    } else if (nextPhase === JOB_PHASES.CHOOSE_OPTIONS) {
      ingestAPI.getCompressionOptions({})
    } else if (nextPhase === JOB_PHASES.EXECUTE) {
      ingestAPI.execute({})
    }
  },

  triggerParse: async () => {
    const { sourceFolder, jobMode } = get()
    const jobId = await ingestAPI.parse(jobMode, sourceFolder)
    set({ jobId })
  },

  setSourceFolder: (sourceFolder) => {
    const isValid = sourceFolder !== '' && validateSourceFolder(sourceFolder)
    set({ sourceFolder, sourceFolderValid: isValid })
  },

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
  const { sourceFolder, sourceFolderValid, jobMode, localOutputFolder } = state
  if (!sourceFolder) return false
  if (!sourceFolderValid) return false
  if (jobMode === JOB_MODES.UNSET) return false
  if (jobMode === JOB_MODES.BY_IMAGE && !localOutputFolder) return false
  return true
}

export { canParse }
export default useJobStore
