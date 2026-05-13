import Limit from '@/components/Limit'
import ThemeToggle from '@/components/ThemeToggle'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <header className="fixed top-0 left-0 z-50 h-16 w-full border-base-muted-light border-b bg-base-100/95 backdrop-blur">
        <Limit className="mx-auto flex h-full w-full items-center justify-between">
          <span className="font-semibold text-base-content">maplibre-vike</span>
          <ThemeToggle />
        </Limit>
      </header>
      <main className="pt-24">
        <Limit>{children}</Limit>
      </main>
    </div>
  )
}
export default Layout
