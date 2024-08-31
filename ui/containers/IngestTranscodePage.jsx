import { useState, useEffect, useMemo } from 'react'
import Box from '@mui/material/Box'

import useStore from '../store'
import useJobStore from '../store/job'
import STATUSES, { ERRORS, WARNINGS } from '../constants/statuses'
import { JOB_PHASES, JOB_MODES } from '../constants/routes'
import { ROOT_FOLDER } from '../constants/fileTypes'
import ingestAPI from '../api/ingest'
import {
  bytesToSize,
  twoPrecisionStrNum,
  secondsToDuration,
  fileNameGoodLength,
} from '../utilities/strings'
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
import CompressionSidebar from './CompressionSidebar'
import CompressionBucketsList from '../components/CompressionBucketsList'

const LinkageAnnotationPage = () => {
  const sourceFolder = useJobStore((state) => state.sourceFolder)

  const phase = useJobStore((state) => state.phase)
  const jobMode = useJobStore((state) => state.jobMode)

  const metadataFilter = useJobStore((state) => state.metadataFilter)
  const issueIgnoreList = useJobStore((state) => state.issueIgnoreList)
  const batchRenameRules = useJobStore((state) => state.batchRenameRules)
  const processBatchRenameOnString = useJobStore((state) => state.processBatchRenameOnString)

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
      if (status === STATUSES.INCOMPLETE) return
      if (status === STATUSES.ERROR) {
        // TODO: handle error case, currently the backend doesn't return this
        return
      }
      if (status !== STATUSES.COMPLETED) {
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

  /* Trigger Execute, which now means "Add job to queue" */
  const setSettingsList = useJobStore((state) => state.setSettingsList)
  const setPhase = useJobStore((state) => state.setPhase)
  const executeJob = () => {
    if (jobMode === JOB_MODES.BY_VIDEO) {
      const settingsList = mediaGroups.flatMap((group) =>
        group.mediaList.map((media) => ({
          file_path: media.filePath,
          new_name: media.newName,
          input_height: media.height,
          num_frames: media.numFrames,
          output_framerate: Math.round(media.frameRate),
        }))
      )
      setSettingsList(settingsList)
    } else {
      const settingsList = mediaGroups.flatMap((group) =>
        group.mediaList.map((media) => ({
          file_path: media.filePath,
          new_name: media.newName,
          jpeg_quality: 69, // placeholder
        }))
      )
      setSettingsList(settingsList)
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
        const hasNewNameOfGoodLength = media.newName && fileNameGoodLength(media.newName)
        const newWarnings = media.warnings.filter((w) => !issueIgnoreList.includes(w))
        const newErrors = media.errors.filter((e) => {
          if (e === 'LENGTH_ERROR' && hasNewNameOfGoodLength) return false
          return true
        })
        const newMediaStatus = calculateStatus(newErrors, newWarnings)
        return {
          ...media,
          status: newMediaStatus,
          warnings: newWarnings,
          errors: newErrors,
        }
      })
      return { ...group, status: newGroupStatus, mediaList }
    })
  }, [JSON.stringify(mediaGroupsFiltered), issueIgnoreList])

  /* Apply batch rename rules to all filenames in the data */
  const makeAlert = useStore((state) => state.makeAlert)
  const invalidateBatchRenameRules = useJobStore((state) => state.invalidateBatchRenameRules)
  useEffect(() => {
    if (!batchRenameRules.applied) return
    // Capture Name Duplicates to report the Conflict to the user
    const newNameOldNameMap = {}
    const duplicates = {}

    const newMediaGroups = mediaGroups.map((group) => {
      const newMediaList = group.mediaList.map((media) => {
        const newName = processBatchRenameOnString(media.fileName)
        if (newNameOldNameMap?.[group]?.[newName]) {
          if (!duplicates?.[group]?.[newName]) {
            if (!duplicates[group]) {
              duplicates[group] = {}
            }
            duplicates[group][newName] = [newNameOldNameMap[group][newName]]
          }
          duplicates[group][newName].push(media.fileName)
        } else {
          if (!newNameOldNameMap[group]) {
            newNameOldNameMap[group] = {}
          }
          newNameOldNameMap[group][newName] = media.fileName
        }
        return { ...media, newName }
      })
      return { ...group, mediaList: newMediaList }
    })

    if (Object.keys(duplicates).length > 0) {
      const exampleConflicts = Object.values(duplicates).flatMap((group) =>
        Object.entries(group)
          .map(([newName, oldNames], index) => {
            if (index > 2) return
            return `${oldNames.map((oldName) => `${oldName} → ${newName}`).join('\n')}`
          })
          .join('\n\n')
      )
      makeAlert(
        `Name Conflicts found in Batch Rename Rules. Here are some examples:\n
        ${exampleConflicts}`,
        'error'
      )
      invalidateBatchRenameRules()
      return
    }

    setMediaGroups(newMediaGroups)
  }, [batchRenameRules.applied, JSON.stringify(mediaGroups)])

  /* Phase Handling Returns */
  if (phase === JOB_PHASES.PARSE) {
    let columns = [
      { key: 'fileName', overwriteKey: 'newName', label: 'File Name', maxWidth: 200 },
      {
        key: 'extension',
        label: 'Type',
        align: 'right',
        transformer: (value) => value.toUpperCase(),
      },
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
    const canTriggerNextAction = (() => {
      if (!batchRenameRules.applied) return false
      return mediaGroupsFilteredAndIgnored.every((group) => {
        if (group.status === STATUSES.ERROR) return false
        return group.mediaList.every((media) => {
          if (media.status === STATUSES.ERROR) return false
          return true
        })
      })
    })()
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        <IngestParseSidebar
          status={parseStatus}
          totalSize={totalSize}
          allWarnings={allWarnings}
          allErrors={allErrors}
          oneFileName={mediaGroups[0]?.mediaList[0]?.fileName}
          actionName={
            jobMode === JOB_MODES.BY_VIDEO ? 'Add Job to Queue' : 'Choose Compression Options'
          }
          canTrigger={canTriggerNextAction}
          onTriggerAction={
            jobMode === JOB_MODES.BY_VIDEO ? executeJob : () => setPhase(JOB_PHASES.CHOOSE_OPTIONS)
          }
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

  if (phase === JOB_PHASES.CHOOSE_OPTIONS) {
    return (
      <Box sx={{ display: 'flex', height: '100%' }}>
        <CompressionSidebar
          status={false}
          actionName="Add Job to Queue"
          canTrigger={false}
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
          <CompressionBucketsList />
        </Box>
      </Box>
    )
  }

  if (phase === JOB_PHASES.EXECUTE) {
    return (
      <Box
        sx={{
          height: '100%',
          margin: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 1,
        }}
      >
        Job added to the queue, feel free to return home
      </Box>
    )
  }

  return <BlankSlate message={`Unknown Phase: ${phase}`} />
}

export default LinkageAnnotationPage
