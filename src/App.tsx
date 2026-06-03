import Map, {
  Layer,
  Popup,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRef, useState } from "react";
import type { Properties } from "./types/properties";

import { useGeoJson } from "./hooks/useGeoJson";
import { addSidcImages } from "./utils/addSidcImages";

type PopupInfo = {
  longitude: number;
  latitude: number;
  properties: Properties;
} | null;

function App() {
  const [popupInfo, setPopupInfo] = useState<PopupInfo>(null);
  const { geojson } = useGeoJson();
  const mapRef = useRef<MapRef | null>(null);

  return (
    <>
      <Map
        ref={mapRef}
        attributionControl={false}
        initialViewState={{
          longitude: 30.5234,
          latitude: 50.4501,
          zoom: 5,
        }}
        interactiveLayerIds={["points-layer"]}
        onClick={(e: MapLayerMouseEvent) => {
          const feature = e.features?.[0];
          console.log(e.features);
          if (!feature || feature.geometry.type !== "Point") return;

          const [longitude, latitude] = feature.geometry.coordinates;

          const newPopup = {
            longitude,
            latitude,
            properties: feature.properties as Properties,
          };
          setPopupInfo(newPopup);
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 10,
          });
        }}
        onLoad={(e) => {
          console.log("Map loaded");
          const map = e.target;

          if (!geojson) return;

          addSidcImages(map, geojson);
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
      >
        {geojson && (
          <Source id="points" type="geojson" data={geojson}>
            <Layer
              id="points-layer"
              type="symbol"
              layout={{
                "icon-image": ["get", "sidc"],
                "icon-size": 0.8,
                "icon-allow-overlap": true,
              }}
            />
          </Source>
        )}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            maxWidth="450px"
            onClose={() => setPopupInfo(null)}
          >
            <div>
              <b>{popupInfo.properties?.name}</b>
              <br />
              <div>{popupInfo.properties?.description}</div>
              <br />
              <div>{popupInfo.properties?.place}</div>
              <br />
              <div>{popupInfo.properties?.MGRS}</div>
              <br />
              <div>{popupInfo.properties?.created_at}</div>
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
}

export default App;
