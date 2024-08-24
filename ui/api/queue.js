import { baseURL } from './config'
import { deleteThis, getJSON, postJSON } from './fetchers'

const queueURL = `${baseURL}/queue`

const executeNow = async () => postJSON(`${queueURL}/now`)

const isRunning = async () => {
  const res = await getJSON(`${queueURL}/status`)
  return res.is_running
}

const getSchedule = async () => {
  const res = await getJSON(`${queueURL}/schedule`)
  return res.scheduled_job
}
const setSchedule = async (timestamp) => postJSON(`${queueURL}/schedule`, { run_date: timestamp })
const deleteSchedule = async () => deleteThis(`${queueURL}/schedule`)

export default {
  executeNow,
  isRunning,
  getSchedule,
  setSchedule,
  deleteSchedule,
}
