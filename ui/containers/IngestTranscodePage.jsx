import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'

import useJobStore from '../store/job'
import STATUSES from '../constants/statuses'
import { JOB_PHASES, JOB_MODES } from '../constants/routes'
import ingestAPI from '../api/ingest'
import { bytesToSize, twoPrecisionStrNum, secondsToDuration } from '../utilities/strings'
import { transformMediaMetadata } from '../utilities/transformers'
import { resolutionToTotalPixels } from '../utilities/numbers'

import BlankSlate from '../components/BlankSlate'
import MetadataDisplayTable from '../components/MetadataDisplayTable'
import IngestParseSidebar from './IngestParseSidebar'

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
      setParseStatus(STATUSES.COMPLETED)
    }

    intervalId = setInterval(checkForMetadata, 1000)
    return () => clearInterval(intervalId)
  }, [phase, jobId])

  /* Phase Handling Returns */
  if (phase === JOB_PHASES.PARSE) {
    let columns = [
      { key: 'fileName', label: 'File Name', maxWidth: 200 },
      {
        key: 'resolution',
        label: 'Resolution',
        align: 'right',
        comparatorTransformer: resolutionToTotalPixels,
      },
    ]
    if (jobMode === JOB_MODES.BY_VIDEO) {
      columns.push(
        ...[
          {
            key: 'frameRate',
            label: 'FPS',
            align: 'right',
            transformer: twoPrecisionStrNum,
          },
          {
            key: 'duration',
            label: 'Duration',
            align: 'right',
            transformer: secondsToDuration,
            comparatorTransformer: parseFloat,
          },
        ]
      )
    }
    columns.push(
      ...[
        {
          key: 'fileSize',
          label: 'File Size',
          align: 'right',
          transformer: bytesToSize,
        },
      ]
    )
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        <IngestParseSidebar status={parseStatus} data={mediaMetadata} />
        <MetadataDisplayTable columns={columns} data={mediaMetadata} />
      </Box>
    )
  }

  return <BlankSlate message={`Unknown Phase: ${phase}`} />
}

export default LinkageAnnotationPage
