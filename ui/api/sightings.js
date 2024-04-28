import { baseURL } from './config'
import { getJSON } from './fetchers'

const get = () => getJSON(`${baseURL}/sightings`)

export default {
  get,
}
