import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { isLatLngLiteral } from "@googlemaps/typescript-guards";
import { createCustomEqual } from "fast-equals";
import React, { useEffect, useState } from "react";
import { FC } from "react";

const START_ZOOM = 5;
const TARGET_ZOOM = 19;

type GoogleMapProps = {
  center?: number[];
}

const GoogleMap: FC<GoogleMapProps> = (props) => {
  console.log('Google map: ', props);

  const [isStarted, setStarted] = useState(true);

  const [startZoom, setStartZooom] = useState(START_ZOOM);

  const [zoom, setZoom] = React.useState(START_ZOOM); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: props?.center?.[1] || 0,
    lng: props?.center?.[0] || 0,
  });

  // options state
  const [clickableIcons] = useState(false);
  const [disableDefaultUI] = useState(false);
  const [disableDoubleClickZoom] = useState(true);
  const [fullscreenControl, setFullscreenControl] = useState(false);
  const [isFractionalZoomEnabled] = useState(true); // TODO: investigate
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(false);
  const [mapTypeControl] = useState(false);
  const [noClear] = useState(false);
  const [panControl] = useState(false);
  const [rotateControl] = useState(false);
  const [scaleControl, setScaleControl] = useState(false);
  const [scrollwheel] = useState(false);
  const [streetViewControl] = useState(false);
  const [zoomControl, setZoomControl] = useState(false);
  const [draggable, setDraggable] = useState(false);

  // end of options state

  useEffect(() => {
    setCenter({
      lat: props?.center?.[1] || 0,
      lng: props?.center?.[0] || 0,
    });
    setZoom(startZoom);
  }, [props?.center, startZoom])

  const checkboxOptions: google.maps.MapOptions = {
    clickableIcons,
    disableDefaultUI,
    disableDoubleClickZoom,
    fullscreenControl,
    isFractionalZoomEnabled,
    keyboardShortcuts,
    mapTypeControl,
    noClear,
    panControl,
    rotateControl,
    scaleControl,
    scrollwheel,
    streetViewControl,
    zoomControl,
    gestureHandling: draggable ? 'cooperative' : 'none'
  }

  return (
    <>
      <h3>Google map</h3>
      <button id="google-map-start-zoom" onClick={() => setStarted(true)}>START ZOOM</button>
      <div>
        <label htmlFor="startZoom">startZoom</label>
        <input type="number" value={startZoom} id="startZoom" min={1} max={18} onChange={(event) => setStartZooom(Number(event.target.value))} />

        <input type="checkbox" id="draggable" checked={draggable} onChange={(event) => setDraggable(event.target.checked)} />
        <label htmlFor="draggable">draggable</label>

        <input type="checkbox" id="fullscreenControl" checked={fullscreenControl} onChange={(event) => setFullscreenControl(event.target.checked)} />
        <label htmlFor="fullscreenControl">fullscreenControl</label>

        <input type="checkbox" id="keyboardShortcuts" checked={keyboardShortcuts} onChange={(event) => setKeyboardShortcuts(event.target.checked)} />
        <label htmlFor="keyboardShortcuts">keyboardShortcuts</label>

        <input type="checkbox" id="scaleControl" checked={scaleControl} onChange={(event) => setScaleControl(event.target.checked)} />
        <label htmlFor="scaleControl">scaleControl</label>

        <input type="checkbox" id="zoomControl" checked={zoomControl} onChange={(event) => setZoomControl(event.target.checked)} />
        <label htmlFor="zoomControl">zoomControl</label>
      </div>

      <div style={{ position: 'relative' }}>
        <video
          style={{
            display: isStarted ? 'none' : 'block',
            position: 'absolute',
            zIndex: 100,
            top: 0,
            left: 0,
            height: 'auto'
          }}
          autoPlay
          playsInline={false}
          controls={false}
          data-automation="VideoPlayer"
          height="100%"
          loop={true}
          muted={true}
          width="100%"
          poster="https://ak.picdn.net/shutterstock/videos/1058586025/thumb/10.jpg">
          <source
            src="https://ak.picdn.net/shutterstock/videos/1058586025/preview/stock-footage-global-network-connection-and-data-connections-concept-communication-technology-global-world.webm"
            type="video/webm"
          />
          <source
            src="https://ak.picdn.net/shutterstock/videos/1058586025/preview/stock-footage-global-network-connection-and-data-connections-concept-communication-technology-global-world.mp4"
            type="video/mp4"
          />

        </video>

        <div style={{ display: "flex", height: "500px" }}>
          <Wrapper apiKey='' render={render} language='en-US'>
            <Map
              center={center}
              zoom={zoom}
              style={{ flexGrow: "1", height: "100%" }}
              mapTypeId='satellite'
              checkboxOptions={checkboxOptions}
            >
            </Map>
          </Wrapper>
        </div>
      </div>
    </>
  );
}


const render = (status: Status) => {
  return <h1>{status}</h1>;
};



interface MapProps extends google.maps.MapOptions {
  children: any; // TODO
  style: { [key: string]: string };
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onIdle?: (map: google.maps.Map) => void;
  checkboxOptions: google.maps.MapOptions;
}

const Map: React.FC<MapProps> = ({
  onClick,
  onIdle,
  children,
  style,
  checkboxOptions,
  ...options
}) => {
  const ref = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map>();
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => { // TODO: outdated method
    google.maps.event.addDomListener(document.getElementById('google-map-start-zoom') as HTMLElement, 'click', function () {
      animateMapZoomTo(map, TARGET_ZOOM, undefined); // TODO: undef
    })
  }, [map])

  useEffect(() => {
    if (ref.current && !map) {
      const newMap = new window.google.maps.Map(ref.current, {}); // TODO: rename, actually not new
      newMap.setOptions(checkboxOptions);
      setMap(newMap);

      const marker = new google.maps.Marker({
        map: newMap,
        position: options.center
      });

      setMarker(marker)
    }
  }, [ref, map, options.center, checkboxOptions]);

  useEffect(() => {
    if (map) {
      map.setOptions(checkboxOptions);
    }
  }, [checkboxOptions, map])

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  React.useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);

  useEffect(() => {
    if (marker) {
      marker.setPosition(options.center);
    }
  }, [marker, options.center])

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component 
          return React.cloneElement(child, {
            // @ts-ignore // TODO
            map
          });
        }
      })}
    </>
  );
};


const deepCompareEqualsForMaps = createCustomEqual(
  (deepEqual) => (a: any, b: any) => {
    if (
      isLatLngLiteral(a) ||
      a instanceof google.maps.LatLng ||
      isLatLngLiteral(b) ||
      b instanceof google.maps.LatLng
    ) {
      return new google.maps.LatLng(a).equals(new google.maps.LatLng(b));
    }

    // TODO extend to other types

    // use fast-equals for other objects
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value: any) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback: React.EffectCallback,
  dependencies: any[]
) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}





// ANIMATION START

// the smooth zoom function
function animateMapZoomTo(map, targetZoom, commandedZoom) {
  console.log("animateMapZoomTo(" + targetZoom + ") @" + map.getZoom());
  var currentZoom = commandedZoom || map.getZoom();
  if (currentZoom != targetZoom) {
    google.maps.event.addListenerOnce(map, 'zoom_changed', function (event) {
      animateMapZoomTo(map, targetZoom, currentZoom + (targetZoom > currentZoom ? 1 : -1));
    });
    setTimeout(function () {
      map.setZoom(currentZoom + (targetZoom > currentZoom ? 1 : -1))
    }, 250);
  }
}


export default GoogleMap;
