export const creation = {
  videoFolderName: '2021-10-13 TC/DASH8',
  videoFiles: [
    'whale-video-007.mp4',
    'whale-video-008.mp4',
    'whale-video-012.mp4',
    'whale-video-009.mp4',
    'whale-video-013.mp4',
    'whale-video-001.mp4',
    'whale-video-002.mp4',
    'whale-video-003.mp4',
    'whale-video-004.mp4',
    'whale-video-005.mp4',
    'whale-video-006.mp4',
    'whale-video-014.mp4',
    'whale-video-015.mp4',
    'whale-video-016.mp4',
    'whale-video-017.mp4',
    'whale-video-018.mp4',
    'whale-video-019.mp4',
    'whale-video-020.mp4',
  ],
  activeVideoFile: 'whale-video-004.mp4',
  completedVideoFiles: [
    'whale-video-101.mp4',
    'whale-video-102.mp4',
    'whale-video-103.mp4',
    'whale-video-104.mp4',
    'whale-video-105.mp4',
    'whale-video-106.mp4',
    'whale-video-107.mp4',
    'whale-video-108.mp4',
    'whale-video-109.mp4',
    'whale-video-110.mp4',
    'whale-video-111.mp4',
    'whale-video-112.mp4',
    'whale-video-113.mp4',
    'whale-video-114.mp4',
  ],
}

export const association = {
  regionStart: '02:10;00',
  regionEnd: '04:01;06',
  sightingName: '2021-10-13 TC/DASH8 F',
  annotations: ['arrow 1', 'ellipse 1', 'rectangle 1'],
}

export const video = {
  percentBuffered: 75,
  existingRegions: [
    [20, 280],
    [200, 400],
    [800, 1500],
    [1200, 1800],
    [1300, 1400],
    [2000, 2200],
  ],
  regionStart: 314,
  regionEnd: 880,
  videoDuration: 2357,
  currentTime: 526,
}

const fakeGuidGenerator = () => {
  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
}

const createData = (date, observer, time, letter) => ({
  id: fakeGuidGenerator(),
  date,
  observer,
  time,
  letter,
})

export const sightings = [
  createData('2021-10-13', 'TC/DASH8', '13:43', '#2'),
  createData('2021-10-13', 'TC/DASH8', '13:43', '#4'),
  createData('2021-10-13', 'TC/DASH8', '13:43', 'C'),
  createData('2021-10-13', 'TC/DASH8', '13:43', 'D'),
  createData('2021-10-13', 'TC/DASH8', '13:43', 'E'),
  createData('2021-10-13', 'TC/DASH8', '13:43', 'F'),
  createData('2021-10-13', 'TC/DASH8', '13:43', 'G'),
  createData('2021-10-13', 'TC/DASH8', '13:43', 'H'),

  createData('2021-10-14', 'BEN', '13:43', '#2'),
  createData('2021-10-14', 'BEN', '13:43', '#4'),
  createData('2021-10-14', 'BEN', '13:43', 'C'),
  createData('2021-10-14', 'BEN', '13:43', 'D'),
  createData('2021-10-14', 'BEN', '13:43', 'E'),
  createData('2021-10-14', 'BEN', '13:43', 'F'),
  createData('2021-10-14', 'BEN', '13:43', 'G'),
  createData('2021-10-14', 'BEN', '13:43', 'H'),

  createData('2021-10-15', 'JOE', '13:43', '#2'),
  createData('2021-10-15', 'JOE', '13:43', '#4'),
  createData('2021-10-15', 'JOE', '13:43', 'C'),
  createData('2021-10-15', 'JOE', '13:43', 'D'),
  createData('2021-10-15', 'JOE', '13:43', 'E'),
  createData('2021-10-15', 'JOE', '13:43', 'F'),
  createData('2021-10-15', 'JOE', '13:43', 'G'),
  createData('2021-10-15', 'JOE', '13:43', 'H'),

  createData('2021-10-16', 'KARL', '13:43', '#2'),
  createData('2021-10-16', 'KARL', '13:43', '#4'),
  createData('2021-10-16', 'KARL', '13:43', 'C'),
  createData('2021-10-16', 'KARL', '13:43', 'D'),
  createData('2021-10-16', 'KARL', '13:43', 'E'),
  createData('2021-10-16', 'KARL', '13:43', 'F'),
  createData('2021-10-16', 'KARL', '13:43', 'G'),
  createData('2021-10-16', 'KARL', '13:43', 'H'),

  createData('2021-10-17', 'ROBERT', '13:43', '#2'),
  createData('2021-10-17', 'ROBERT', '13:43', '#4'),
  createData('2021-10-17', 'ROBERT', '13:43', 'C'),
  createData('2021-10-17', 'ROBERT', '13:43', 'D'),
  createData('2021-10-17', 'ROBERT', '13:43', 'E'),
  createData('2021-10-17', 'ROBERT', '13:43', 'F'),
  createData('2021-10-17', 'ROBERT', '13:43', 'G'),
  createData('2021-10-17', 'ROBERT', '13:43', 'H'),
]
