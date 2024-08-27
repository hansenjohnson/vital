import { create } from 'zustand'

import { valueSetter } from './utils'
import ROUTES, { JOB_PHASES, JOB_MODES } from '../constants/routes'
import ingestAPI from '../api/ingest'
import { leafPath } from '../utilities/paths'
import useQueueStore from './queue'
import useRootStore from './index'

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
    insertText: '',
    insertAt: 0,
    findString: '',
    replaceString: '',
    applied: true,
  },
  compressionBuckets: {
    small: {},
    medium: {},
    large: {},
  },
  jobId: null,
  settingsList: [],
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
    set({ phase: nextPhase, jobId: null })
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
    await ingestAPI.transcode(sourceFolder, settingsList, jobMode)

    // After submitting a new job to the queue, Navigate the user back home,
    // reload the queue data, and reset some of the stores like we do in the Navbar
    useQueueStore.getState().fetchJobsData()
    useRootStore.getState().setRoute(ROUTES.TOOLS)
    useRootStore.getState().resetStore()
    get().reset()
    useRootStore.getState().setJobQueueOpen(true)
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

  setOneBatchRenameRule: (key, value) => {
    const { batchRenameRules } = get()
    set({ batchRenameRules: { ...batchRenameRules, applied: false, [key]: value } })
  },
  applyBatchRenameRules: () => {
    const { batchRenameRules } = get()
    set({ batchRenameRules: { ...batchRenameRules, applied: true } })
  },
  invalidateBatchRenameRules: () => {
    const { batchRenameRules } = get()
    set({ batchRenameRules: { ...batchRenameRules, applied: false } })
  },
  processBatchRenameOnString: (string) => {
    const { batchRenameRules } = get()
    const { trimStart, trimEnd, prefix, suffix, insertText, insertAt, findString, replaceString } =
      batchRenameRules
    let newString = string
    if (trimStart > 0) {
      newString = newString.slice(trimStart)
    }
    if (trimEnd > 0) {
      newString = newString.slice(0, -trimEnd)
    }
    if (prefix) {
      newString = `${prefix}${newString}`
    }
    if (suffix) {
      newString = `${newString}${suffix}`
    }
    if (insertText) {
      newString = newString.slice(0, insertAt) + insertText + newString.slice(insertAt)
    }
    if (findString) {
      newString = newString.replaceAll(findString, replaceString)
    }
    return newString
  },

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
