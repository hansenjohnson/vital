import { baseURL } from './config'
import { getJSON, postJSON } from './fetchers'

const save = (settings) => postJSON(`${baseURL}/settings`, settings)

const checkForOpenFiles = async () => {
  const response = await fetch(`${baseURL}/settings/open_files`)
  if (response.status === 409) {
    return true
  }
  return false
}

const get = (key) => getJSON(`${baseURL}/settings/${key}`)

const getList = (listOfKeys) => Promise.all(listOfKeys.map((key) => get(key)))

export default {
  save,
  checkForOpenFiles,
  get,
  getList,
}
