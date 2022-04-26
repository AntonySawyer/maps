import 'mapbox-gl/dist/mapbox-gl.css';

import mapboxgl from 'mapbox-gl';
import { useRef, useCallback, FC, useState, useEffect } from 'react';
import Map, { MapRef } from 'react-map-gl';

const START_ZOOM = 5;
const TARGET_ZOOM = 19;
const MAPBOX_TOKEN = 'pk.eyJ1IjoiZG1hc29uNTgiLCJhIjoiY2tzbzVtOWQ4MGhnczJvbXozb2liOHloYiJ9.PJ1RkQHT0bdSZGdXAsISWw'; // Set your mapbox token here

type MapboxMapProps = {
  center?: number[];
  config: {
    showAttribution: boolean;
    showFullScreen: boolean;
    showNavidation: boolean;
    showScale: boolean;
    doubleClickZoom: boolean;
    scrollZoom: boolean;
    draggable: boolean;
  }
}

const MapboxMap: FC<MapboxMapProps> = (props) => {
  const mapRef = useRef<MapRef>();

  const [mapApi, setMapApi] = useState<mapboxgl.Map>();
  const [center, setCenter] = useState<{ lat: number, lng: number }>({
    lat: props?.center?.[1] || 0,
    lng: props?.center?.[0] || 0,
  });

  const [marker, setMarker] = useState<mapboxgl.Marker>();

  useEffect(() => {
    if (mapApi && !marker) {
      const marker = new mapboxgl.Marker()
        .setLngLat([props?.center?.[0] || 0, props?.center?.[1] || 0])
        .addTo(mapApi);

      setMarker(marker);
    }
  }, [mapApi, marker, props?.center])

  useEffect(() => {
    if (marker) {
      marker.setLngLat({ lng: props?.center?.[0] || 0, lat: props?.center?.[1] || 0 });
    }
  }, [props.center, marker])

  const initialViewState = {
    latitude: center.lat,
    longitude: center.lng,
    zoom: START_ZOOM,
    bearing: 0,
    pitch: 0,
    marker,
  };

  useEffect(() => {
    setCenter({
      lat: props?.center?.[1] || 0,
      lng: props?.center?.[0] || 0,
    })
  }, [props?.center])

  useEffect(() => {
    mapRef.current?.flyTo({
      zoom: START_ZOOM,
      center,
      duration: 500
    })
  }, [center])

  const onZoom = useCallback(() => {
    mapRef.current?.flyTo({
      center: [center.lng, center.lat],
      zoom: TARGET_ZOOM,
      animate: true,
      duration: 1000,
    });
  }, [center.lat, center.lng]);

  useEffect(() => {
    document.getElementById('mapbox-start-zoom')?.addEventListener('click', onZoom)
  }, [onZoom])

  const handleApiReady = useCallback(() => {
    const mapRefApi = mapRef.current?.getMap();
    setMapApi(mapRefApi);
    props.config.showNavidation && mapRefApi!.addControl(new mapboxgl.NavigationControl());
    props.config.showScale && mapRefApi!.addControl(new mapboxgl.ScaleControl());
    props.config.showFullScreen && mapRefApi!.addControl(new mapboxgl.FullscreenControl());
    props.config.showAttribution && mapRefApi!.addControl(new mapboxgl.AttributionControl({ customAttribution: 'custom attribution' }));
    !props.config.doubleClickZoom && mapRefApi?.doubleClickZoom.disable();
    !props.config.scrollZoom && mapRefApi?.scrollZoom.disable();
    mapRefApi?.dragRotate.disable();
    !props.config.draggable && mapRefApi?.dragPan.disable();
  }, [props.config])

  return (
    <>
      <Map
        // @ts-ignore
        ref={mapRef}
        onLoad={handleApiReady}
        initialViewState={initialViewState}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={MAPBOX_TOKEN}
        style={{
          height: '500px'
        }}
        attributionControl={false}
      />
    </>
  );
}

export default MapboxMap;
