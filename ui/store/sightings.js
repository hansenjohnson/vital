import { valueSetter } from './utils'
import { transformSightingData, sortSightingData } from '../utilities/transformers'
import { doRegionsOverlap } from '../utilities/numbers'
import sightingsAPI from '../api/sightings'
import { getSelectedFolder } from './folders'
import { linkagesForActiveVideo, getActiveLinkage } from './linkages'

const initialState = {
  sightings: [],
  selectedSightingId: null,
  sightingsDialogOpen: false,
}

const createSightingsStore = (set, get) => ({
  ...initialState,
  resetSightingsStore: () => set(initialState),

  loadSightings: async () => {
    const selectedFolder = getSelectedFolder(get())
    const sightingData = await sightingsAPI.get(
      selectedFolder.year,
      selectedFolder.month,
      selectedFolder.day,
      selectedFolder.observer
    )
    const transformedData = sightingData.map(transformSightingData)
    const sortedData = sortSightingData(transformedData)
    set({ sightings: sortedData })
  },

  selectSighting: (id) => set({ selectedSightingId: id, sightingsDialogOpen: false }),

  setSightingsDialogOpen: valueSetter(set, 'sightingsDialogOpen'),
})

const getSelectedSighting = ({ sightings, selectedSightingId }) =>
  sightings.find((sighting) => sighting.id === selectedSightingId)

const getSelectedSightingName = (state) => {
  const sighting = getSelectedSighting(state)
  return sighting ? `${sighting.date} ${sighting.observer} ${sighting.letter}` : ''
}

const selectedSightingHasOverlap = (state) => {
  const { regionStart, regionEnd, activeLinkageId } = state
  const selectedSighting = getSelectedSighting(state)
  return linkagesForActiveVideo(state)
    .filter((linkage) => linkage.id !== activeLinkageId)
    .filter((linkage) => linkage.sighting.letter === selectedSighting?.letter)
    .some((linkage) =>
      doRegionsOverlap(linkage.regionStart, linkage.regionEnd, regionStart, regionEnd)
    )
}

const activeLinkageWithNewSightingHasOverlap = (state, newSightingId) => {
  const activeLinkage = getActiveLinkage(state)
  return linkagesForActiveVideo(state)
    .filter((linkage) => linkage.id !== activeLinkage?.id)
    .filter((linkage) => linkage.sighting.id === newSightingId)
    .some((linkage) =>
      doRegionsOverlap(
        linkage.regionStart,
        linkage.regionEnd,
        activeLinkage.regionStart,
        activeLinkage.regionEnd
      )
    )
}

export {
  getSelectedSighting,
  getSelectedSightingName,
  selectedSightingHasOverlap,
  activeLinkageWithNewSightingHasOverlap,
}
export default createSightingsStore
