import type { Config } from 'vike/types'
import vikeReact from 'vike-react/config'

const config: Config = {
  title: 'maplibre-vike',
  prerender: true,
  extends: [vikeReact],
  htmlAttributes: {
    'data-theme': 'maplibre-vike-light',
  },
}

export default config
