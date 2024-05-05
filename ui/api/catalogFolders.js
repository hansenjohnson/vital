import { baseURL } from './config'
import { getJSON } from './fetchers'

const get = () => getJSON(`${baseURL}/folders`)

export default {
  get,
}
