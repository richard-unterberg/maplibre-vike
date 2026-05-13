import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'
import { defineConfig } from 'vite'

import tsConf from './tsconfig.json' with { type: 'json' }

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export const pathAliases = Object.entries(tsConf.compilerOptions.paths).map(([key, [value]]) => {
  if (key.includes('*')) {
    const find = new RegExp(`^${key.replace('/*', '/(.*)$')}`)
    const replacement = path.resolve(__dirname, value.replace('/*', '/$1'))
    return { find, replacement }
  }
  return { find: key, replacement: path.resolve(__dirname, value) }
})

export default defineConfig({
  plugins: [vike(), react(), tailwindcss()],
  resolve: {
    alias: pathAliases,
  },
})
