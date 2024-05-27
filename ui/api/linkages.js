import { baseURL } from './config'
import { getJSON, postJSON } from './fetchers'

const create = (data) => postJSON(`${baseURL}/linkages`, data)
const update = (id, data) => putJson(`${baseURL}/linkages/${id}`, data)

const list = () => getJSON(`${baseURL}/linkages`)

const bySighting = (year, month = undefined, day = undefined, observerCode = undefined) => {
  let optionalQueryParams = ''
  if (month) optionalQueryParams += `&month=${month}`
  if (day) optionalQueryParams += `&day=${day}`
  if (observerCode) optionalQueryParams += `&observer_code=${observerCode}`

  return getJSON(`${baseURL}/linkages/sighting?year=${year}${optionalQueryParams}`)
}

export default {
  create,
  list,
  bySighting,
}
