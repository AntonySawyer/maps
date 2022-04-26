import BingMapFC from "components/Bing/BingMapFC";
import { FC, useCallback, useEffect, useState } from "react";


const START_ZOOM = 5;

type BingMapProps = {
  center?: number[];
}

const BingMap: FC<BingMapProps> = (props) => {
  console.log('Bing map: ', props);
  const [center, setCenter] = useState<{ lat: number, lng: number }>({
    lat: props?.center?.[1] || 0,
    lng: props?.center?.[0] || 0,
  });

  const [reload, setReload] = useState(false);

  // start configs
  const [showMapTypeSelector, setShowMapTypeSelector] = useState(false);

  // need full rerender
  const [showLogo, setShowLogo] = useState(false);

  const [disablePanning, setDisablePanning] = useState(false);
  const [disableScrollWheelZoom, setDisableScrollWheelZoom] = useState(false);
  const [disableZooming, setDisableZooming] = useState(false);
  const [enableClickableLogo, setEnableClickableLogo] = useState(false);
  const [showBreadcrumb, setShowBreadcrumb] = useState(false);
  const [showScalebar, setShowScalebar] = useState(false);
  const [showTermsLink, setShowTermsLink] = useState(false);
  const [showZoomButtons, setShowZoomButtons] = useState(false);
  // end configs

  useEffect(() => {
    setCenter({
      lat: props?.center?.[1] || 0,
      lng: props?.center?.[0] || 0
    })
  }, [props?.center])

  const settings = {
    showLogo,
    showMapTypeSelector,
    disablePanning,
    disableScrollWheelZoom,
    disableZooming,
    enableClickableLogo,
    showBreadcrumb,
    showScalebar,
    showTermsLink,
    showZoomButtons,
  }

  const reloadMap = useCallback(() => {
    setReload(true);

    setTimeout(() => {
      setReload(false);
    }, 300)
  }, [])

  return (
    <>
      <h3>Bing map</h3>
      <button id="bing-map-start-zoom">START ZOOM</button>

      <div>
        <input type="checkbox" id="showLogo" checked={showLogo} onChange={(event) => setShowLogo(event.target.checked)} />
        <label htmlFor="showLogo">showLogo</label>

        <input type="checkbox" id="showMapTypeSelector" checked={showMapTypeSelector} onChange={(event) => setShowMapTypeSelector(event.target.checked)} />
        <label htmlFor="showMapTypeSelector">showMapTypeSelector</label>

        <input type="checkbox" id="disablePanning" checked={disablePanning} onChange={(event) => setDisablePanning(event.target.checked)} />
        <label htmlFor="disablePanning">not draggable</label>

        <input type="checkbox" id="disableScrollWheelZoom" checked={disableScrollWheelZoom} onChange={(event) => setDisableScrollWheelZoom(event.target.checked)} />
        <label htmlFor="disableScrollWheelZoom">disableScrollWheelZoom</label>

        <input type="checkbox" id="disableZooming" checked={disableZooming} onChange={(event) => setDisableZooming(event.target.checked)} />
        <label htmlFor="disableZooming">disableZooming</label>

        <input type="checkbox" id="enableClickableLogo" checked={enableClickableLogo} onChange={(event) => setEnableClickableLogo(event.target.checked)} />
        <label htmlFor="enableClickableLogo">enableClickableLogo</label>

        <input type="checkbox" id="showBreadcrumb" checked={showBreadcrumb} onChange={(event) => setShowBreadcrumb(event.target.checked)} />
        <label htmlFor="showBreadcrumb">showBreadcrumb</label>

        <input type="checkbox" id="showScalebar" checked={showScalebar} onChange={(event) => setShowScalebar(event.target.checked)} />
        <label htmlFor="showScalebar">showScalebar</label>

        <input type="checkbox" id="showTermsLink" checked={showTermsLink} onChange={(event) => setShowTermsLink(event.target.checked)} />
        <label htmlFor="showTermsLink">showTermsLink</label>

        <input type="checkbox" id="showZoomButtons" checked={showZoomButtons} onChange={(event) => setShowZoomButtons(event.target.checked)} />
        <label htmlFor="showZoomButtons">showZoomButtons</label>

        <button onClick={reloadMap}>Reload map with changes</button>

      </div>

      {!reload && (
        <BingMapFC
          center={center}
          settings={settings}
          startZoom={START_ZOOM}
        />
      )}
    </>)
}

export default BingMap;
