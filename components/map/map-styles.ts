import { ThemePreference, type ThemePreference as ThemePreferenceValue } from '@/components/themeAppearance'

const MAPTILER_API_KEY = import.meta.env.VITE_MAPTILER_API_KEY || 'nonono'

const mapStyleIds = {
  [ThemePreference.light]: 'dataviz-v4',
  [ThemePreference.dark]: '617863e6-6f57-4aac-beb5-8dd33d71337a',
} as const satisfies Record<ThemePreferenceValue, string>

export const getMapStyleUrl = (themePreference: ThemePreferenceValue) => {
  const styleId = mapStyleIds[themePreference]

  return `https://api.maptiler.com/maps/${styleId}/style.json?key=${MAPTILER_API_KEY}`
}
