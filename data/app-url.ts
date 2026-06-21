import { type Locale, localizePath } from '@/data/i18n'

export const getAppHref = (path: `/${string}`) => {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')

  return `${baseUrl}${path}`
}

export const getLocalizedAppHref = (path: `/${string}`, locale?: Locale) => {
  return getAppHref(localizePath(path, locale))
}
