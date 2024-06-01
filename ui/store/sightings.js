import { valueSetter } from './utils'
import { transformSightingData, sortSightingData } from '../utilities/transformers'
import { doRegionsOverlap } from '../utilities/numbers'
import sightingsAPI from '../api/sightings'
import { getSelectedFolder } from './folders'

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
  const { existingRegions, regionStart, regionEnd } = state
  const selectedSighting = getSelectedSighting(state)
  return existingRegions
    .filter((region) => region.letter === selectedSighting?.letter)
    .some((region) => doRegionsOverlap(region.start, region.end, regionStart, regionEnd))
}

export { getSelectedSighting, getSelectedSightingName, selectedSightingHasOverlap }
export default createSightingsStore
