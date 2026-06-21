import { usePageContext } from 'vike-react/usePageContext'

import Limit from '@/components/Limit'
import LocaleSwitcher from '@/components/LocaleSwitcher'
import ThemeToggle from '@/components/ThemeToggle'
import { getLocalizedAppHref } from '@/data/app-url'
import { normalizeLocale } from '@/data/i18n'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pageContext = usePageContext()
  const locale = normalizeLocale(pageContext.locale)

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="fixed top-0 left-0 z-50 h-16 w-full border-base-muted-light border-b bg-base-100/95">
        <Limit className="mx-auto flex h-full w-full items-center justify-between">
          <a className="font-semibold text-base-content" href={getLocalizedAppHref('/map', locale)}>
            maplibre-vike
          </a>
          <div className="flex items-center gap-2">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </Limit>
      </header>
      <main className="pt-16">
        <div className="relative h-[calc(100dvh-16*var(--spacing))]">{children}</div>
      </main>
    </div>
  )
}
export default Layout
