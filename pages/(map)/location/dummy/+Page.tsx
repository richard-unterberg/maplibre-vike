import { demoLocations } from '@/root/data/demo-locations'

const currentLocation = demoLocations[0]
const nextLocation = demoLocations[1]

const LocationDummyPage = () => {
  return (
    <article className="flex flex-col gap-4 py-6">
      <p className="text-base-muted text-sm">Chemnitz test location</p>
      <h1 className="text-2xl font-bold">{currentLocation.title}</h1>
      <p>{currentLocation.description}</p>
      <dl className="grid gap-2 text-sm">
        <div>
          <dt className="font-semibold">Coordinates</dt>
          <dd className="text-base-muted">{currentLocation.coordinates.join(', ')}</dd>
        </div>
        <div>
          <dt className="font-semibold">Map zoom</dt>
          <dd className="text-base-muted">{currentLocation.zoom}</dd>
        </div>
      </dl>
      <a className="btn btn-primary w-fit" href={nextLocation.route}>
        Open {nextLocation.title}
      </a>
    </article>
  )
}

export default LocationDummyPage
