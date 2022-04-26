/// <reference types="@types/bingmaps" />
/// <reference types="bingmaps" />
import 'bingmaps';

import { FC, useCallback, useEffect, useRef, useState } from "react";
import { loadBingApi } from "services/BingMapLoader";

const TARGET_ZOOM = 19;

interface IBingMapProps {
  center: { lat: number, lng: number };
  settings: Microsoft.Maps.IMapOptions;
  startZoom: number;
}

const BingMap: FC<IBingMapProps> = ({ center, settings, startZoom }) => {
  console.log('center: ', center)
  const mapRef = useRef<HTMLDivElement>(null);

  const [mapApi, setMapApi] = useState<Microsoft.Maps.Map>();
  const [zoom, setZoom] = useState(startZoom); // initial zoom
  const [marker, setMarker] = useState<Microsoft.Maps.Pushpin>();

  const initMap = useCallback(() => {
    console.log('initMap')
    const map = new Microsoft.Maps.Map(mapRef.current as HTMLElement, {
      navigationBarOrientation: Microsoft.Maps.NavigationBarOrientation.vertical,
      navigationBarMode: Microsoft.Maps.NavigationBarMode.compact,
      showDashboard: true,
      disableBirdseye: true,
      disableStreetside: true,
      disableStreetsideAutoCoverage: true,
      disableKeyboardInput: true,
      showLocateMeButton: false,
      disableMapTypeSelectorMouseOver: true,
      showTrafficButton: false,
      allowHidingLabelsOfRoad: true
    });

    map.setView({
      mapTypeId: Microsoft.Maps.MapTypeId.aerial,
      zoom,
    });

    // @ts-ignore // TODO
    window.qwe = map;

    setMapApi(map);

    return map;
  }, [zoom])

  useEffect(() => {
    if (mapApi) {
      console.log('set options: ', settings)
      mapApi.setOptions(settings);
    }
  }, [mapApi, settings])

  useEffect(() => {
    loadBingApi('test')
      .then(() => {
        initMap();
      });
  }, [initMap]);

  useEffect(() => {
    if (mapApi) {
      const centerLocation = new Microsoft.Maps.Location(center.lat, center.lng);
      mapApi.setView({
        center: centerLocation,
        // @ts-ignore
        animate: true,
        zoom: startZoom
      });
      setZoom(startZoom);

      if (!marker) {
        var pushpin = new Microsoft.Maps.Pushpin(centerLocation);
        mapApi.entities.push(pushpin);
        setMarker(pushpin);
      }
    }
  }, [center, mapApi, marker, startZoom])

  useEffect(() => {
    if (marker) {
      marker.setLocation(new Microsoft.Maps.Location(center.lat, center.lng));
    }
  }, [marker, center])

  useEffect(() => {
    if (mapApi) {
      document.getElementById('bing-map-start-zoom')?.addEventListener('click', () => {
        animateMapZoomTo(mapApi, TARGET_ZOOM, undefined); // TODO: undef again
      })
    }
  }, [mapApi])

  return (
    <div ref={mapRef} className="map" style={{ height: '500px' }} />
  )
}

function animateMapZoomTo(map: Microsoft.Maps.Map, targetZoom: number, commandedZoom) {
  console.log("animateMapZoomTo(" + targetZoom + ") @" + map.getZoom());
  var currentZoom = commandedZoom || map.getZoom();
  if (currentZoom != targetZoom) {

    // Microsoft.Maps.Events.addHandler(map, 'viewchangeend', () => {
    //   animateMapZoomTo(map, targetZoom, currentZoom + (targetZoom > currentZoom ? 1 : -1));
    // });

    setTimeout(function () {
      map.setView({
        center: map.getCenter(),
        zoom: currentZoom + (targetZoom > currentZoom ? 2 : -2),
        // @ts-ignore
        animate: true
      });
      animateMapZoomTo(map, targetZoom, currentZoom + (targetZoom > currentZoom ? 2 : -2));
    }, 150);
  }
}

export default BingMap;
