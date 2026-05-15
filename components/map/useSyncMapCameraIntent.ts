import { useEffect } from 'react'

import type { MapCameraIntent } from '@/components/map/map-types'
import { useMapStore } from '@/components/map/map-store'

export const useSyncMapCameraIntent = (cameraIntent: MapCameraIntent) => {
  const clearCameraIntent = useMapStore((state) => state.clearCameraIntent)
  const currentCameraIntentId = useMapStore((state) => state.cameraIntent?.id ?? null)
  const setCameraIntent = useMapStore((state) => state.setCameraIntent)

  useEffect(() => {
    if (currentCameraIntentId === cameraIntent.id) {
      return
    }

    setCameraIntent(cameraIntent)
  }, [cameraIntent, currentCameraIntentId, setCameraIntent])

  useEffect(() => {
    return () => {
      clearCameraIntent()
    }
  }, [clearCameraIntent])
}
