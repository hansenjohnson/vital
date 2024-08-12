import { baseURL } from './config'
import { getJSON, postJSONWithResponse } from './fetchers'

const ingestURL = `${baseURL}/ingest`

const jobStatus = (jobId) => getJSON(`${ingestURL}/job_status/${jobId}`)
const taskStatusesForJob = (jobId) => getJSON(`${ingestURL}/job/${jobId}/tasks`)

const countFiles = (sourceFolder) =>
  getJSON(`${ingestURL}/count_files/${encodeURIComponent(sourceFolder)}`)

const parse = async (mode, sourceFolder) => {
  const { data } = await postJSONWithResponse(`${ingestURL}/parse_${mode}s`, {
    source_dir: sourceFolder,
  })
  return data?.job_id
}

const getParsedMetadata = (jobId) => getJSON(`${ingestURL}/parse_videos/${jobId}`)

const getCompressionOptions = () => new Promise((resolve) => setTimeout(resolve, 500))

const transcode = async (sourceFolder, settingsList) => {
  const { data } = await postJSONWithResponse(`${ingestURL}/transcode`, {
    source_dir: sourceFolder,
    transcode_list: settingsList,
  })
  return data?.job_id
}

export default {
  jobStatus,
  taskStatusesForJob,
  countFiles,
  parse,
  getParsedMetadata,
  getCompressionOptions,
  transcode,
}
