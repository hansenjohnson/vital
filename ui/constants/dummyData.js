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
