import { getThemeBootstrapScript } from '@/components/themeAppearance'

const ThemeBootstrap = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: getThemeBootstrapScript(),
      }}
    />
  )
}

export default ThemeBootstrap
