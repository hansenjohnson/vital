import { useShallow } from 'zustand/react/shallow'

export const valueSetter = (set, key) => (value) => set({ [key]: value })

export const useValueAndSetter = (useStore, valueKey, setterKey) =>
  useStore(useShallow((state) => [state[valueKey], state[setterKey]]))
