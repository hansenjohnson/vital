import { baseURL } from './config'
import { getJSON, postJSON } from './fetchers'

const save = async (settings) => {
  return postJSON(`${baseURL}/settings`, settings)
}

const get = async (key) => {
  return getJSON(`${baseURL}/settings/${key}`)
}

const getList = async (listOfKeys) => {
  return Promise.all(listOfKeys.map((key) => get(key)))
}

export default {
  save,
  getList,
}
