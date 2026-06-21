import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { Coordinates } from '@/components/map/map-types'
import type { LocaleString } from '@/data/i18n'
import type { MapCategory, MapCategoryId, MapMarker, OverviewMapMarker } from '@/data/map-data-types'

const datasetRoots = [
  path.resolve(process.cwd(), 'public', 'data'),
  path.resolve(process.cwd(), 'dist', 'client', 'data'),
]
const categoryIds = ['culture', 'history', 'nature', 'mobility', 'food', 'workspace'] as const
const categoryIdSet = new Set<string>(categoryIds)
const markerIdPattern = /^[a-z0-9-]+$/
const jsonCache = new Map<string, Promise<unknown>>()

const getDatasetUrl = (relativePath: string) => {
  const baseUrl = import.meta.env.BASE_URL.replace(/\/$/, '')

  return `${baseUrl}/data/${relativePath}`
}

const readDatasetJson = async <Value>(relativePath: string): Promise<Value> => {
  const cached = jsonCache.get(relativePath)

  if (cached) {
    return cached as Promise<Value>
  }

  const nextRead =
    typeof window === 'undefined'
      ? readServerDatasetJson(relativePath)
      : fetch(getDatasetUrl(relativePath)).then(async (response) => {
          if (!response.ok) {
            throw new Error(`Dataset request failed for "${relativePath}" with status ${response.status}`)
          }

          return response.json() as Promise<unknown>
        })

  jsonCache.set(relativePath, nextRead)

  return nextRead as Promise<Value>
}

const readServerDatasetJson = async (relativePath: string): Promise<unknown> => {
  let lastError: unknown

  for (const datasetRoot of datasetRoots) {
    try {
      const content = await readFile(path.join(datasetRoot, relativePath), 'utf8')

      return JSON.parse(content) as unknown
    } catch (error) {
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
        lastError = error
        continue
      }

      throw error
    }
  }

  throw lastError
}

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

const assertRecord = (value: unknown, context: string): Record<string, unknown> => {
  if (!isRecord(value)) {
    throw new Error(`Invalid ${context}: expected object`)
  }

  return value
}

const assertString = (value: unknown, context: string): string => {
  if (typeof value !== 'string') {
    throw new Error(`Invalid ${context}: expected string`)
  }

  return value
}

const assertNumber = (value: unknown, context: string): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid ${context}: expected finite number`)
  }

  return value
}

const assertLocaleString = (value: unknown, context: string): LocaleString => {
  const record = assertRecord(value, context)
  const en = assertString(record.en, `${context}.en`)
  const de = record.de === undefined ? undefined : assertString(record.de, `${context}.de`)

  return de === undefined ? { en } : { de, en }
}

const assertCategoryId = (value: unknown, context: string): MapCategoryId => {
  const categoryId = assertString(value, context)

  if (!categoryIdSet.has(categoryId)) {
    throw new Error(`Invalid ${context}: unknown category "${categoryId}"`)
  }

  return categoryId as MapCategoryId
}

const assertCoordinates = (value: unknown, context: string): Coordinates => {
  if (!Array.isArray(value) || value.length !== 2) {
    throw new Error(`Invalid ${context}: expected [lng, lat]`)
  }

  return [assertNumber(value[0], `${context}[0]`), assertNumber(value[1], `${context}[1]`)]
}

const assertCategoryIds = (value: unknown, context: string): readonly [MapCategoryId, ...MapCategoryId[]] => {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`Invalid ${context}: expected at least one category id`)
  }

  return value.map((categoryId, index) => assertCategoryId(categoryId, `${context}[${index}]`)) as [
    MapCategoryId,
    ...MapCategoryId[],
  ]
}

const assertMarkerId = (value: unknown, context: string): string => {
  const markerId = assertString(value, context)

  if (!markerIdPattern.test(markerId)) {
    throw new Error(`Invalid ${context}: expected lowercase slug id`)
  }

  return markerId
}

const parseCategory = (value: unknown, index: number): MapCategory => {
  const record = assertRecord(value, `categories[${index}]`)

  return {
    description: assertLocaleString(record.description, `categories[${index}].description`),
    id: assertCategoryId(record.id, `categories[${index}].id`),
    title: assertLocaleString(record.title, `categories[${index}].title`),
  }
}

const parseOverviewMarker = (value: unknown, index: number): OverviewMapMarker => {
  const record = assertRecord(value, `overviewMarkers[${index}]`)

  return {
    categoryIds: assertCategoryIds(record.categoryIds, `overviewMarkers[${index}].categoryIds`),
    coordinates: assertCoordinates(record.coordinates, `overviewMarkers[${index}].coordinates`),
    detailZoom: assertNumber(record.detailZoom, `overviewMarkers[${index}].detailZoom`),
    id: assertMarkerId(record.id, `overviewMarkers[${index}].id`),
    title: assertLocaleString(record.title, `overviewMarkers[${index}].title`),
  }
}

const parseMarker = (value: unknown, id: string): MapMarker => {
  const record = assertRecord(value, `markers/${id}.json`)

  return {
    categoryIds: assertCategoryIds(record.categoryIds, `markers/${id}.json.categoryIds`),
    coordinates: assertCoordinates(record.coordinates, `markers/${id}.json.coordinates`),
    description: assertLocaleString(record.description, `markers/${id}.json.description`),
    detailZoom: assertNumber(record.detailZoom, `markers/${id}.json.detailZoom`),
    id: assertMarkerId(record.id, `markers/${id}.json.id`),
    title: assertLocaleString(record.title, `markers/${id}.json.title`),
  }
}

export const getCategories = async (): Promise<MapCategory[]> => {
  const rawCategories = await readDatasetJson<unknown>('categories.json')

  if (!Array.isArray(rawCategories)) {
    throw new Error('Invalid categories dataset: expected array')
  }

  return rawCategories.map(parseCategory)
}

export const getOverviewMarkers = async (): Promise<OverviewMapMarker[]> => {
  const rawMarkers = await readDatasetJson<unknown>('markers/overview.json')

  if (!Array.isArray(rawMarkers)) {
    throw new Error('Invalid overview marker dataset: expected array')
  }

  return rawMarkers.map(parseOverviewMarker)
}

export const getMarkerById = async (id?: string | null): Promise<MapMarker | null> => {
  if (!id || !markerIdPattern.test(id)) {
    return null
  }

  try {
    const rawMarker = await readDatasetJson<unknown>(`markers/${id}.json`)
    const marker = parseMarker(rawMarker, id)

    if (marker.id !== id) {
      throw new Error(`Marker file id mismatch: expected "${id}", received "${marker.id}"`)
    }

    return marker
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return null
    }

    throw error
  }
}
