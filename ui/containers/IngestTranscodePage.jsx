import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'

import useJobStore from '../store/job'
import STATUSES from '../constants/statuses'
import { JOB_PHASES, JOB_MODES } from '../constants/routes'
import ingestAPI from '../api/ingest'
import { bytesToSize } from '../utilities/strings'
import IngestParseSidebar from './IngestParseSidebar'
import BlankSlate from '../components/BlankSlate'
import MetadataDisplayTable from '../components/MetadataDisplayTable'

const LinkageAnnotationPage = () => {
  const phase = useJobStore((state) => state.phase)
  const jobMode = useJobStore((state) => state.jobMode)

  /* Poll for Parse Data, handle statuses */
  const parseId = useJobStore((state) => state.parseId)
  const [parseStatus, setParseStatus] = useState(STATUSES.LOADING)
  const [mediaMetadata, setMediaMetadata] = useState([])
  useEffect(() => {
    if (phase !== JOB_PHASES.PARSE) return

    setParseStatus(STATUSES.LOADING)
    setMediaMetadata([])
    let intervalId

    const checkForMetadata = async () => {
      const { status, data } = await ingestAPI.getParsedMetadata(parseId)
      if (status === STATUSES.PENDING) return
      setParseStatus(status)
      setMediaMetadata(data)
      clearInterval(intervalId)
    }

    intervalId = setInterval(checkForMetadata, 1000)
    return () => clearInterval(intervalId)
  }, [phase, parseId])

  /* Phase Handling Returns */
  if (phase === JOB_PHASES.PARSE) {
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        <IngestParseSidebar status={parseStatus} data={mediaMetadata} />
        <MetadataDisplayTable
          columns={[
            { key: 'name', label: 'File Name' },
            { key: 'resolution', label: 'Resolution' },
            ...(jobMode === JOB_MODES.BY_VIDEO ? [{ key: 'frameRate', label: 'FPS' }] : []),
            { key: 'size', label: 'File Size', transformer: bytesToSize },
          ]}
          data={mediaMetadata}
        />
      </Box>
    )
  }

  return <BlankSlate message={`Unknown Phase: ${phase}`} />
}

export default LinkageAnnotationPage
