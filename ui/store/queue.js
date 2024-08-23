import { create } from 'zustand'

// import { valueSetter } from './utils'
import ingestAPI from '../api/ingest'

const initialState = {
  incompleteJobs: [],
  completeJobs: [],
  nextPage: 2,
}

const useQueueStore = create((set, get) => ({
  ...initialState,
  reset: () => set(initialState),

  fetchJobsData: async () => {
    const _incompleteJobs = await ingestAPI.getIncompleteJobs()
    const _completeJobs = await ingestAPI.getCompleteJobs(1)
    set({ incompleteJobs: _incompleteJobs, completeJobs: _completeJobs })
  },

  loadMoreCompletedJobs: async () => {
    const { nextPage, completeJobs } = get()
    const moreJobs = await ingestAPI.getCompleteJobs(nextPage)
    set({ completeJobs: [...completeJobs, ...moreJobs], nextPage: nextPage + 1 })
  },
}))

const canStart = (state) => {
  const { incompleteJobs } = state
  if (incompleteJobs.length === 0) return false
  return true
}

export { canStart }
export default useQueueStore
