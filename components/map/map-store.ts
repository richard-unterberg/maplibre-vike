import { create } from 'zustand'

import type { MapCameraIntent, MapView } from '@/components/map/map-types'

interface MapStoreState {
  cameraIntent: MapCameraIntent | null
  clearCameraIntent: () => void
  setCameraIntent: (cameraIntent: MapCameraIntent) => void
  setView: (view: MapView) => void
  view: MapView
}

export const useMapStore = create<MapStoreState>((set) => ({
  cameraIntent: null,
  clearCameraIntent: () => set({ cameraIntent: null }),
  setCameraIntent: (cameraIntent) => set({ cameraIntent }),
  setView: (view) => set({ view }),
  view: 'overview',
}))
