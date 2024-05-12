import { baseURL } from './config'
import { getJSON } from './fetchers'

const get = (folderId) => getJSON(`${baseURL}/folders/${folderId}`)

const getList = () => getJSON(`${baseURL}/folders`)

export default {
  get,
  getList,
}
