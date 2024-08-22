import { baseURL } from './config'
import { postJSON } from './fetchers'

const queueURL = `${baseURL}/queue`

const executeNow = async () => postJSON(`${queueURL}/now`)

export default {
  executeNow,
}
