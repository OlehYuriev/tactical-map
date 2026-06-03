import Map, {
  Layer,
  Popup,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import type { MyGeoJSON, Properties } from "./types/properties";

function App() {
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    properties: Properties;
  } | null>(null);
  const [geojson, setGeojson] = useState<MyGeoJSON | null>(null);
  const mapRef = useRef<MapRef | null>(null);
  useEffect(() => {
    fetch("./data/output.geojson")
      .then((r) => r.json())
      .then((data: MyGeoJSON) => {
        const normalized: MyGeoJSON = {
          ...data,
          features: data.features.map((f) => ({
            ...f,
            properties: {
              ...f.properties,
              sidc: String(f.properties.sidc),
            },
          })),
        };

        setGeojson(normalized);
      });
  }, []);
  return (
    <>
      <Map
        ref={mapRef}
        attributionControl={false}
        initialViewState={{
          longitude: 30.5234,
          latitude: 50.4501,
          zoom: 12,
        }}
        interactiveLayerIds={["points-layer"]}
        onClick={(e: MapLayerMouseEvent) => {
          const feature = e.features?.[0];

          if (!feature || feature.geometry.type !== "Point") return;

          const [longitude, latitude] = feature.geometry.coordinates;

          setPopupInfo({
            longitude,
            latitude,
            properties: feature.properties as Properties,
          });
          mapRef.current?.flyTo({
            center: [longitude, latitude],
            zoom: 10,
          });
        }}
        onLoad={() => {
          console.log("Map loaded");
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
      >
        {geojson && (
          <Source id="points" type="geojson" data={geojson}>
            <Layer
              id="points-layer"
              type="circle"
              paint={{
                "circle-radius": 6,
                "circle-color": "#ff4d4d",
                "circle-stroke-width": 1,
                "circle-stroke-color": "#fff",
              }}
            />
          </Source>
        )}

        {popupInfo && (
          <Popup
            longitude={popupInfo.longitude}
            latitude={popupInfo.latitude}
            anchor="bottom"
            onClose={() => setPopupInfo(null)}
          >
            <div style={{ maxWidth: 250 }}>
              <b>{popupInfo.properties?.name}</b>
              <div>{popupInfo.properties?.description}</div>
              <div>{popupInfo.properties?.place}</div>
            </div>
          </Popup>
        )}
      </Map>
    </>
  );
}

export default App;
