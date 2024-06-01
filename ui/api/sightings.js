import { baseURL } from './config'
import { getJSON } from './fetchers'

const get = (year, month, day, observer) =>
  getJSON(
    `${baseURL}/sightings/date?year=${year}&month=${month}&day=${day}&observer_code=${observer}`
  )

const getList = () => getJSON(`${baseURL}/sightings`)

export default {
  get,
  getList,
}
