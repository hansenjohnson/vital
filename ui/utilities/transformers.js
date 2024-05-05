export const yearMonthDayString = (year, month, day) =>
  `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

export const sortCatalogFolderData = (original) => {
  return original.toSorted((a, b) => {
    // Year DESC
    if (a.FolderYear < b.FolderYear) return 1
    if (a.FolderYear > b.FolderYear) return -1

    // Month DESC
    if (a.FolderMonth < b.FolderMonth) return 1
    if (a.FolderMonth > b.FolderMonth) return -1

    // Day DESC
    if (a.FolderDay < b.FolderDay) return 1
    if (a.FolderDay > b.FolderDay) return -1

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
