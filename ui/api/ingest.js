import { baseURL } from './config'
import { getJSON, postJSONWithResponse, deleteThis } from './fetchers'

const ingestURL = `${baseURL}/ingest`

// Job Information - One
const jobStatus = (jobId) => getJSON(`${ingestURL}/job_status/${jobId}`)
const taskStatusesForJob = (jobId) => getJSON(`${ingestURL}/job/${jobId}/tasks`)
const deleteJob = (jobId) => deleteThis(`${ingestURL}/job/${jobId}`)

// Job Information - Many
const getIncompleteJobs = () => getJSON(`${ingestURL}/job?completed=false`)
const getCompleteJobs = (page) => getJSON(`${ingestURL}/job?page=${page}&page_size=10`)

// Metadata Methods
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

// Job Execution Methods
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
  deleteJob,
  getIncompleteJobs,
  getCompleteJobs,
  countFiles,
  parse,
  getParsedMetadata,
  getCompressionOptions,
  transcode,
}
