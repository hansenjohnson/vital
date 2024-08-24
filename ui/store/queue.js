import { create } from 'zustand'

// import { valueSetter } from './utils'
import ingestAPI from '../api/ingest'
import queueAPI from '../api/queue'
import STATUSES from '../constants/statuses'

const initialState = {
  incompleteJobs: [],
  completeJobs: [],
  nextPage: 2,
  isRunning: false,
  schedule: null,
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
    set({
      incompleteJobs: _incompleteJobs,
      completeJobs: _completeJobs,
      nextPage: initialState.nextPage,
    })
  },

  loadMoreCompletedJobs: async () => {
    const { nextPage, completeJobs } = get()
    const moreJobs = await collateJobsWithTasks(ingestAPI.getCompleteJobs(nextPage))
    const nextNextPage = moreJobs?.length === 0 ? nextPage : nextPage + 1
    set({ completeJobs: [...completeJobs, ...moreJobs], nextPage: nextNextPage })
  },

  updateActiveJob: async () => {
    const { incompleteJobs } = get()
    if (incompleteJobs.length === 0) return
    const activeJob = incompleteJobs[0]
    const [newStatus, newTasks] = await Promise.all([
      ingestAPI.jobStatus(activeJob.id),
      ingestAPI.taskStatusesForJob(activeJob.id),
    ])

    let updatedJobs = {}
    if (newStatus === STATUSES.COMPLETED) {
      // Here we watch for a new completion and move the job between lists, instead of reloading both lists from backend
      // We reduce the completeJobs set so that if it's at a multiple of 10, it will remain so, which is related to the Load More logic
      const updatedJobData = await ingestAPI.getJob(activeJob.id)
      const updatedJob = { ...activeJob, ...updatedJobData, tasks: newTasks }
      const { completeJobs } = get()
      const existingCompleteJobs =
        completeJobs.length % 10 === 0
          ? completeJobs.slice(0, completeJobs.length - 1)
          : completeJobs
      updatedJobs = {
        incompleteJobs: incompleteJobs.slice(1),
        completeJobs: [updatedJob, ...existingCompleteJobs],
      }
    } else {
      const updatedJob = { ...activeJob, status: newStatus, tasks: newTasks }
      updatedJobs = { incompleteJobs: [updatedJob, ...incompleteJobs.slice(1)] }
    }

    set(updatedJobs)
  },

  startRunningChecker: () => {
    const LOOP_PERIOD_MS = 1000
    const runningChecker = async () => {
      const { isRunning: prevIsRunning } = get()
      const newIsRunning = await queueAPI.isRunning()
      set({ isRunning: newIsRunning })

      if (newIsRunning === true || prevIsRunning === true) {
        // If we are running, fetch updated info about the running job on the same interval
        // We check the prev value as well in case we just stopped, we want one more data update
        await get().updateActiveJob()
      }

      return [prevIsRunning, newIsRunning]
    }
    const checkerLoop = async () => {
      const [prevIsRunning, newIsRunning] = await runningChecker()
      if (prevIsRunning === true && newIsRunning === false) {
        // Break the loop if we move from Running to Not Running
        return
      }
      setTimeout(checkerLoop, LOOP_PERIOD_MS)
    }
    checkerLoop()
  },

  fetchSchedule: async () => {
    const schedule = await queueAPI.getSchedule()
    set({ schedule })
  },
}))

const collateJobsWithTasks = async (jobsPromise) => {
  const jobs = await jobsPromise
  const jobTasksPromises = jobs.map((job) => ingestAPI.taskStatusesForJob(job.id))
  const jobTasks = await Promise.all(jobTasksPromises)
  jobTasks.forEach((tasks, index) => {
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
