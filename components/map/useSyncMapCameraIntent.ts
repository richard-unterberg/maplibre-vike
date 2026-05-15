import { useEffect } from 'react'

import type { MapCameraIntent } from '@/components/map/map-types'
import { useMapStore } from '@/components/map/map-store'

export const useSyncMapCameraIntent = (cameraIntent: MapCameraIntent) => {
  const clearCameraIntent = useMapStore((state) => state.clearCameraIntent)
  const setCameraIntent = useMapStore((state) => state.setCameraIntent)

  useEffect(() => {
    setCameraIntent(cameraIntent)
  }, [cameraIntent, setCameraIntent])

  useEffect(() => {
    return () => {
      clearCameraIntent()
    }
  }, [clearCameraIntent])
}
