import { baseURL } from './config'
import { postJSON } from './fetchers'

const create = (data) => postJSON(`${baseURL}/associations`, data)

export default {
  create,
}
