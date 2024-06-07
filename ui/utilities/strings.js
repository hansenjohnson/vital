import { timecodeFromFrameNumber } from './video'

export const yearMonthDayString = (year, month, day) => `${year}-${monthDayString(month, day)}`

export const monthDayString = (month, day) =>
  `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`

export const viewSuffixString = (folder) =>
  `${monthDayString(folder.month, folder.day)} ${folder.observer}`

export const regionString = (regionStart, regionEnd, frameRate) => {
  if (regionStart == null && regionEnd == null) return ''

  let regionString = ''
  if (regionStart == null) {
    regionString += 'not set - '
  } else {
    regionString += timecodeFromFrameNumber(regionStart, frameRate)
    regionString += ' - '
  }
  if (regionEnd == null) {
    regionString += 'not set'
  } else {
    regionString += timecodeFromFrameNumber(regionEnd, frameRate)
  }
  return regionString
}

export const catalogFolderString = (folder) =>
  `${yearMonthDayString(folder.year, folder.month, folder.day)}-${folder.observer.replaceAll('/', '-')}`
