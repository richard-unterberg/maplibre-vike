import type { Coordinates } from '@/components/map/map-types'
import type { LocaleString } from '@/data/i18n'

export const MAP_CATEGORIES = [
  {
    description: {
      de: 'Museen, Theater, Kunst im oeffentlichen Raum und kulturelle Wahrzeichen.',
      en: 'Museums, theaters, public art, and cultural landmarks.',
    },
    id: 'culture',
    title: {
      de: 'Kultur',
      en: 'Culture',
    },
  },
  {
    description: {
      de: 'Historische Orte, Denkmale und Industrieerbe.',
      en: 'Historic places, monuments, and industrial heritage.',
    },
    id: 'history',
    title: {
      de: 'Geschichte',
      en: 'History',
    },
  },
  {
    description: {
      de: 'Parks, Seen, Waelder, Aussichtspunkte und Orte im Freien.',
      en: 'Parks, lakes, forests, viewpoints, and outdoor places.',
    },
    id: 'nature',
    title: {
      de: 'Natur',
      en: 'Nature',
    },
  },
  {
    description: {
      de: 'Bahnhoefe, Verkehrsknoten, Bruecken und Bewegungsachsen.',
      en: 'Stations, transport hubs, bridges, and movement corridors.',
    },
    id: 'mobility',
    title: {
      de: 'Mobilitaet',
      en: 'Mobility',
    },
  },
  {
    description: {
      de: 'Cafes, Maerkte, Restaurants und lokale Essensorte.',
      en: 'Cafes, markets, restaurants, and local food spots.',
    },
    id: 'food',
    title: {
      de: 'Essen',
      en: 'Food',
    },
  },
  {
    description: {
      de: 'Campusse, Coworking-Orte, Bibliotheken und Lernorte.',
      en: 'Campuses, coworking spaces, libraries, and learning places.',
    },
    id: 'workspace',
    title: {
      de: 'Arbeitsorte',
      en: 'Workspace',
    },
  },
] as const

export type MapCategory = (typeof MAP_CATEGORIES)[number]
export type MapCategoryId = MapCategory['id']

export interface MapMarker {
  categoryIds: readonly [MapCategoryId, ...MapCategoryId[]]
  coordinates: Coordinates
  description: LocaleString
  detailZoom: number
  id: string
  title: LocaleString
}

export const MAP_MARKERS = [
  {
    categoryIds: ['history', 'culture'],
    coordinates: [12.9252, 50.8342],
    description: {
      de: 'Großes Denkmal zu Ehren von Karl Marx, einem der berühmtesten Söhne der Stadt.',
      en: 'Larg monument honoring Karl Marx, one of the city’s most famous sons.',
    },
    detailZoom: 15,
    id: 'karl-marx-monument',
    title: {
      de: 'Karl-Marx-Monument',
      en: 'Karl Marx Monument',
    },
  },
  {
    categoryIds: ['culture', 'history'],
    coordinates: [12.9259, 50.8377],
    description: {
      de: 'Kultureller Platz umgeben von Museen, Oper und Theater.',
      en: 'Cultural square surrounded by museums, opera, and theater.',
    },
    detailZoom: 15,
    id: 'theaterplatz',
    title: {
      de: 'Theaterplatz',
      en: 'Theater Square',
    },
  },
  {
    categoryIds: ['nature'],
    coordinates: [12.9139, 50.8413],
    description: {
      de: 'Städtischer See und grüne Erholungsfläche nahe der Chemnitzer Innenstadt.',
      en: 'Urban lake and green recreation area near central Chemnitz.',
    },
    detailZoom: 14,
    id: 'schlossteich',
    title: {
      de: 'Schlossteich',
      en: 'Castle Pond',
    },
  },
  {
    categoryIds: ['history', 'culture'],
    coordinates: [12.9036, 50.8238],
    description: {
      de: 'Industriedenkmal, das die Fertigungsgeschichte von Chemnitz dokumentiert.',
      en: 'Industrial heritage site documenting the manufacturing history of Chemnitz.',
    },
    detailZoom: 15,
    id: 'industrial-museum',
    title: {
      de: 'Industriemuseum',
      en: 'Industrial Museum',
    },
  },
  {
    categoryIds: ['history'],
    coordinates: [12.8998, 50.8339],
    description: {
      de: 'Großes Gründerzeitviertel mit dichter urbaner Architektur.',
      en: 'Large Grunderzeit district with dense urban architecture.',
    },
    detailZoom: 14,
    id: 'kassberg',
    title: {
      de: 'Kassberg',
      en: 'Kassberg',
    },
  },
  {
    categoryIds: ['mobility'],
    coordinates: [12.9303, 50.8395],
    description: {
      de: 'Hauptbahnhof und Mobilitätsknotenpunkt.',
      en: 'Main rail station and mobility hub.',
    },
    detailZoom: 15,
    id: 'main-station',
    title: {
      de: 'Hauptbahnhof',
      en: 'Main Station',
    },
  },
  {
    categoryIds: ['workspace'],
    coordinates: [12.9298, 50.8136],
    description: {
      de: 'Universitätscampus und Lernumgebung.',
      en: 'University campus and learning environment.',
    },
    detailZoom: 15,
    id: 'tu-campus',
    title: {
      de: 'TU Campus',
      en: 'TU Campus',
    },
  },
  {
    categoryIds: ['nature'],
    coordinates: [12.8992, 50.8028],
    description: {
      de: 'Langer grüner Korridor entlang des Chemnitz Flusses.',
      en: 'Long green corridor along the Chemnitz river.',
    },
    detailZoom: 14,
    id: 'stadtpark',
    title: {
      de: 'Stadtpark',
      en: 'City Park',
    },
  },
  {
    categoryIds: ['food', 'history'],
    coordinates: [12.9207, 50.8332],
    description: {
      de: 'Historische Markthalle und food-orientierter urbaner Ort.',
      en: 'Historic market hall and food-oriented urban place.',
    },
    detailZoom: 15,
    id: 'markthalle',
    title: {
      de: 'Markthalle',
      en: 'Market Hall',
    },
  },
  {
    categoryIds: ['workspace', 'history'],
    coordinates: [12.9018, 50.8207],
    description: {
      de: 'Kreativ- und arbeitsplatzorientierter Industriekomplex.',
      en: 'Creative and workspace-oriented industrial complex.',
    },
    detailZoom: 15,
    id: 'wirkbau',
    title: {
      de: 'Wirkbau',
      en: 'Wirkbau',
    },
  },
  {
    categoryIds: ['culture'],
    coordinates: [12.9216, 50.8329],
    description: {
      de: 'Zentrale Kunstsammlungen und Ausstellungsort im Stadtzentrum.',
      en: 'Central art collections and exhibition venue in the city center.',
    },
    detailZoom: 15,
    id: 'kunstsammlungen',
    title: {
      de: 'Kunstsammlungen',
      en: 'Art Collections',
    },
  },
  {
    categoryIds: ['culture', 'workspace'],
    coordinates: [12.9241, 50.833],
    description: {
      de: 'Öffentliche Bibliothek und kultureller Lernraum im Zentrum von Chemnitz.',
      en: 'Public library and cultural learning space in central Chemnitz.',
    },
    detailZoom: 15,
    id: 'stadtbibliothek',
    title: {
      de: 'Stadtbibliothek',
      en: 'City Library',
    },
  },
  {
    categoryIds: ['nature', 'culture'],
    coordinates: [12.9089, 50.852],
    description: {
      de: 'Großer Park und Erholungsgebiet nördlich der Chemnitzer Innenstadt.',
      en: 'Large park and recreation area north of central Chemnitz.',
    },
    detailZoom: 14,
    id: 'kuechwald',
    title: {
      de: 'Küchwald',
      en: 'Kuchwald',
    },
  },
  {
    categoryIds: ['nature', 'history'],
    coordinates: [12.8154, 50.8331],
    description: {
      de: 'Kleines Schloss und lokales Naturziel in der Nähe von Chemnitz.',
      en: 'Small castle and local nature destination near Chemnitz.',
    },
    detailZoom: 14,
    id: 'rabenstein-castle',
    title: {
      de: 'Burg Rabenstein',
      en: 'Rabenstein Castle',
    },
  },
  {
    categoryIds: ['nature'],
    coordinates: [12.7976, 50.8274],
    description: {
      de: 'Stausee und bewaldetes Erholungsgebiet am westlichen Rand von Chemnitz.',
      en: 'Reservoir and forested recreation area at the western edge of Chemnitz.',
    },
    detailZoom: 13,
    id: 'rabenstein-reservoir',
    title: {
      de: 'Stausee Rabenstein',
      en: 'Rabenstein Reservoir',
    },
  },
  {
    categoryIds: ['history', 'culture'],
    coordinates: [12.9511, 50.8276],
    description: {
      de: 'Historisches Schloss und Museum über dem Chemnitz Fluss.',
      en: 'Historic castle complex and museum above the Chemnitz river.',
    },
    detailZoom: 15,
    id: 'schlossbergmuseum',
    title: {
      de: 'Schlossbergmuseum',
      en: 'Schlossberg Museum',
    },
  },
  {
    categoryIds: ['mobility', 'nature'],
    coordinates: [12.9125, 50.8299],
    description: {
      de: 'Flusskorridor und urbaxe Bewegungsachse durch das zentrale Chemnitz.',
      en: 'River corridor and urban movement axis through central Chemnitz.',
    },
    detailZoom: 14,
    id: 'chemnitz-river',
    title: {
      de: 'Chemnitz Fluss',
      en: 'Chemnitz River',
    },
  },
  {
    categoryIds: ['culture', 'food'],
    coordinates: [12.9237, 50.8322],
    description: {
      de: 'Zentraler Platz für Märkte, Veranstaltungen und alltägliches Stadtleben.',
      en: 'Central square for markets, civic events, and everyday city life.',
    },
    detailZoom: 15,
    id: 'markt',
    title: {
      de: 'Markt',
      en: 'Market Square',
    },
  },
  {
    categoryIds: ['workspace', 'culture'],
    coordinates: [12.905, 50.822],
    description: {
      de: 'Ehemaliges Industriegebiet mit kreativer Nachnutzung und Veranstaltungsflächen.',
      en: 'Former industrial area with creative reuse and event spaces.',
    },
    detailZoom: 15,
    id: 'spinnerei',
    title: {
      de: 'Spinnerei',
      en: 'Spinnerei',
    },
  },
  {
    categoryIds: ['mobility', 'history'],
    coordinates: [12.9168, 50.8295],
    description: {
      de: 'Historischer Straßenbahn- und Busknotenpunkt nahe dem Stadtzentrum.',
      en: 'Historic tram and bus interchange near the city center.',
    },
    detailZoom: 15,
    id: 'zentralhaltestelle',
    title: {
      de: 'Zentralhaltestelle',
      en: 'Central Station',
    },
  },
  {
    categoryIds: ['food', 'culture'],
    coordinates: [12.9197, 50.8318],
    description: {
      de: 'Kompakte Innenstadtpassage mit Cafés, Geschäften und alltäglichen Dienstleistungen.',
      en: 'Compact city center passage with cafes, shops, and everyday services.',
    },
    detailZoom: 15,
    id: 'rosenhof',
    title: {
      de: 'Rosenhof',
      en: 'Rosenhof',
    },
  },
  {
    categoryIds: ['nature', 'workspace'],
    coordinates: [12.9334, 50.8062],
    description: {
      de: 'Grünes campusnahes Viertel mit studentischem Leben und lokalen Wegen.',
      en: 'Green campus-adjacent district with student life and local routes.',
    },
    detailZoom: 14,
    id: 'reichenhain-campus-edge',
    title: {
      de: 'Reichenhain Campusrand',
      en: 'Reichenhain Campus Edge',
    },
  },
] as const satisfies readonly MapMarker[]
