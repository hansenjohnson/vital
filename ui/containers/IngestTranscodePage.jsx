import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'

import useJobStore from '../store/job'
import STATUSES from '../constants/statuses'
import { JOB_PHASES, JOB_MODES } from '../constants/routes'
import { ROOT_FOLDER } from '../constants/fileTypes'
import ingestAPI from '../api/ingest'
import { bytesToSize, twoPrecisionStrNum, secondsToDuration } from '../utilities/strings'
import { transformMediaMetadata, groupMediaMetadataBySubfolder } from '../utilities/transformers'
import { resolutionToTotalPixels } from '../utilities/numbers'

import BlankSlate from '../components/BlankSlate'
import MetadataDisplayTable from '../components/MetadataDisplayTable'
import IngestParseSidebar from './IngestParseSidebar'

const LinkageAnnotationPage = () => {
  const sourceFolder = useJobStore((state) => state.sourceFolder)

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
      const groupedData = groupMediaMetadataBySubfolder(sourceFolder, transformedData)
      setMediaMetadata(groupedData)
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
        <IngestParseSidebar
          status={parseStatus}
          data={mediaMetadata.flatMap((group) => group.metadata)}
        />
        <Box
          sx={{
            flexGrow: 1,
            height: '100%',
            overflow: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          {mediaMetadata.map((group) => (
            <Box
              key={group.subfolder}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              {group.subfolder !== ROOT_FOLDER && (
                <Box
                  sx={(theme) => ({
                    paddingLeft: 3,
                    paddingRight: 3,
                    paddingTop: 0.5,
                    borderRadius: `0 ${theme.spacing(1)} 0 0`,
                    backgroundColor: 'black',
                  })}
                >
                  <Box component="span" sx={{ color: 'text.disabled', marginRight: 1 }}>
                    Subfolder
                  </Box>
                  {group.subfolder}
                </Box>
              )}
              <MetadataDisplayTable columns={columns} data={group.metadata} />
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  return <BlankSlate message={`Unknown Phase: ${phase}`} />
}

export default LinkageAnnotationPage
