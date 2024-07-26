// import { baseURL } from './config'
// import { getJSON } from './fetchers'

// const countFiles = (sourceFolder) =>
//   getJSON(`${baseURL}/ingest/count_files/${encodeURIComponent(sourceFolder)}`)

const countFiles = () =>
  new Promise((resolve) => setTimeout(() => resolve({ images: 765, videos: 28 }), 300))

const parse = () => new Promise((resolve) => setTimeout(resolve, 500))
const getCompressionOptions = () => new Promise((resolve) => setTimeout(resolve, 500))
const execute = () => new Promise((resolve) => setTimeout(resolve, 500))

export default {
  countFiles,
  parse,
  getCompressionOptions,
  execute,
}
