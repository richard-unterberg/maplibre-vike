import Limit from '@/components/Limit'
import ThemeToggle from '@/components/ThemeToggle'
import { getAppHref } from '@/data/app-url'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="fixed top-0 left-0 z-50 h-16 w-full border-base-muted-light border-b bg-base-100/95">
        <Limit className="mx-auto flex h-full w-full items-center justify-between">
          <a className="font-semibold text-base-content" href={getAppHref('/map')}>
            maplibre-vike
          </a>
          <ThemeToggle />
        </Limit>
      </header>
      <main className="pt-16">
        <div className="relative h-[calc(100dvh-16*var(--spacing))]">{children}</div>
      </main>
    </div>
  )
}
export default Layout
