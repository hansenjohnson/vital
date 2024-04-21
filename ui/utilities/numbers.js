export const determineNonOverlappingTracksForRegions = (regions) => {
  const trackForRegion = []
  regions.forEach((region, index) => {
    if (index === 0) {
      trackForRegion.push(0)
      return
    }

    const [thisStart, thisEnd] = region

    const mostRecentZero = trackForRegion.findLastIndex((track) => track === 0)
    regions.slice(mostRecentZero).some((region, index) => {
      const [otherStart, otherEnd] = region
      if (`${otherStart}-${otherEnd}` === `${thisStart}-${thisEnd}`) return false // Skip own region

      if (index === 0 && thisStart > otherEnd) {
        trackForRegion.push(0)
        return true
      }

      if (thisStart <= otherEnd) {
        // This represents an overlap in track 0, iterate until we find a free track
        let trackToCheck = 1
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const mostRecentRegionInTrackIndex = trackForRegion.findLastIndex(
            (track) => track === trackToCheck
          )
          if (mostRecentRegionInTrackIndex === -1) {
            trackForRegion.push(trackToCheck)
            break
          }
          const mostRecentRegionInTrack = regions[mostRecentRegionInTrackIndex]
          const [, mostRecentRegionEnd] = mostRecentRegionInTrack
          if (thisStart <= mostRecentRegionEnd) {
            trackToCheck += 1
          } else {
            trackForRegion.push(trackToCheck)
            break
          }
        }
      }

      return true
    })
  })
  return trackForRegion
}
