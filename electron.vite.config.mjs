import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve('electron/main.js'),
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    build: {
      lib: {
        entry: resolve('electron/preload.js'),
      },
    },
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    root: resolve('ui'),
    build: {
      rollupOptions: {
        input: resolve('ui/index.html'),
      },
    },
    resolve: {
      alias: {
        '@renderer': resolve('ui'),
      },
    },
    plugins: [react()],
  },
})
