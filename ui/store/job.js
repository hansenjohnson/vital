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
  metadataFilter: null,
  issueIgnoreList: [],
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
  jobId: null,
  settingsList: [
    {
      file_path:
        'C:\\Users\\imben\\Documents\\Videos_Folders\\2021-07-18-Matt\\026\\2021-07-19_026_XT2-RGB_0006.mp4',
      input_height: 2160,
      output_framerate: 30,
    },
  ],
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
      get().triggerExecute()
    }
  },

  triggerParse: async () => {
    const { sourceFolder, jobMode } = get()
    const jobId = await ingestAPI.parse(jobMode, sourceFolder)
    set({ jobId })
  },

  triggerExecute: async () => {
    const { jobMode, sourceFolder, settingsList } = get()
    let jobId = null
    if (jobMode === JOB_MODES.BY_IMAGE) {
      // TODO: implement this later
      return
    } else if (jobMode === JOB_MODES.BY_VIDEO) {
      jobId = await ingestAPI.transcode(sourceFolder, settingsList)
    }
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

  setMetadataFilter: valueSetter(set, 'metadataFilter'),
  addToIgnoreList: (newIssue) => {
    const { issueIgnoreList } = get()
    set({ issueIgnoreList: [...issueIgnoreList, newIssue] })
  },
  removeFromIgnoreList: (issueToRemove) => {
    const { issueIgnoreList } = get()
    set({ issueIgnoreList: issueIgnoreList.filter((issue) => issue !== issueToRemove) })
  },

  setBatchRenameRules: valueSetter(set, 'batchRenameRules'),

  setCompressionBuckets: valueSetter(set, 'compressionBuckets'),

  // This list should be a list of object
  // The schema can be found in the TranscodeSettings class within the server
  setSettingsList: valueSetter(set, 'settingsList'),
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
