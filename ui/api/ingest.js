import { baseURL } from './config'
import { getJSON, postJSONWithResponse, deleteThis } from './fetchers'

const ingestURL = `${baseURL}/ingest`

// Job Information - One
const getJob = (jobId) => getJSON(`${ingestURL}/job/${jobId}`)
const jobStatus = (jobId) => getJSON(`${ingestURL}/job_status/${jobId}`)
const deleteJob = (jobId) => deleteThis(`${ingestURL}/job/${jobId}`)
const taskStatusesForJob = async (jobId) => {
  const tasksObj = await getJSON(`${ingestURL}/job/${jobId}/tasks`)
  const tasksList = Object.entries(tasksObj).map(([taskId, task]) => ({ ...task, id: taskId }))
  return tasksList
}

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

const getParsedMetadata = (jobId) => getJSON(`${ingestURL}/job_data/${jobId}`)

const getCompressionOptions = () => new Promise((resolve) => setTimeout(resolve, 500))

// Job Execution Methods
const transcode = async (sourceFolder, settingsList, media_type) => {
  const { data } = await postJSONWithResponse(`${ingestURL}/transcode`, {
    source_dir: sourceFolder,
    transcode_list: settingsList,
    media_type
  })
  return data?.job_id
}

export default {
  getJob,
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
