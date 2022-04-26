import MapboxMap from "components/Mapbox/MapboxMap";
import { FC, useCallback, useState } from "react";

type MapboxProps = {
  center?: number[];
}

const Mapbox: FC<MapboxProps> = (props) => {
  console.log('Mapbox: ', props);

  // configs
  const [showNavidation, setShowNavidation] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [showAttribution, setShowAttribution] = useState(false);
  const [doubleClickZoom, setDoubleClickZoom] = useState(false);
  const [scrollZoom, setScrollZoom] = useState(false);
  const [draggable, setDraggable] = useState(false);

  const [reload, setReload] = useState(false);

  const config = {
    showAttribution,
    showFullScreen,
    showNavidation,
    showScale,
    doubleClickZoom,
    scrollZoom,
    draggable
  }

  const reloadMap = useCallback(() => {
    setReload(true);

    setTimeout(() => {
      setReload(false);
    }, 300)
  }, [])

  return (
    <>
      <h3>Mapbox</h3>
      <button id="mapbox-start-zoom">START ZOOM</button>
      <div>
        <input type="checkbox" id="showNavidation" checked={showNavidation} onChange={(event) => setShowNavidation(event.target.checked)} />
        <label htmlFor="showNavidation">showNavidation</label>

        <input type="checkbox" id="showScale" checked={showScale} onChange={(event) => setShowScale(event.target.checked)} />
        <label htmlFor="showScale">showScale</label>

        <input type="checkbox" id="showFullScreen" checked={showFullScreen} onChange={(event) => setShowFullScreen(event.target.checked)} />
        <label htmlFor="showFullScreen">showFullScreen</label>

        <input type="checkbox" id="showAttribution" checked={showAttribution} onChange={(event) => setShowAttribution(event.target.checked)} />
        <label htmlFor="showAttribution">showAttribution</label>

        <input type="checkbox" id="doubleClickZoom" checked={doubleClickZoom} onChange={(event) => setDoubleClickZoom(event.target.checked)} />
        <label htmlFor="doubleClickZoom">doubleClickZoom</label>

        <input type="checkbox" id="scrollZoom" checked={scrollZoom} onChange={(event) => setScrollZoom(event.target.checked)} />
        <label htmlFor="scrollZoom">scrollZoom</label>

        <input type="checkbox" id="draggable" checked={draggable} onChange={(event) => setDraggable(event.target.checked)} />
        <label htmlFor="draggable">draggable</label>

        <button onClick={reloadMap}>Reload map with changes</button>

      </div>

      {!reload && (
        <MapboxMap
          center={props.center}
          config={config}
        />
      )}
    </>
  )
}

export default Mapbox;
