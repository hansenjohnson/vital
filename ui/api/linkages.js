import { baseURL } from './config'
import { getJSON, postJSON, putJson, deleteThis } from './fetchers'

const create = (data) => postJSON(`${baseURL}/linkages`, data)
const update = (id, data) => putJson(`${baseURL}/linkages/${id}`, data)

const list = () => getJSON(`${baseURL}/linkages`)

const byFolder = (year, month, day, observer) =>
  getJSON(
    `${baseURL}/linkages/folder?year=${year}&month=${month}&day=${day}&observer_code=${observer}`
  )

const deleteLinkage = (linkageId) => deleteThis(`${baseURL}/linkages/${linkageId}`)

export default {
  create,
  update,
  list,
  byFolder,
  deleteLinkage,
}
