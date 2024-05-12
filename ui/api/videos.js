import { baseURL } from './config'
import { getJSON } from './fetchers'

const getList = async (catalogFolderId) => {
  const data = await getJSON(`${baseURL}/videos/folders/${catalogFolderId}`)

  return data ? data['videos'] : []
}

export default {
  getList,
}
