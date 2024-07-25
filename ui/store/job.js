import { create } from 'zustand'

import { valueSetter } from './utils'
import { JOB_PHASES, JOB_MODES } from '../constants/routes'

const useJobStore = create((set) => ({
  phase: JOB_PHASES.INPUTS,
  setPhase: valueSetter(set, 'phase'),

  sourceFolder: '',
  setSourceFolder: valueSetter(set, 'sourceFolder'),

  jobMode: JOB_MODES.UNSET,
  setJobMode: valueSetter(set, 'jobMode'),

  localOutputFolder: '',
  setLocalOutputFolder: valueSetter(set, 'localOutputFolder'),

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
  setBatchRenameRules: valueSetter(set, 'batchRenameRules'),

  compressionBuckets: {
    small: {},
    medium: {},
    large: {},
  },
  setCompressionBuckets: valueSetter(set, 'compressionBuckets'),

  /** Step Schema:
   * - fileName: str
   * - newName: str | optional
   * - transcodeSettings: {}
   */
  steps: [],
  setSteps: valueSetter(set, 'steps'),
}))

export default useJobStore
