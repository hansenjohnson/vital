import { baseURL } from './config'
import { postJSON } from './fetchers'

const create = (data) => postJSON(`${baseURL}/linkages`, data)

export default {
  create,
}
