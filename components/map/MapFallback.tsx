const MapFallback = () => {
  return (
    <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-muted">
      <div className="loading loading-spinner loading-lg" role="status">
        <span className="sr-only">Loading map</span>
      </div>
    </div>
  )
}

export default MapFallback
