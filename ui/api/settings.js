import { baseURL } from './config'
import { getJSON, postJSONWithResponse } from './fetchers'

const save = (key, value, type) =>
  postJSONWithResponse(`${baseURL}/settings/create_one`, { key, value, setting_type: type })

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
