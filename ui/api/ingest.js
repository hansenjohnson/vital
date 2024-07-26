import { baseURL } from './config'
import { getJSON } from './fetchers'

const countFiles = (sourceFolder) =>
  getJSON(`${baseURL}/ingest/count_files/${encodeURIComponent(sourceFolder)}`)

const parse = () => new Promise((resolve) => setTimeout(resolve, 500))
const getCompressionOptions = () => new Promise((resolve) => setTimeout(resolve, 500))
const execute = () => new Promise((resolve) => setTimeout(resolve, 500))

export default {
  countFiles,
  parse,
  getCompressionOptions,
  execute,
}
