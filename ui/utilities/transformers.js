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
  regionStart: linkageRow.StartTime,
  regionEnd: linkageRow.EndTime,
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
