import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'

import useJobStore from '../store/job'
import STATUSES from '../constants/statuses'
import { JOB_PHASES, JOB_MODES } from '../constants/routes'
import ingestAPI from '../api/ingest'
import { bytesToSize, twoPrecisionStrNum, secondsToDuration } from '../utilities/strings'
import IngestParseSidebar from './IngestParseSidebar'
import BlankSlate from '../components/BlankSlate'
import MetadataDisplayTable from '../components/MetadataDisplayTable'
import { transformMediaMetadata } from '../utilities/transformers'

const LinkageAnnotationPage = () => {
  const phase = useJobStore((state) => state.phase)
  const jobMode = useJobStore((state) => state.jobMode)

  /* Poll for Parse Data, handle statuses */
  const jobId = useJobStore((state) => state.jobId)
  const [parseStatus, setParseStatus] = useState(STATUSES.LOADING)
  const [mediaMetadata, setMediaMetadata] = useState([])
  useEffect(() => {
    if (phase !== JOB_PHASES.PARSE) return

    setParseStatus(STATUSES.LOADING)
    setMediaMetadata([])
    let intervalId

    const checkForMetadata = async () => {
      const status = await ingestAPI.jobStatus(jobId)
      const statusLowerCase = status.toLowerCase()
      setParseStatus(statusLowerCase)
      if (statusLowerCase === STATUSES.PENDING) return
      if (statusLowerCase === STATUSES.ERROR) {
        // TODO: handle error case
      }
      if (statusLowerCase !== STATUSES.COMPLETED) {
        console.log('Unknown status:', status)
        return
      }
      clearInterval(intervalId)

      const data = await ingestAPI.getParsedMetadata(jobId)
      const transformedData = data.map(transformMediaMetadata)
      setMediaMetadata(transformedData)
    }

    intervalId = setInterval(checkForMetadata, 1000)
    return () => clearInterval(intervalId)
  }, [phase, jobId])

  /* Phase Handling Returns */
  if (phase === JOB_PHASES.PARSE) {
    const videoColumns = [
      { key: 'frameRate', label: 'FPS', transformer: twoPrecisionStrNum },
      { key: 'duration', label: 'Duration', transformer: secondsToDuration },
    ]
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        <IngestParseSidebar status={parseStatus} data={mediaMetadata} />
        <MetadataDisplayTable
          columns={[
            { key: 'fileName', label: 'File Name' },
            { key: 'resolution', label: 'Resolution' },
            ...(jobMode === JOB_MODES.BY_VIDEO ? videoColumns : []),
            { key: 'fileSize', label: 'File Size', transformer: bytesToSize },
          ]}
          data={mediaMetadata}
        />
      </Box>
    )
  }

  return <BlankSlate message={`Unknown Phase: ${phase}`} />
}

export default LinkageAnnotationPage
