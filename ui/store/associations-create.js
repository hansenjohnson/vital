const createAssociationsCreateStore = (set) => ({
  videoFolderId: null,
  videoFolderName: null,
  setVideoFolderId: (val) => set(() => ({ videoFolderId: val })),
  setVideoFolderName: (val) => set(() => ({ videoFolderName: val })),
})

export default createAssociationsCreateStore
