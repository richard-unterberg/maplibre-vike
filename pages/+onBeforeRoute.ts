import type { PageContext } from 'vike/types'

import { extractLocale } from '@/data/i18n'

function onBeforeRoute(pageContext: PageContext) {
  const { urlWithoutLocale, locale } = extractLocale(pageContext.urlParsed)
  return {
    pageContext: {
      // Make locale available as pageContext.locale
      locale,
      // Vike's router will use pageContext.urlLogical instead of pageContext.urlOriginal and
      // the locale is removed from pageContext.urlParsed
      urlLogical: urlWithoutLocale,
    },
  }
}

export { onBeforeRoute }
