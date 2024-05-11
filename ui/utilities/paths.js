// We should update this module to be OS dependent if we ever want to support more than Windows

export const splitPath = (path) => {
  return path.split('\\')
}

export const leafPath = (path) => {
  return path.split('\\').pop()
}

export const joinPath = (parts) => {
  return parts.join('\\')
}
