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

let currDummyPath = 0
const getVideoURL = (filePath) => {
  const dummyPaths = [
    'https://ftp.itec.aau.at/datasets/DASHDataset2014/BigBuckBunny/4sec/BigBuckBunny_4s_simple_2014_05_09.mpd',
    'https://ftp.itec.aau.at/datasets/DASHDataset2014/TearsOfSteel/4sec/TearsOfSteel_4s_simple_2014_05_09.mpd',
    'https://ftp.itec.aau.at/datasets/DASHDataset2014/ElephantsDream/4sec/ElephantsDream_4s_simple_2014_05_09.mpd',
    'https://bitmovin-a.akamaihd.net/content/MI201109210084_1/mpds/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.mpd',
  ]
  const dummyPath = dummyPaths[currDummyPath]
  currDummyPath = (currDummyPath + 1) % dummyPaths.length
  return Promise.resolve(dummyPath)
}

export default {
  listDirectory,
  getVideoURL,
}
