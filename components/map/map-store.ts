import { create } from 'zustand'

import type { MapCameraIntent, MapView } from '@/components/map/map-types'
import type { MapCategoryId } from '@/data/map-data-types'

interface MapStoreState {
  activeCategoryId: MapCategoryId | null
  cameraIntent: MapCameraIntent | null
  categoryMenuOpen: boolean
  clearCameraIntent: () => void
  setActiveCategoryId: (categoryId: MapCategoryId | null) => void
  setCameraIntent: (cameraIntent: MapCameraIntent) => void
  setCategoryMenuOpen: (open: boolean) => void
  setView: (view: MapView) => void
  toggleCategoryMenu: () => void
  view: MapView
}

export const useMapStore = create<MapStoreState>((set) => ({
  activeCategoryId: null,
  cameraIntent: null,
  categoryMenuOpen: false,
  clearCameraIntent: () => set({ cameraIntent: null }),
  setActiveCategoryId: (categoryId) => set({ activeCategoryId: categoryId }),
  setCameraIntent: (cameraIntent) =>
    set((state) => (state.cameraIntent?.id === cameraIntent.id ? state : { cameraIntent })),
  setCategoryMenuOpen: (open) => set({ categoryMenuOpen: open }),
  setView: (view) => set({ view }),
  toggleCategoryMenu: () => set((state) => ({ categoryMenuOpen: !state.categoryMenuOpen })),
  view: 'overview',
}))
