import { baseURL } from './config'
import { postJSONWithResponse } from './fetchers'

// const listDirectory = (directoryPath) => {
//   return postJSONWithResponse(`${baseURL}/list-directory`, { dir: directoryPath })
// }

// returns dummy data for now, use above method going forward
const listDirectory = (directoryPath) => {
  return Promise.resolve([
    'C:\\Users\\imben\\Development\\video-catalog-suite\\test-files\\Test-Videos\\2021-07-19_026_XT2-RGB_0004',
    'C:\\Users\\imben\\Development\\video-catalog-suite\\test-files\\Test-Videos\\2021-07-19_026_XT2-RGB_0005',
    'C:\\Users\\imben\\Development\\video-catalog-suite\\test-files\\Test-Videos\\2021-07-19_026_XT2-RGB_0006',
    'C:\\Users\\imben\\Development\\video-catalog-suite\\test-files\\Test-Videos\\2021-07-19_026_XT2-RGB_0007',
    'C:\\Users\\imben\\Development\\video-catalog-suite\\test-files\\Test-Videos\\2021-07-19_026_XT2-RGB_0008',
  ])
}

export default {
  listDirectory,
}
