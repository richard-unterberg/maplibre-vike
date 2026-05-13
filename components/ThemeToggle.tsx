import { Moon, Sun } from 'lucide-react'

import { getCurrentThemePreference, setThemePreference, ThemePreference } from '@/components/themeAppearance'

const ThemeToggle = () => {
  const toggleTheme = () => {
    const nextThemePreference =
      getCurrentThemePreference() === ThemePreference.dark ? ThemePreference.light : ThemePreference.dark

    setThemePreference(nextThemePreference)
  }

  return (
    <button
      type="button"
      className="btn btn-square btn-ghost"
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={toggleTheme}
    >
      <Moon className="block size-5 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-5 dark:block" aria-hidden="true" />
    </button>
  )
}

export default ThemeToggle
