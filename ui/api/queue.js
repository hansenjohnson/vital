import { baseURL } from './config'
import { getJSON, postJSON } from './fetchers'

const queueURL = `${baseURL}/queue`

const executeNow = async () => postJSON(`${queueURL}/now`)

const isRunning = async () => {
  const res = await getJSON(`${queueURL}/status`)
  return res.is_running
}

export default {
  executeNow,
  isRunning,
}
