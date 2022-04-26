import React, { Suspense, useState } from 'react';
import { renderRoutes } from 'react-router-config';
import { Link } from 'react-router-dom';

import './App.css';
import { routes, ROUTE_PATH } from 'constants/Routes';

const LOCATIONS: Array<{ title: string, center: number[] }> = [{
  title: '210 Hammerking',
  center: [-96.826185, 32.67831]
}, {
  title: '348 Maraca',
  center: [-82.02998, 27.02261]
}, {
  title: '828 Delancey',
  center: [-74.563445, 39.282415]
}, {
  title: '21802 Guadalupe',
  center: [-95.05007, 29.14669]
}, {
  title: '16401 S Pacific',
  center: [-118.06896, 33.7166]
}, {
  title: '4360 Chancellor',
  center: [-84.60966, 42.83416]
}]

function App() {
  const [center, setCenter] = useState(LOCATIONS[0].center);

  return (
    <Suspense fallback={<div />}>

      <div className="App">
        <header style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center' }}>
            {Object.keys(ROUTE_PATH).map((key) => (
              <div key={key} style={{ marginRight: '15px' }}>
                <Link to={ROUTE_PATH[key]}>
                  {key}
                </Link>
              </div>
            ))}
          </div>
          <div style={{ margin: '10px 0' }}>
            {LOCATIONS.map((loc) => (
              <input key={loc.title} type="button" value={loc.title} onClick={() => setCenter(loc.center)} />
            ))}
          </div>
        </header>
      </div>

      {renderRoutes(routes, { center })}

    </Suspense>
  );
}

export default App;
