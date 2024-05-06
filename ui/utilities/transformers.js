export const yearMonthDayString = (year, month, day) =>
  `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

export const transformCatalogFolderData = (folderRow) => {
  return {
    id: folderRow.CatalogFolderId,
    date: yearMonthDayString(folderRow.FolderYear, folderRow.FolderMonth, folderRow.FolderDay),
    year: folderRow.FolderYear,
    month: folderRow.FolderMonth,
    day: folderRow.FolderDay,
    observer: folderRow.ObserverCode,
  }
}

export const sortCatalogFolderData = (original) => {
  return original.toSorted((a, b) => {
    // Date DESC
    if (a.date < b.date) return 1
    if (a.date > b.date) return -1

    // Observer ASC
    if (a.ObserverCode > b.ObserverCode) return 1
    if (a.ObserverCode < b.ObserverCode) return -1
    return 0
  })
}

export const transformSightingData = (sightingRow) => {
  const timeStr = `${sightingRow.SightingTime}`
  return {
    id: sightingRow.SightingId,
    date: yearMonthDayString(
      sightingRow.SightingYear,
      sightingRow.SightingMonth,
      sightingRow.SightingDay
    ),
    observer: sightingRow.ObserverCode,
    time: `${timeStr.slice(0, 2)}:${timeStr.slice(2, 4)}`,
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
