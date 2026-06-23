import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import { viteBeastiesOutput } from '@unterberg/vite-beasties-output'
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

const pagesBasePath = process.env.PAGES_BASE_PATH?.replace(/\/$/, '')
const base = pagesBasePath ? `${pagesBasePath}/` : '/'

export default defineConfig({
  base,
  plugins: [vike(), react(), tailwindcss(), viteBeastiesOutput()],
  resolve: {
    alias: pathAliases,
  },
})
