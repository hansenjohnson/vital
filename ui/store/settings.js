import { create } from 'zustand'

import { REQUIRED_SETTINGS } from '../constants/settingKeys'
import settingsAPI from '../api/settings'
import { valueSetter } from './utils'

const useSettingsStore = create((set) => ({
  loading: true,
  initialized: false,
  setLoading: valueSetter(set, 'loading'),
  setInitialized: valueSetter(set, 'initialized'),

  open: false,
  setOpen: valueSetter(set, 'open'),
  openDialog: () => set({ open: true }),
  closeDialog: () => {
    set((state) => ({ settings: state.originalSettings }))
    set({ open: false })
  },

  settings: Object.fromEntries(REQUIRED_SETTINGS.map((key) => [key, ''])),
  setSettings: valueSetter(set, 'settings'),
  setOneSetting: (key, value) =>
    set((state) => ({
      settings: { ...state.settings, [key]: value },
    })),

  // We use this value to keep track of what was loaded from the server without having to do it again
  // This allows us to reset the input boxes if the user makes a change but then closes the dialog
  // without performing a save
  originalSettings: Object.fromEntries(REQUIRED_SETTINGS.map((key) => [key, ''])),

  loadSettings: async () => {
    const settingsList = await settingsAPI.getList(REQUIRED_SETTINGS)
    const incomingSettings = settingsList.reduce((acc, settingData) => {
      const [key, value] = Object.entries(settingData)[0]
      acc[key] = value || ''
      return acc
    }, {})

    set((state) => ({
      originalSettings: { ...state.settings, ...incomingSettings },
      settings: { ...state.settings, ...incomingSettings },
      loading: false,
    }))
  },
}))

export default useSettingsStore
