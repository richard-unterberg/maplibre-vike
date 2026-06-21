import type { PrerenderContext } from 'vike/types'

import { type Locale, localeDefault, locales } from '@/data/i18n'

const localizeUrlOriginal = (urlOriginal: string, locale: string) => {
  if (locale === localeDefault) {
    return urlOriginal
  }

  return `/${locale}${urlOriginal === '/' ? '' : urlOriginal}`
}

export const onPrerenderStart = (prerenderContext: PrerenderContext) => {
  type LocalizedPageContext = (typeof prerenderContext.pageContexts)[number] & {
    locale: Locale
    urlOriginal: string
  }
  const pageContexts: LocalizedPageContext[] = []

  prerenderContext.pageContexts.forEach((pageContext) => {
    locales.forEach((locale) => {
      pageContexts.push({
        ...pageContext,
        locale,
        urlOriginal: localizeUrlOriginal(pageContext.urlOriginal, locale),
      })
    })
  })

  return {
    prerenderContext: {
      pageContexts,
    },
  }
}
