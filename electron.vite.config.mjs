import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve('electron-src/main/index.js')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    build: {
      lib: {
        entry: resolve('electron-src/preload/index.js')
      }
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    root: 'electron-src/renderer',
    build: {
      rollupOptions: {
        input: 'electron-src/renderer/index.html'
      }
    },
    resolve: {
      alias: {
        '@renderer': resolve('electron-src/renderer/src')
      }
    },
    plugins: [react()]
  }
})
