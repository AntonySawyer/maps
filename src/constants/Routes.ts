import { lazy } from 'react';
import { RouteConfig } from 'react-router-config';

export enum ROUTE_PATH {
  GOOGLE = '/google-map',
  BING = '/bing-map',
  MAPBOX = '/mapbox'
}

type RouteExtendedConfig = RouteConfig & {}

export const routes: RouteExtendedConfig[] = [
  {
    path: [
      ROUTE_PATH.GOOGLE,
    ],
    component: lazy(() => import('pages/GoogleMap')),
    exact: true,
  },
  {
    path: [
      ROUTE_PATH.BING,
    ],
    component: lazy(() => import('pages/BingMap')),
    exact: true,
  },
  {
    path: [
      ROUTE_PATH.MAPBOX,
    ],
    component: lazy(() => import('pages/Mapbox')),
    exact: true,
  },
];
