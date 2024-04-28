export const transformSightingData = (sightingRow) => {
  const timeStr = `${sightingRow.SightingTime}`
  const monthStr = `${sightingRow.SightingMonth}`.padStart(2, '0')
  const dayStr = `${sightingRow.SightingDay}`.padStart(2, '0')
  return {
    id: sightingRow.SightingId,
    date: `${sightingRow.SightingYear}-${monthStr}-${dayStr}`,
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
