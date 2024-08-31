import { baseURL } from './config'
import { getJSON } from './fetchers'

const getList = () => getJSON(`${baseURL}/observers`)

export default {
  getList,
}
