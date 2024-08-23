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
    const jobs = await Promise.all([
      collateJobsWithTasks(ingestAPI.getIncompleteJobs()),
      collateJobsWithTasks(ingestAPI.getCompleteJobs(1)),
    ])
    const [_incompleteJobs, _completeJobs] = jobs
    set({ incompleteJobs: _incompleteJobs, completeJobs: _completeJobs })
  },

  loadMoreCompletedJobs: async () => {
    const { nextPage, completeJobs } = get()
    const moreJobs = await collateJobsWithTasks(ingestAPI.getCompleteJobs(nextPage))
    set({ completeJobs: [...completeJobs, ...moreJobs], nextPage: nextPage + 1 })
  },
}))

const collateJobsWithTasks = async (jobsPromise) => {
  const jobs = await jobsPromise
  const jobTasksPromises = jobs.map((job) => ingestAPI.taskStatusesForJob(job.id))
  const jobTasks = await Promise.all(jobTasksPromises)
  jobTasks.forEach((tasksObj, index) => {
    const tasks = Object.entries(tasksObj).map(([taskId, task]) => ({ ...task, id: taskId }))
    jobs[index].tasks = tasks
    jobs[index].size = tasks.reduce((acc, task) => acc + task.size, 0)
  })
  return jobs
}

const canStart = (state) => {
  const { incompleteJobs } = state
  if (incompleteJobs.length === 0) return false
  return true
}

export { canStart }
export default useQueueStore
