import type { Locale } from '@/data/i18n'

declare global {
  namespace Vike {
    interface PageContext {
      locale?: Locale
    }
  }
}
