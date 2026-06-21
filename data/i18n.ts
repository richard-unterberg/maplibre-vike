import { modifyUrl } from 'vike/modifyUrl'
import type { Url } from 'vike/types'

export const locales = ['en', 'de'] as const
export type Locale = (typeof locales)[number]

export const localeDefault = 'en' satisfies Locale

export type LocaleString = {
  [localeDefault]: string
} & Partial<Record<Exclude<Locale, typeof localeDefault>, string>>

interface Dictionary {
  all: string
  back: string
  categories: string
  chemnitzLocation: string
  chemnitzMap: string
  closeCategoryMenu: string
  coordinates: string
  dock: string
  explorePlaces: string
  map: string
  mapZoom: string
  open: string
  openCategoryMenu: string
  overview: string
  startPage: {
    description: string
    title: string
  }
}

export type DictionaryKey = {
  [Key in keyof Dictionary]: Dictionary[Key] extends string ? Key : never
}[keyof Dictionary]

const dictionary = {
  de: {
    all: 'Alle',
    back: 'Zurueck',
    categories: 'Kategorien',
    chemnitzLocation: 'Chemnitzer Ort',
    chemnitzMap: 'Chemnitz-Karte',
    closeCategoryMenu: 'Kategorienmenue schliessen',
    coordinates: 'Koordinaten',
    dock: 'Andocken',
    explorePlaces: 'Orte erkunden',
    map: 'Karte',
    mapZoom: 'Kartenzoom',
    open: 'Oeffne',
    openCategoryMenu: 'Kategorienmenue oeffnen',
    overview: 'Uebersicht',
    startPage: {
      title: 'Interaktive Karte von Chemnitz',
      description:
        'Entdecke die interaktive Karte von Chemnitz mit vielfältigen Orten, übersichtlich kategorisiert und detailliert beschrieben. Erkunde die Stadt auf eine neue Art und Weise!',
    },
  },
  en: {
    all: 'All',
    back: 'Back',
    categories: 'Categories',
    chemnitzLocation: 'Chemnitz location',
    chemnitzMap: 'Chemnitz map',
    closeCategoryMenu: 'Close category menu',
    coordinates: 'Coordinates',
    dock: 'Dock',
    explorePlaces: 'Explore places',
    map: 'Map',
    mapZoom: 'Map zoom',
    open: 'Open',
    openCategoryMenu: 'Open category menu',
    overview: 'Overview',
    startPage: {
      title: 'Interactive map of Chemnitz',
      description:
        'Discover the interactive map of Chemnitz with diverse locations, clearly categorized and described in detail. Explore the city in a new way!',
    },
  },
} satisfies Record<Locale, Dictionary>

const localeSegments = new Set<Locale>(locales)

export const isLocale = (value: string): value is Locale => localeSegments.has(value as Locale)

export const normalizeLocale = (locale?: string | null): Locale => {
  return locale && isLocale(locale) ? locale : localeDefault
}

export const extractLocale = (url: Url) => {
  const segments = url.pathname.split('/')
  const possibleLocale = segments[1]
  const locale = possibleLocale && isLocale(possibleLocale) ? possibleLocale : localeDefault
  const pathnameWithoutLocale =
    locale === localeDefault ? url.pathname : `/${segments.slice(2).join('/')}`.replace(/\/$/, '') || '/'
  const urlWithoutLocale = modifyUrl(url.href, { pathname: pathnameWithoutLocale })

  return { locale, urlWithoutLocale }
}

export const localizePath = (path: `/${string}`, locale?: Locale): `/${string}` => {
  const normalizedLocale = normalizeLocale(locale)

  if (normalizedLocale === localeDefault) {
    return path
  }

  return `/${normalizedLocale}${path}` as `/${string}`
}

export const pickLocaleString = (value: LocaleString | string, locale?: Locale): string => {
  if (typeof value === 'string') {
    return value
  }

  const normalizedLocale = normalizeLocale(locale)

  return value[normalizedLocale] ?? value[localeDefault]
}

export const getDictionary = (locale?: Locale): Dictionary => {
  return dictionary[normalizeLocale(locale)]
}

export const t = (key: DictionaryKey, locale?: Locale): string => {
  return getDictionary(locale)[key]
}
