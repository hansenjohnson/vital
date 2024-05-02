import { baseURL } from './config'
import { getJSON } from './fetchers'

const get = () => getJSON(`${baseURL}/catalog-folders`)

export default {
  get,
}
