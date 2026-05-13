import Limit from '@/components/Limit'
import ThemeToggle from '@/components/ThemeToggle'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="fixed top-0 left-0 z-50 h-16 w-full border-base-muted-light border-b bg-base-100/95 backdrop-blur">
        <div className="mx-auto flex h-full w-full max-w-[1800px] items-center justify-between px-4 sm:px-6">
          <span className="font-semibold text-base-content">maplibre-vike</span>
          <ThemeToggle />
        </div>
      </header>
      <main className="pt-24">
        <Limit>{children}</Limit>
      </main>
    </div>
  )
}
export default Layout
