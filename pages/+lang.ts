import type { PageContextServer } from 'vike/types'

import { localeDefault, normalizeLocale } from '@/data/i18n'

export default (pageContext: PageContextServer) => {
  return normalizeLocale(pageContext.locale ?? localeDefault)
}
