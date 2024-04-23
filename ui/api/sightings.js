import { baseURL } from './config'
import { getJSON } from './fetchers'
import { sightings } from '../constants/dummyData'

// const get = () => getJSON(`${baseURL}/sightings`)

// returns dummy data for now, use above method going forward
const get = () => Promise.resolve(sightings)

export default {
  get,
}
