export const valueSetter = (set, key) => (value) => set(() => ({ [key]: value }))
