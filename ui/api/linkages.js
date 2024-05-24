import { baseURL } from './config'
import {postJSON, putJson} from './fetchers'

const create = (data) => postJSON(`${baseURL}/linkages`, data)
const update = (id, data) => putJson(`${baseURL}/linkages/${id}`, data)

export default {
  create,
}
