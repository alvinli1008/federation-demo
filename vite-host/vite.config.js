import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from '@originjs/vite-plugin-federation'

import { dependencies } from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'host',
      filename: 'remoteEntry.js',
      remotes: {
        remote: 'http://127.0.0.1:8080/remoteEntry.js',
        from: 'webpack'
      },
      shared: [
        {
          react: {
            singleton: true,
            requiredVersion: dependencies['react']
          }
        },
        {
          'react-dom': {
            singleton: true,
            requiredVersion: dependencies['react-dom']
          }
        }
      ]
    })
  ],
  build: {
    modulePreload: false,
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  },
})
