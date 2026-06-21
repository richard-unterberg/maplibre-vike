import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

const config: Config = {
  title: 'maplibre-vike',
  prerender: true,
  extends: [vikeReact],
  passToClient: ['locale'],
  htmlAttributes: {
    'data-theme': 'maplibre-vike-light',
  },
}

export default config
