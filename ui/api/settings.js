import { baseURL } from './config'
import { getJSON, postJSON } from './fetchers'

const save = (settings) => postJSON(`${baseURL}/settings`, settings)

const get = (key) => getJSON(`${baseURL}/settings/${key}`)

const getList = (listOfKeys) => Promise.all(listOfKeys.map((key) => get(key)))

export default {
  save,
  get,
  getList,
}
