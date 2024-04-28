import { baseURL } from './config'
import { getJSON } from './fetchers'

const getList = async () => {
  const data = await getJSON(`${baseURL}/videos/file_names`)
  return data ? data['videos'] : []
}

export default {
  getList,
}
