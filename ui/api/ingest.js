import { baseURL } from './config'
import { getJSON } from './fetchers'

const ingestURL = `${baseURL}/ingest`

const countFiles = (sourceFolder) =>
  getJSON(`${ingestURL}/count_files/${encodeURIComponent(sourceFolder)}`)

// const parse = (mode, sourceFolder) => getJSON(`${ingestURL}/parse/${mode}/${encodeURIComponent(sourceFolder)}`)
const parse = (mode, sourceFolder) =>
  new Promise((resolve) =>
    setTimeout(() => {
      resolve({ parseId: '1234' })
    }, 500)
  )

// const getParsedMetadata = (parseId) => getJSON(`${ingestURL}/metadata/${parseId}`)
let count = 0
const getParsedMetadata = (parseId) =>
  new Promise((resolve) =>
    setTimeout(() => {
      if (count < 2) {
        count += 1
        resolve({ status: 'pending' })
        return
      }
      count = 0
      resolve({
        status: 'complete',
        data: [
          {
            name: 'really_long_file_name_1.mov',
            size: 15 * 1024 * 1024,
            resolution: '1920x1080',
            frameRate: '30',
            warnings: [],
            errors: [],
          },
          {
            name: 'really_long_file_name_2.mov',
            size: 12 * 1024 * 1024,
            resolution: '1920x1080',
            frameRate: '30',
            warnings: ['not in a folder'],
            errors: [],
          },
          {
            name: 'really_long_file_name_3.mov',
            size: 13 * 1024 * 1024,
            resolution: '1920x1080',
            frameRate: '30',
            warnings: [],
            errors: ['file name is longer than 20 chars'],
          },
          {
            name: 'really_long_file_name_4.mov',
            size: 19 * 1024 * 1024,
            resolution: '1920x1080',
            frameRate: '30',
            warnings: ['not in a folder', 'here is a long warning with lots of characters'],
            errors: ['file name is longer than 20 chars'],
          },
        ],
      })
    }, 500)
  )

const getCompressionOptions = () => new Promise((resolve) => setTimeout(resolve, 500))
const execute = () => new Promise((resolve) => setTimeout(resolve, 500))

export default {
  countFiles,
  parse,
  getParsedMetadata,
  getCompressionOptions,
  execute,
}
