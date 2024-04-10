import Versions from './components/Versions'
import electronLogo from './assets/electron.svg'

function App() {
  const selectFile = () => window.api.selectFile()

  return (
    <>
      <img alt="logo" className="logo" src={electronLogo} />
      <div className="creator">Powered by electron-vite</div>
      <div className="text">
        Build an Electron app with <span className="react">React</span>
      </div>
      <p className="tip">
        Please try pressing <code>F12</code> to open the devTool
      </p>
      <div className="actions">
        <div className="action">
          <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">
            Documentation
          </a>
        </div>
        <div className="action">
          <a target="_blank" rel="noreferrer" onClick={selectFile}>
            Action 2
          </a>
        </div>
      </div>
      <Versions></Versions>
    </>
  )
}

export default App
