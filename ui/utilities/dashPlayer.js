import { MediaPlayer } from 'dashjs'

export const initializePlayer = (videoElement, url) => {
  const player = MediaPlayer().create()
  player.initialize(videoElement, url)

  player.updateSettings({
    streaming: {
      abr: {
        initialBitrate: { video: 2500 },
      },
      buffer: {
        bufferTimeAtTopQuality: 120,
        bufferTimeAtTopQualityLongForm: 120,
        bufferToKeep: 120,
        fastSwitchEnabled: true,
      },
      trackSwitchMode: {
        audio: 'alwaysReplace',
        video: 'alwaysReplace',
      },
    },
  })

  return player
}

export const startSubscriptions = (player, onStreamInitialized, onCanPlay) => {
  if (onStreamInitialized) player.on('streamInitialized', onStreamInitialized)
  if (onCanPlay) player.on('canPlay', onCanPlay)

  return () => {
    if (onStreamInitialized) player.off('streamInitialized', onStreamInitialized)
    if (onCanPlay) player.off('canPlay', onCanPlay)
  }
}

export const forceToHighestQuality = (player, currentTime, stopSubscriptions) => {
  stopSubscriptions()
  player.setAutoPlay(false)

  const highestQuality = player.getBitrateInfoListFor('video').pop()
  player.updateSettings({
    streaming: {
      abr: {
        minBitrate: { video: highestQuality.bitrate - 1 },
        autoSwitchBitrate: { video: false },
      },
    },
  })

  player.attachSource(player.getSource(), currentTime)
}
