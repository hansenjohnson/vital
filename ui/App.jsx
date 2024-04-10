const App = () => {
  const selectFile = () => window.api.selectFile()

  return (
    <>
      <div className="creator">Powered by electron-vite</div>
      <a target="_blank" rel="noreferrer" onClick={selectFile}>
        Action 2
      </a>
    </>
  )
}

export default App
