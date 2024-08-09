import { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'

import useJobStore from '../store/job'
import STATUSES, { ERRORS, WARNINGS } from '../constants/statuses'
import { JOB_PHASES, JOB_MODES } from '../constants/routes'
import { ROOT_FOLDER } from '../constants/fileTypes'
import ingestAPI from '../api/ingest'
import { bytesToSize, twoPrecisionStrNum, secondsToDuration } from '../utilities/strings'
import {
  transformMediaMetadata,
  groupMediaMetadataBySubfolder,
  calculateStatus,
} from '../utilities/transformers'
import { resolutionToTotalPixels } from '../utilities/numbers'

import BlankSlate from '../components/BlankSlate'
import MetadataDisplayTable from '../components/MetadataDisplayTable'
import MetadataSubfolder from '../components/MetadataSubfolder'
import IngestParseSidebar from './IngestParseSidebar'

const LinkageAnnotationPage = () => {
  const sourceFolder = useJobStore((state) => state.sourceFolder)

  const phase = useJobStore((state) => state.phase)
  const jobMode = useJobStore((state) => state.jobMode)

  const metadataFilter = useJobStore((state) => state.metadataFilter)
  const issueIgnoreList = useJobStore((state) => state.issueIgnoreList)

  /* Poll for Parse Data, handle statuses */
  const jobId = useJobStore((state) => state.jobId)
  const [parseStatus, setParseStatus] = useState(STATUSES.LOADING)
  const [mediaGroups, setMediaGroups] = useState([])
  const [totalSize, setTotalSize] = useState(0)
  const [allWarnings, setAllWarnings] = useState(new Map())
  const [allErrors, setAllErrors] = useState(new Map())

  useEffect(() => {
    if (phase !== JOB_PHASES.PARSE) return

    setParseStatus(STATUSES.LOADING)
    setMediaGroups([])
    setTotalSize(0)
    setAllWarnings(new Map())
    setAllErrors(new Map())
    let intervalId

    const checkForMetadata = async () => {
      const status = await ingestAPI.jobStatus(jobId)
      const statusLowerCase = status.toLowerCase()
      if (statusLowerCase === STATUSES.PENDING) return
      if (statusLowerCase === STATUSES.ERROR) {
        // TODO: handle error case, currently the backend doesn't return this
        return
      }
      if (statusLowerCase !== STATUSES.COMPLETED) {
        console.log('Unknown status:', status)
        return
      }
      clearInterval(intervalId)

      const data = await ingestAPI.getParsedMetadata(jobId)
      const transformedData = data.map(transformMediaMetadata)
      const groupsAndAggregates = groupMediaMetadataBySubfolder(sourceFolder, transformedData)
      setMediaGroups(groupsAndAggregates.mediaGroups)
      setTotalSize(groupsAndAggregates.totalSize)
      setAllWarnings(groupsAndAggregates.allWarnings)
      setAllErrors(groupsAndAggregates.allErrors)
      setParseStatus(STATUSES.COMPLETED)
    }

    intervalId = setInterval(checkForMetadata, 1000)
    return () => clearInterval(intervalId)
  }, [phase, jobId])

  /* Trigger & Poll for Execute Data, handle statuses */
  const setSettingsList = useJobStore((state) => state.setSettingsList)
  const setPhase = useJobStore((state) => state.setPhase)
  const executeJob = () => {
    if (jobMode === JOB_MODES.BY_VIDEO) {
      const settingsList = mediaGroups.flatMap((group) =>
        group.mediaList.map((media) => ({
          file_path: media.filePath,
          input_height: media.height,
          output_framerate: Math.round(media.frameRate),
        }))
      )
      setSettingsList(settingsList)
    } else {
      // FUTURE: handle setting image conversion settings here
    }
    setPhase(JOB_PHASES.EXECUTE)
  }

  /* User controlled data processing */
  const mediaGroupsFiltered = useMemo(() => {
    if (!metadataFilter) return mediaGroups
    const objForFilter = ERRORS.get(metadataFilter) ?? WARNINGS.get(metadataFilter)
    if (objForFilter.groupLevel) {
      return mediaGroups.filter((group) => group.statusText === objForFilter.message)
    }
    return mediaGroups.map((group) => {
      const mediaList = group.mediaList.filter(
        (media) => media.warnings.includes(metadataFilter) || media.errors.includes(metadataFilter)
      )
      return { ...group, mediaList }
    })
  }, [JSON.stringify(mediaGroups), metadataFilter])

  const mediaGroupsFilteredAndIgnored = useMemo(() => {
    const groupLevelIgnores = issueIgnoreList.reduce((acc, issue) => {
      const objForFilter = ERRORS.get(issue) ?? WARNINGS.get(issue)
      if (!objForFilter.groupLevel) return acc
      acc.push(objForFilter.message)
      return acc
    }, [])
    return mediaGroupsFiltered.map((group) => {
      let newGroupStatus = group.status
      if (groupLevelIgnores.includes(group.statusText)) {
        newGroupStatus = STATUSES.SUCCESS
      }
      const mediaList = group.mediaList.map((media) => {
        const newWarnings = media.warnings.filter((w) => !issueIgnoreList.includes(w))
        const newMediaStatus = calculateStatus(media.errors, newWarnings)
        return {
          ...media,
          status: newMediaStatus,
          warnings: newWarnings,
        }
      })
      return { ...group, status: newGroupStatus, mediaList }
    })
  }, [JSON.stringify(mediaGroupsFiltered), issueIgnoreList])

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
          totalSize={totalSize}
          allWarnings={allWarnings}
          allErrors={allErrors}
          actionName="Execute Transcode"
          canTrigger={mediaGroupsFilteredAndIgnored.every((group) => {
            if (group.status === STATUSES.ERROR) return false
            return group.mediaList.every((media) => {
              if (media.status === STATUSES.ERROR) return false
              return true
            })
          })}
          onTriggerAction={executeJob}
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
          {mediaGroupsFilteredAndIgnored.map((group) => (
            <Box
              key={group.subfolder}
              sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
            >
              {group.subfolder !== ROOT_FOLDER && (
                <MetadataSubfolder status={group.status} statusText={group.statusText}>
                  {group.subfolder}
                </MetadataSubfolder>
              )}
              <MetadataDisplayTable columns={columns} data={group.mediaList} />
            </Box>
          ))}
        </Box>
      </Box>
    )
  }

  return <BlankSlate message={`Unknown Phase: ${phase}`} />
}

export default LinkageAnnotationPage
