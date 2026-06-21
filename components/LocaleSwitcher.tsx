import { usePageContext } from 'vike-react/usePageContext'

import { getAppHref } from '@/data/app-url'
import { isLocale, locales, localizePath, normalizeLocale } from '@/data/i18n'

const getLogicalPath = (pathname: string): `/${string}` => {
  const segments = pathname.split('/')

  if (segments[1] && isLocale(segments[1])) {
    return (`/${segments.slice(2).join('/')}`.replace(/\/$/, '') || '/') as `/${string}`
  }

  return (pathname || '/') as `/${string}`
}

const LocaleSwitcher = () => {
  const pageContext = usePageContext()
  const activeLocale = normalizeLocale(pageContext.locale)
  const logicalPath = getLogicalPath(pageContext.urlPathname)

  return (
    <nav className="join" aria-label="Language">
      {locales.map((locale) => (
        <a
          aria-current={activeLocale === locale ? 'true' : undefined}
          className={`btn btn-xs join-item ${activeLocale === locale ? 'btn-primary' : 'btn-outline'}`}
          href={getAppHref(localizePath(logicalPath, locale))}
          key={locale}
        >
          {locale.toUpperCase()}
        </a>
      ))}
    </nav>
  )
}

export default LocaleSwitcher
