import { baseURL } from './config'
import { getJSON } from './fetchers'

// const get = () => getJSON(`${baseURL}/catalog-folders`)

// Temp Mock Data
const get = () =>
  Promise.resolve([
    {
      CatalogFolderId: 1,
      FolderYear: 2021,
      FolderMonth: 7,
      FolderDay: 18,
      ObserverCode: 'CWR',
      CreatedBy: 'phamilton',
      CreatedDate: '11-Mar-24',
    },
    {
      CatalogFolderId: 2,
      FolderYear: 2021,
      FolderMonth: 7,
      FolderDay: 19,
      ObserverCode: 'GLL',
      CreatedBy: 'phamilton',
      CreatedDate: '11-Mar-24',
    },
    {
      CatalogFolderId: 3,
      FolderYear: 2021,
      FolderMonth: 10,
      FolderDay: 13,
      ObserverCode: 'TC/DASH8',
      CreatedBy: 'phamilton',
      CreatedDate: '11-Mar-24',
    },
  ])

export default {
  get,
}
