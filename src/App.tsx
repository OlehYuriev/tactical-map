import Map, {
  Layer,
  Source,
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRef, useState } from "react";
import type { Properties } from "./types/properties";

import { useGeoJson } from "./hooks/useGeoJson";
import { addSidcImages } from "./utils/addSidcImages";
import { Drawer } from "./components/Drawer";
import type { FeatureInfo } from "./types/featureInfo";
import { FeatureDetails } from "./components/FeatureDetails";

function App() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureInfo | null>(
    null,
  );
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { geojson } = useGeoJson();
  const mapRef = useRef<MapRef | null>(null);

  const handleMapClick = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];

    if (!feature || feature.geometry.type !== "Point") {
      setSelectedFeature(null);
      return;
    }

    const [longitude, latitude] = feature.geometry.coordinates;

    const newPopup = {
      longitude,
      latitude,
      properties: feature.properties as Properties,
    };
    setSelectedFeature(newPopup);
    mapRef.current?.flyTo({
      center: [longitude, latitude],
      zoom: 10,
    });
  };

  function handleMapMouseMove(e: MapLayerMouseEvent) {
    const map = mapRef.current?.getMap();

    if (!map) return;
    const canvas = map.getCanvas();
    const cursor = e.features?.length ? "pointer" : "";
    if (canvas.style.cursor !== cursor) {
      canvas.style.cursor = cursor;
    }
  }

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
        onClick={(e) => handleMapClick(e)}
        onMouseMove={(e) => handleMapMouseMove(e)}
        onLoad={async (e) => {
          const map = e.target;
          if (!geojson) return;
          await addSidcImages(map, geojson);
          setImagesLoaded(true);
        }}
        style={{ width: "100vw", height: "100vh" }}
        mapStyle="https://tiles.openfreemap.org/styles/bright"
      >
        {geojson && imagesLoaded && (
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
      </Map>

      <Drawer open={!!selectedFeature} onClose={() => setSelectedFeature(null)}>
        {selectedFeature && <FeatureDetails feature={selectedFeature} />}
      </Drawer>
    </>
  );
}

export default App;
