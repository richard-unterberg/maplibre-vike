# AGENTS.md

## Project purpose

`maplibre-vike` is a Vike + React + TypeScript application for exploring map-based places with MapLibre.

The application should demonstrate how an interactive browser-only map can be integrated into a Vike app while preserving SSR and prerender compatibility. The central idea is that navigation, routing, selected marker data, and page-specific map state should be derived from Vike's routing and `pageContext` mechanics instead of introducing an extra global state layer such as Zustand or a broad React context.

The project should evolve into a clean architectural reference for:

- Vike-powered SSR/prerender map applications.
- MapLibre usage inside a layout/wrapper container.
- Hierarchical map-point modeling.
- Dynamic routes generated from static TypeScript data.
- Page-specific marker resolution through Vike data/page context.
- Future zoom-based clustering.

## Current stack

Use the existing project stack and conventions.

- Runtime/build framework: Vike
- UI framework: React
- Language: TypeScript
- Styling: Tailwind CSS v4
- UI theming: DaisyUI
- Formatter/linter: Biome
- Package manager: pnpm
- Node.js: >= 24
- Path aliases:
  - `@/pages/*`
  - `@/components/*`
  - `@/styles/*`
  - `@/root/*`

Useful project commands:

```sh
pnpm dev
pnpm build
pnpm preview
pnpm typecheck
pnpm lint
pnpm format
pnpm check:knip
pnpm verify
```

`pnpm verify` should remain the preferred full local validation command.

## Important architectural goal

The map is not a separate SPA inside the app. It should be treated as part of the Vike page and layout architecture.

The desired model is:

```txt
static map data
  -> route matching
  -> selected marker resolution
  -> Vike pageContext/data
  -> page render
  -> client-only MapLibre component receives only the required marker/map state
```

Avoid this model unless there is a strong reason:

```txt
static map data
  -> global Zustand/context store
  -> every page reads the entire map state globally
  -> route/pageContext becomes secondary
```

The route should be the durable source of truth for selected places. The selected marker should be derived from the current Vike route and exposed to the page through Vike's page context/data mechanism.

## Map integration rules

### Browser-only MapLibre

MapLibre must never be imported into code that is evaluated during SSR unless it is protected by a client-only boundary.

Use Vike React's `clientOnly()` helper for the MapLibre map component, because this project explicitly requires it.

Recommended pattern:

```tsx
import { clientOnly } from 'vike-react/clientOnly'

const MapLibreMap = clientOnly(() => import('@/components/map/MapLibreMap'))

export function MapShell(props: MapShellProps) {
  return (
    <MapLibreMap
      fallback={<MapFallback />}
      {...props}
    />
  )
}
```

The actual `MapLibreMap` implementation may import browser-only packages such as `maplibre-gl`, MapLibre CSS, and any direct DOM/window APIs.

Do not import `maplibre-gl` inside:

- `+Layout.tsx`
- `+Page.tsx` files that are SSR-rendered
- route functions
- data resolvers
- shared data/model files
- utility files used by server-side code

If a future contributor prefers Vike's newer `<ClientOnly>` component, that can be considered later, but current work should follow the explicit project requirement and use `clientOnly()`.

### CSS

MapLibre CSS should be imported only from the client-only map implementation or from a dedicated client-side map entry component.

Example:

```ts
import 'maplibre-gl/dist/maplibre-gl.css'
```

Keep app-specific layout styling in Tailwind/DaisyUI classes.

### Layout placement

The map should live inside the Vike wrapper/layout architecture.

The current global layout uses a `Limit` wrapper. Map pages need a layout mode that can render a full-viewport map without being constrained like normal content pages.

Recommended direction:

- Keep a reusable layout/wrapper component.
- Add a map-aware layout variant.
- Do not hardcode map-only behavior into every page.
- Do not make the whole app client-only.

Example direction:

```tsx
// components/layout/AppLayout.tsx
interface AppLayoutProps {
  children: React.ReactNode
  variant?: 'default' | 'map'
}

export function AppLayout({ children, variant = 'default' }: AppLayoutProps) {
  if (variant === 'map') {
    return <div className="min-h-dvh w-full overflow-hidden">{children}</div>
  }

  return <Limit>{children}</Limit>
}
```

A page can then request the map layout through page config/data conventions instead of copying wrapper markup.

## Map display requirements

### Homepage

The homepage should show a large overview map that fills the whole screen.

Expected behavior:

- Full viewport map.
- Shows all configured markers.
- Uses an overview center and zoom that makes the dataset understandable.
- No selected marker is required.
- Clicking a marker navigates to its dynamic Vike route.
- The route, not global state, determines the selected detail page.

Suggested homepage map state:

```ts
{
  mode: 'overview',
  center: [13.0, 50.9],
  zoom: 7,
  selectedMarker: null,
  visibleMarkers: allMapMarkers
}
```

### Detail/subpages

The same map should also appear on subpages, but in a smaller map area.

Expected behavior:

- The map is visible on each marker detail page.
- The view is centered on the selected marker.
- The zoom is closer than on the homepage.
- Only the relevant selected marker has to be resolved into `pageContext.data`.
- The full static dataset may be used for rendering surrounding markers, but avoid treating it as mutable global state.
- Selected marker data should be route-derived.

Suggested detail map state:

```ts
{
  mode: 'detail',
  center: selectedMarker.coordinates,
  zoom: selectedMarker.detailZoom ?? 13,
  selectedMarker,
  visibleMarkers: allMapMarkers
}
```

The map container on detail pages can be smaller, for example:

```tsx
<section className="grid min-h-dvh grid-rows-[minmax(280px,40dvh)_1fr]">
  <MapShell variant="detail" selectedMarker={selectedMarker} markers={markers} />
  <main>{children}</main>
</section>
```

## Data modeling

Map marker data is static for now and should be stored in TypeScript files.

Do not fetch marker data from an API yet.

Recommended files:

```txt
data/
  map-categories.ts
  map-points.ts
  map-tree.ts
  map-resolver.ts
```

or, if keeping the project flatter:

```txt
map/
  data/
    categories.ts
    points.ts
    tree.ts
    resolver.ts
```

Use a hierarchical model because the route structure should reflect a stable content/map taxonomy.

Recommended hierarchy:

```txt
MapSection
  -> MapCategory
    -> MapPoint
```

The hierarchy should be ergonomic to maintain and easy to resolve into flat marker arrays for MapLibre.

### Types

Suggested base types:

```ts
export type Coordinates = readonly [lng: number, lat: number]

export type MapCategoryId =
  | 'culture'
  | 'history'
  | 'nature'
  | 'mobility'
  | 'food'
  | 'workspace'

export interface MapCategory {
  id: MapCategoryId
  slug: string
  title: string
  description: string
}

export interface MapPoint {
  id: string
  slug: string
  title: string
  description: string
  categoryId: MapCategoryId
  coordinates: Coordinates
  overviewZoom?: number
  detailZoom?: number
  route: string
}
```

Generated or derived fields are allowed, but keep the manually maintained source data readable.

### Initial categories

Create at least these categories:

```ts
export const mapCategories = [
  {
    id: 'culture',
    slug: 'culture',
    title: 'Culture',
    description: 'Museums, theaters, public art, and cultural landmarks.',
  },
  {
    id: 'history',
    slug: 'history',
    title: 'History',
    description: 'Historic places, monuments, and industrial heritage.',
  },
  {
    id: 'nature',
    slug: 'nature',
    title: 'Nature',
    description: 'Parks, lakes, forests, viewpoints, and outdoor places.',
  },
  {
    id: 'mobility',
    slug: 'mobility',
    title: 'Mobility',
    description: 'Stations, transport hubs, bridges, and movement corridors.',
  },
  {
    id: 'food',
    slug: 'food',
    title: 'Food',
    description: 'Cafés, markets, restaurants, and local food spots.',
  },
  {
    id: 'workspace',
    slug: 'workspace',
    title: 'Workspace',
    description: 'Campuses, coworking spaces, libraries, and learning places.',
  },
] as const
```

### Initial 30 map points

Create 30 static map points as the initial seed dataset.

The current suggested dataset is centered around Saxony and nearby places because it gives the map a meaningful regional spread while still allowing detail pages to focus on individual markers.

```ts
export const mapPoints = [
  {
    id: 'chemnitz-karl-marx-monument',
    slug: 'karl-marx-monument',
    title: 'Karl Marx Monument',
    description: 'Central Chemnitz landmark and public meeting point.',
    categoryId: 'history',
    coordinates: [12.9252, 50.8342],
    detailZoom: 15,
  },
  {
    id: 'chemnitz-theaterplatz',
    slug: 'theaterplatz',
    title: 'Theaterplatz Chemnitz',
    description: 'Cultural square surrounded by museums, opera, and theater.',
    categoryId: 'culture',
    coordinates: [12.9259, 50.8377],
    detailZoom: 15,
  },
  {
    id: 'chemnitz-schlossteich',
    slug: 'schlossteich',
    title: 'Schlossteich',
    description: 'Urban lake and green recreation area in Chemnitz.',
    categoryId: 'nature',
    coordinates: [12.9139, 50.8413],
    detailZoom: 14,
  },
  {
    id: 'chemnitz-industrial-museum',
    slug: 'industrial-museum',
    title: 'Saxon Museum of Industry',
    description: 'Industrial heritage site documenting the manufacturing history of Chemnitz.',
    categoryId: 'history',
    coordinates: [12.9036, 50.8238],
    detailZoom: 15,
  },
  {
    id: 'chemnitz-kassberg',
    slug: 'kassberg',
    title: 'Kaßberg',
    description: 'Large Gründerzeit district with dense urban architecture.',
    categoryId: 'history',
    coordinates: [12.8998, 50.8339],
    detailZoom: 14,
  },
  {
    id: 'chemnitz-main-station',
    slug: 'main-station',
    title: 'Chemnitz Hauptbahnhof',
    description: 'Main rail station and mobility hub.',
    categoryId: 'mobility',
    coordinates: [12.9303, 50.8395],
    detailZoom: 15,
  },
  {
    id: 'chemnitz-tu-campus',
    slug: 'tu-campus',
    title: 'TU Chemnitz Campus',
    description: 'University campus and learning environment.',
    categoryId: 'workspace',
    coordinates: [12.9298, 50.8136],
    detailZoom: 15,
  },
  {
    id: 'chemnitz-stadtpark',
    slug: 'stadtpark',
    title: 'Stadtpark Chemnitz',
    description: 'Long green corridor along the Chemnitz river.',
    categoryId: 'nature',
    coordinates: [12.8992, 50.8028],
    detailZoom: 14,
  },
  {
    id: 'chemnitz-markthalle',
    slug: 'markthalle',
    title: 'Chemnitz Markthalle',
    description: 'Historic market hall and food-oriented urban place.',
    categoryId: 'food',
    coordinates: [12.9207, 50.8332],
    detailZoom: 15,
  },
  {
    id: 'chemnitz-wirkbau',
    slug: 'wirkbau',
    title: 'Wirkbau Chemnitz',
    description: 'Creative and workspace-oriented industrial complex.',
    categoryId: 'workspace',
    coordinates: [12.9018, 50.8207],
    detailZoom: 15,
  },
  {
    id: 'dresden-altstadt',
    slug: 'altstadt',
    title: 'Dresden Altstadt',
    description: 'Historic center with major cultural landmarks.',
    categoryId: 'culture',
    coordinates: [13.7416, 51.0504],
    detailZoom: 14,
  },
  {
    id: 'dresden-frauenkirche',
    slug: 'frauenkirche',
    title: 'Frauenkirche Dresden',
    description: 'Iconic reconstructed church in Dresden Neumarkt.',
    categoryId: 'history',
    coordinates: [13.7416, 51.0519],
    detailZoom: 16,
  },
  {
    id: 'dresden-grosser-garten',
    slug: 'grosser-garten',
    title: 'Großer Garten Dresden',
    description: 'Large city park and outdoor recreation area.',
    categoryId: 'nature',
    coordinates: [13.7646, 51.0377],
    detailZoom: 14,
  },
  {
    id: 'dresden-neustadt',
    slug: 'neustadt',
    title: 'Dresden Neustadt',
    description: 'Dense urban quarter known for culture, nightlife, and food.',
    categoryId: 'food',
    coordinates: [13.7555, 51.0663],
    detailZoom: 14,
  },
  {
    id: 'dresden-main-station',
    slug: 'main-station',
    title: 'Dresden Hauptbahnhof',
    description: 'Major train station and regional mobility node.',
    categoryId: 'mobility',
    coordinates: [13.7320, 51.0404],
    detailZoom: 15,
  },
  {
    id: 'leipzig-augustusplatz',
    slug: 'augustusplatz',
    title: 'Augustusplatz Leipzig',
    description: 'Central square with university, opera, and concert hall.',
    categoryId: 'culture',
    coordinates: [12.3818, 51.3397],
    detailZoom: 15,
  },
  {
    id: 'leipzig-hauptbahnhof',
    slug: 'hauptbahnhof',
    title: 'Leipzig Hauptbahnhof',
    description: 'Large railway station and commercial mobility hub.',
    categoryId: 'mobility',
    coordinates: [12.3825, 51.3454],
    detailZoom: 15,
  },
  {
    id: 'leipzig-plagwitz',
    slug: 'plagwitz',
    title: 'Leipzig Plagwitz',
    description: 'Former industrial district with creative reuse and workspaces.',
    categoryId: 'workspace',
    coordinates: [12.3336, 51.3295],
    detailZoom: 14,
  },
  {
    id: 'leipzig-clara-zetkin-park',
    slug: 'clara-zetkin-park',
    title: 'Clara-Zetkin-Park',
    description: 'Central green corridor and recreation park in Leipzig.',
    categoryId: 'nature',
    coordinates: [12.3578, 51.3319],
    detailZoom: 14,
  },
  {
    id: 'leipzig-suedvorstadt',
    slug: 'suedvorstadt',
    title: 'Leipzig Südvorstadt',
    description: 'Urban district with cafés, restaurants, and student life.',
    categoryId: 'food',
    coordinates: [12.3730, 51.3218],
    detailZoom: 14,
  },
  {
    id: 'zwickau-august-horch-museum',
    slug: 'august-horch-museum',
    title: 'August Horch Museum Zwickau',
    description: 'Automotive history and industrial culture museum.',
    categoryId: 'history',
    coordinates: [12.4875, 50.7299],
    detailZoom: 15,
  },
  {
    id: 'freiberg-dom',
    slug: 'freiberg-dom',
    title: 'Freiberg Cathedral',
    description: 'Historic cathedral in the mining town of Freiberg.',
    categoryId: 'history',
    coordinates: [13.3427, 50.9171],
    detailZoom: 15,
  },
  {
    id: 'annaberg-market',
    slug: 'annaberg-market',
    title: 'Annaberg-Buchholz Market Square',
    description: 'Historic town center in the Ore Mountains.',
    categoryId: 'culture',
    coordinates: [13.0031, 50.5796],
    detailZoom: 15,
  },
  {
    id: 'oberwiesenthal-fichtelberg',
    slug: 'fichtelberg',
    title: 'Fichtelberg',
    description: 'Highest mountain in Saxony and outdoor destination.',
    categoryId: 'nature',
    coordinates: [12.9541, 50.4285],
    detailZoom: 13,
  },
  {
    id: 'meissen-albrechtsburg',
    slug: 'albrechtsburg',
    title: 'Albrechtsburg Meissen',
    description: 'Late Gothic castle above the Elbe river.',
    categoryId: 'history',
    coordinates: [13.4712, 51.1660],
    detailZoom: 15,
  },
  {
    id: 'moritzburg-castle',
    slug: 'moritzburg-castle',
    title: 'Moritzburg Castle',
    description: 'Baroque castle surrounded by ponds and landscape.',
    categoryId: 'culture',
    coordinates: [13.6806, 51.1687],
    detailZoom: 14,
  },
  {
    id: 'saxon-switzerland-bastei',
    slug: 'bastei',
    title: 'Bastei Bridge',
    description: 'Famous sandstone rock formation and viewpoint.',
    categoryId: 'nature',
    coordinates: [14.0733, 50.9616],
    detailZoom: 14,
  },
  {
    id: 'goerlitz-old-town',
    slug: 'old-town',
    title: 'Görlitz Old Town',
    description: 'Historic cityscape with preserved architecture.',
    categoryId: 'history',
    coordinates: [14.9874, 51.1552],
    detailZoom: 14,
  },
  {
    id: 'rabenstein-castle',
    slug: 'rabenstein-castle',
    title: 'Burg Rabenstein',
    description: 'Small castle and local nature destination near Chemnitz.',
    categoryId: 'nature',
    coordinates: [12.8154, 50.8331],
    detailZoom: 14,
  },
  {
    id: 'chemnitz-kuechwald',
    slug: 'kuechwald',
    title: 'Küchwald Park',
    description: 'Large park and recreation area north of central Chemnitz.',
    categoryId: 'nature',
    coordinates: [12.9089, 50.8520],
    detailZoom: 14,
  },
] as const
```

When adding these points to real code, derive `route` from category + slug instead of hand-writing it repeatedly.

Example:

```ts
export function getMapPointRoute(point: MapPoint, category: MapCategory) {
  return `/places/${category.slug}/${point.slug}`
}
```

## Routing model

Use dynamic Vike routes for marker detail pages.

Recommended route shape:

```txt
/
  Fullscreen overview map

/places/@categorySlug/@pointSlug
  Detail page for one selected marker
```

A marker click should navigate to the corresponding route:

```tsx
navigate(getMapPointRoute(point))
```

or with normal links where possible:

```tsx
<a href={getMapPointRoute(point)}>Open place</a>
```

Avoid putting selected marker state only into client state. Deep links should work after reload, SSR, and prerender.

### Route resolution

Use a route string or a lightweight route function.

A simple route string is acceptable:

```ts
// pages/places/@categorySlug/@pointSlug/+config.ts
import type { Config } from 'vike/types'

export default {
  route: '/places/@categorySlug/@pointSlug',
} satisfies Config
```

If validation against the static hierarchy is needed at route-match time, use a route function, but keep it lightweight. Vike executes route functions during navigation, so do not import heavy map rendering code there.

```ts
// pages/places/+route.ts
import { resolveRoute } from 'vike/routing'
import type { PageContext } from 'vike/types'
import { findMapPointByRouteParams } from '@/root/data/map-resolver'

export function route(pageContext: PageContext) {
  const result = resolveRoute('/places/@categorySlug/@pointSlug', pageContext.urlPathname)

  if (!result.match) return false

  const point = findMapPointByRouteParams(result.routeParams)

  if (!point) return false

  return {
    routeParams: result.routeParams,
  }
}
```

Do not import MapLibre, React map components, or clustering libraries inside route functions.

## Page context / data rules

The selected marker should be resolved per page.

Use `+data.ts` for selected marker resolution and expose it through Vike's page data/page context.

Example:

```ts
// pages/places/@categorySlug/@pointSlug/+data.ts
import type { PageContext } from 'vike/types'
import { findMapPointByRouteParams, getAllMapPoints } from '@/root/data/map-resolver'

export function data(pageContext: PageContext) {
  const selectedMarker = findMapPointByRouteParams(pageContext.routeParams)

  if (!selectedMarker) {
    throw new Error('Map point not found')
  }

  return {
    selectedMarker,
    markers: getAllMapPoints(),
    mapView: {
      mode: 'detail',
      center: selectedMarker.coordinates,
      zoom: selectedMarker.detailZoom ?? 13,
    },
  }
}
```

On the homepage:

```ts
// pages/index/+data.ts
import { getAllMapPoints } from '@/root/data/map-resolver'

export function data() {
  return {
    selectedMarker: null,
    markers: getAllMapPoints(),
    mapView: {
      mode: 'overview',
      center: [13.0, 50.9] as const,
      zoom: 7,
    },
  }
}
```

The page and map shell should consume this data instead of reading from a global store.

If React components need access to page data, prefer Vike/vike-react mechanisms such as `useData()` or a small typed prop pass from page to map shell.

Do not create a project-wide mutable store just to know which marker is selected.

## Map component structure

Recommended structure:

```txt
components/
  map/
    MapShell.tsx
    MapFallback.tsx
    MapLibreMap.tsx
    MarkerLayer.tsx
    ClusterLayer.tsx
    PopupCard.tsx
    map-types.ts
```

### `MapShell.tsx`

Responsibilities:

- SSR-safe wrapper.
- Uses `clientOnly()` to load `MapLibreMap`.
- Owns fallback markup.
- Accepts data already resolved by Vike.

Should not:

- Import `maplibre-gl`.
- Touch `window`.
- Resolve routes.
- Read global marker state.

### `MapLibreMap.tsx`

Responsibilities:

- Imports MapLibre.
- Renders the actual interactive map.
- Receives markers, selected marker, center, zoom, and variant as props.
- Emits marker click navigation.
- Owns MapLibre-specific interaction code.
- Can later handle clustering.

Should not:

- Fetch marker data.
- Resolve Vike routes.
- Own cross-page selected marker state.
- Assume it is rendered on the server.

### `MarkerLayer.tsx`

Responsibilities:

- Render individual marker UI.
- Keep marker styling category-aware.
- Call `onMarkerClick(point)` or render links.
- Avoid business logic.

### `ClusterLayer.tsx`

Responsibilities:

- Placeholder for future cluster rendering.
- Should be designed so clustering can be added without changing the routing model.

## Clustering direction

The system should later support dynamic clustering based on zoom and viewport size.

Do not implement clustering prematurely unless requested, but keep the architecture ready for it.

Recommended future dependencies:

- `supercluster`
- `use-supercluster`
- `@math.gl/web-mercator` if viewport bounds calculations are needed

Rules for future clustering:

- Clustering is a presentation concern of the client-side map.
- Clustering should not change the canonical marker data model.
- Clustering should not change dynamic routes.
- Cluster clicks may zoom into bounds.
- Individual marker clicks should still navigate to marker detail routes.
- Keep cluster state local to the client-only map component.
- Do not put cluster state into Vike page context.

The route/pageContext model should stay responsible only for the selected marker and page-level map view.

## Inspiration from `maplibre-nextjs-ts-starter`

Use `maplibre-nextjs-ts-starter` as an implementation reference for MapLibre-related concerns, but do not copy its architecture blindly.

Useful ideas to adapt:

- MapLibre rendering patterns.
- Marker/popup UI composition.
- Possible clustering dependencies.
- Map viewport handling.

Important differences in this project:

- This is Vike, not Next.js.
- Prefer Vike route/data/pageContext mechanics over Zustand for selected marker/page state.
- Preserve SSR/prerender compatibility.
- Use Vike `clientOnly()` for the browser-only map.
- Do not make the map architecture depend on Next.js routing patterns.

If code is copied or translated from the starter, adapt naming, routing, imports, and state flow to the Vike architecture.

## Styling rules

Use Tailwind CSS classes and DaisyUI tokens where reasonable.

Prefer layout primitives and variants instead of one-off CSS.

Suggested map shell classes:

```tsx
const mapSizeClass = {
  overview: 'h-dvh w-full',
  detail: 'h-[40dvh] min-h-[280px] w-full',
  embedded: 'h-[360px] w-full rounded-box',
} as const
```

Keep marker styling accessible:

- Enough contrast.
- Visible focus state.
- Keyboard-accessible marker controls if custom DOM markers are used.
- Popups should not trap focus unnecessarily.

Use semantic HTML for side panels and marker detail content.

## SSR and prerender rules

The project currently has prerendering enabled.

Therefore:

- Every dynamic route generated from static marker data should be prerender-compatible.
- Route generation should derive URLs from the static TypeScript marker dataset.
- The homepage should prerender with a map fallback and hydrate the interactive map on the client.
- Detail pages should prerender with the selected marker content and a map fallback.
- No SSR code should require browser-only APIs.
- No page should depend on runtime-only remote marker data yet.

If explicit prerender URL generation is needed later, derive it from the same static map data source.

Do not duplicate route lists manually.

## Error handling

If a route references an unknown category or marker slug:

- Return `false` in a route function if validating during route matching.
- Or throw a controlled not-found error from `+data.ts` if resolving there.
- Do not silently show the homepage map for an invalid marker URL.
- Do not select a random fallback marker.

Prefer stable helper functions:

```ts
findCategoryBySlug(categorySlug)
findMapPointBySlug(categorySlug, pointSlug)
findMapPointByRouteParams(routeParams)
getAllMapPoints()
getMapPointRoute(point)
```

## TypeScript rules

- Keep `strict` compatibility.
- Avoid `any`.
- Use readonly tuples for coordinates.
- Keep source data `as const` where helpful.
- Derive union types from source data where practical.
- Prefer small explicit interfaces over overly clever generic types.
- Keep route params typed at the resolver boundary.

Example:

```ts
interface PlaceRouteParams {
  categorySlug?: string
  pointSlug?: string
}
```

Normalize and validate unknown route params before using them.

## Dependency rules

Expected map dependencies:

```sh
pnpm add maplibre-gl
```

Optional later dependencies for clustering:

```sh
pnpm add supercluster use-supercluster @math.gl/web-mercator
pnpm add -D @types/supercluster
```

Do not add Zustand or another global state library for the marker selection flow unless the architecture explicitly changes.

The Next.js starter uses Zustand, but this Vike implementation should intentionally test the route/pageContext-first approach.

## Suggested implementation order

1. Add MapLibre dependency.
2. Create static categories and 30 map points.
3. Create resolver helpers.
4. Add homepage `+data.ts`.
5. Add detail route and `+data.ts`.
6. Add SSR-safe `MapShell` using `clientOnly()`.
7. Add browser-only `MapLibreMap`.
8. Render fullscreen homepage map.
9. Render smaller detail-page map centered on selected marker.
10. Add marker click navigation.
11. Add marker detail page content.
12. Add prerender URL derivation if needed.
13. Add clustering only after the non-clustered route/pageContext flow works.

## Non-goals for the first iteration

Do not implement these unless explicitly requested:

- Remote CMS/API marker loading.
- User-generated markers.
- Authentication.
- Editable marker management UI.
- Persisted map viewport state.
- Zustand/Redux/global state.
- Server-side MapLibre rendering.
- Complex clustering.
- Geolocation.
- Search indexing.
- Offline vector tile hosting.

## Review checklist for agents

Before finishing any implementation work, check:

- Does `pnpm verify` pass?
- Does SSR avoid importing MapLibre directly?
- Does the homepage prerender?
- Do detail pages work on reload?
- Does clicking a marker navigate to a stable route?
- Is selected marker data derived from the route/pageContext/data flow?
- Is the map fullscreen on the homepage?
- Is the map smaller and centered on detail pages?
- Is the static marker dataset the single source of truth?
- Are there no unnecessary global stores?
- Are route functions lightweight?
- Are all coordinates typed as `[lng, lat]`, not `[lat, lng]`?
- Is the architecture still ready for future clustering?

## Preferred tone for future work

When working in this repository, prefer clean, confident architectural changes over quick one-off fixes.

This project is meant to explore a Vike-native way of building a map application. Preserve the idea that the URL and Vike page context describe the selected map state, while the client-only MapLibre component handles browser-side rendering and interaction.
