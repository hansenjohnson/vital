import { ROOT_FOLDER } from '../constants/fileTypes'
import STATUSES, { WARNING_MESSAGES, ERROR_MESSAGES } from '../constants/statuses'
import { joinPath, splitPath } from './paths'
import { yearMonthDayString } from './strings'

export const transformFolderData = (folderRow) => {
  return {
    id: folderRow.CatalogFolderId,
    date: yearMonthDayString(folderRow.FolderYear, folderRow.FolderMonth, folderRow.FolderDay),
    year: folderRow.FolderYear,
    month: folderRow.FolderMonth,
    day: folderRow.FolderDay,
    observer: folderRow.ObserverCode,
  }
}

export const sortFolderData = (original) => {
  return original.toSorted((a, b) => {
    // Date DESC
    if (a.date < b.date) return 1
    if (a.date > b.date) return -1

    // Observer ASC
    if (a.observer > b.observer) return 1
    if (a.observer < b.observer) return -1
    return 0
  })
}

export const transformVideoData = (videoRow) => {
  return {
    id: videoRow.CatalogVideoId,
    fileName: videoRow.OptimizedFileName,
    frameRate: videoRow.FrameRate,
    folderId: videoRow.CatalogFolderId,
  }
}

export const sortVideoData = (original) => {
  return original.toSorted((a, b) => {
    return a.fileName.localeCompare(b.fileName)
  })
}

export const transformSightingData = (sightingRow) => {
  const timeStr = `${sightingRow.SightingTime}`
  const timeStrLen4 = timeStr.length === 3 ? `0${timeStr}` : timeStr
  return {
    id: sightingRow.SightingId,
    date: yearMonthDayString(
      sightingRow.SightingYear,
      sightingRow.SightingMonth,
      sightingRow.SightingDay
    ),
    year: sightingRow.SightingYear.toString(),
    month: sightingRow.SightingMonth.toString().padStart(2, '0'),
    day: sightingRow.SightingDay.toString().padStart(2, '0'),
    observer: sightingRow.ObserverCode,
    time: sightingRow.SightingTime && `${timeStrLen4.slice(0, 2)}:${timeStrLen4.slice(2, 4)}`,
    letter: sightingRow.SightingLetter,
    egno: sightingRow.FieldEGNo,
  }
}

export const sortSightingData = (original) => {
  return original.toSorted((a, b) => {
    // Date DESC
    if (a.date < b.date) return 1
    if (a.date > b.date) return -1

    // Observer ASC
    if (a.observer > b.observer) return 1
    if (a.observer < b.observer) return -1

    // Letter ASC
    if (a.letter > b.letter) return 1
    if (a.letter < b.letter) return -1
    return 0
  })
}

export const transformLinkageData = (linkageRow) => ({
  id: linkageRow.LinkageId,
  regionStart: parseInt(linkageRow.StartTime, 10),
  regionEnd: parseInt(linkageRow.EndTime, 10),
  annotations: JSON.parse(linkageRow.Annotation),
  thumbnail: linkageRow.ThumbnailFilePath,
  sighting: transformSightingData(linkageRow),
  video: transformVideoData(linkageRow),
})

export const sortLinkageData = (original) => {
  return original.toSorted((a, b) => {
    // Letter ASC
    if (a.sighting.letter > b.sighting.letter) return 1
    if (a.sighting.letter < b.sighting.letter) return -1

    // Video ASC
    if (a.video.id > b.video.id) return 1
    if (a.video.id < b.video.id) return -1

    // Region Start Time ASC
    if (a.regionStart > b.regionStart) return 1
    if (a.regionStart < b.regionStart) return -1

    return 0
  })
}

export const regionDataForLinkage = (linkage) => ({
  id: linkage.id,
  letter: linkage.sighting.letter,
  start: linkage.regionStart,
  end: linkage.regionEnd,
})

export const transformMediaMetadata = (media) => {
  const warnings = media?.validation_status?.warnings || []
  const errors = media?.validation_status?.errors || []
  let status = STATUSES.SUCCESS
  if (errors.length > 0) {
    status = STATUSES.ERROR
  } else if (warnings.length > 0) {
    status = STATUSES.WARNING
  }
  return {
    filePath: media.file_path,
    fileName: media.file_name,
    fileSize: media.size,
    resolution: `${media.width}x${media.height}`,
    frameRate: media.frame_rate,
    duration: media.duration,
    warnings: warnings,
    errors: errors,
    status,
  }
}

export const groupMediaMetadataBySubfolder = (sourceFolder, metadata) => {
  const grouped = new Map()
  metadata.forEach((media) => {
    const pathParts = splitPath(media.filePath)
    const fullParentFolder = joinPath(pathParts.slice(0, -1))

    let parentFolder = fullParentFolder.replace(sourceFolder, '')
    if (parentFolder === '' || parentFolder === '/' || parentFolder === '\\') {
      parentFolder = ROOT_FOLDER
    }
    if (parentFolder.startsWith('/') || parentFolder.startsWith('\\')) {
      parentFolder = parentFolder.slice(1)
    }

    if (!grouped.has(parentFolder)) {
      grouped.set(parentFolder, [])
    }
    grouped.get(parentFolder).push(media)
  })

  const statefulGrouping = [...grouped.entries()]
    .map(([subfolder, mediaList]) => {
      const aggregatedWarnings = [...new Set(mediaList.flatMap((m) => m.warnings))]
      const aggregatedErrors = [...new Set(mediaList.flatMap((m) => m.errors))]

      let status = STATUSES.SUCCESS
      let statusText = null
      let filteredMediaList = mediaList
      if (aggregatedErrors.includes('VIDEO_PATH_ERROR')) {
        status = STATUSES.ERROR
        statusText = ERROR_MESSAGES.VIDEO_PATH_ERROR
        filteredMediaList = mediaList.map((media) => ({
          ...media,
          errors: media.errors.filter((e) => e !== 'VIDEO_PATH_ERROR'),
        }))
      } else if (aggregatedWarnings.includes('VIDEO_PATH_WARNING')) {
        status = STATUSES.WARNING
        statusText = WARNING_MESSAGES.VIDEO_PATH_WARNING
        filteredMediaList = mediaList.map((media) => ({
          ...media,
          warnings: media.warnings.filter((e) => e !== 'VIDEO_PATH_WARNING'),
        }))
      }

      return {
        subfolder,
        status,
        statusText,
        aggregatedWarnings,
        aggregatedErrors,
        metadata: filteredMediaList,
      }
    })
    .sort((a, b) => a.subfolder.localeCompare(b.subfolder))

  return statefulGrouping
}
