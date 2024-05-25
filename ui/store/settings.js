import { create } from 'zustand'

import { REQUIRED_SETTINGS } from '../constants/settingKeys'
import settingsAPI from '../api/settings'

const useSettingsStore = create((set) => ({
  loading: true,
  initialized: false,
  setLoading: (val) => set(() => ({ loading: val })),
  setInitialized: (val) => set(() => ({ initialized: val })),

  open: false,
  setOpen: (val) => set(() => ({ open: val })),
  openDialog: () => set(() => ({ open: true })),
  closeDialog: () => set(() => ({ open: false })),

  settings: Object.fromEntries(REQUIRED_SETTINGS.map((key) => [key, ''])),
  setSettings: (val) => set(() => ({ settings: val })),
  setOneSetting: (key, value) =>
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    })),

  loadSettings: async () => {
    const settingsList = await settingsAPI.getList(REQUIRED_SETTINGS)
    const incomingSettings = settingsList.reduce((acc, settingData) => {
      const [key, value] = Object.entries(settingData)[0]
      acc[key] = value || ''
      return acc
    }, {})

    set((state) => ({
      settings: { ...state.settings, ...incomingSettings },
      loading: false,
    }))
  },
}))

export default useSettingsStore
