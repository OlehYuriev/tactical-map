import Map, {
  type MapLayerMouseEvent,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRef, useState } from "react";
import { useGeoJson } from "../../hooks/useGeoJson";
import type { FeatureInfo } from "../../types/featureInfo";
import { addSidcImages } from "../../utils/addSidcImages";
import type { Properties } from "../../types/properties";
import { MapScene } from "./MapScene";
import type { MapLibreEvent } from "maplibre-gl";

type Props = {
  setSelectedFeature: React.Dispatch<React.SetStateAction<FeatureInfo | null>>;
};

export function MapView({ setSelectedFeature }: Props) {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { geojson } = useGeoJson();
  const mapRef = useRef<MapRef | null>(null);

  const handleMapClick = (e: MapLayerMouseEvent) => {
    const feature = e.features?.[0];
    const map = mapRef.current?.getMap();
    console.log(feature);
    if (!feature || !map) {
      setSelectedFeature(null);
      return;
    }

    if (feature.geometry.type === "Point") {
      const [longitude, latitude] = feature.geometry.coordinates;

      setSelectedFeature({
        longitude,
        latitude,
        properties: feature.properties as Properties,
      });

      mapRef.current?.flyTo({
        center: [longitude, latitude],
        zoom: 10,
      });
    }
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

  async function handleMapLoad(e: MapLibreEvent) {
    const map = e.target;
    if (!geojson) return;
    await addSidcImages(map, geojson);
    setImagesLoaded(true);

    map.setTerrain({
      source: "terrain",
      exaggeration: 1,
    });
    requestIdleCallback(() => {
      map.setTerrain({ source: "terrain", exaggeration: 1 });
    });
  }
  return (
    <Map
      maxZoom={16}
      minZoom={3}
      renderWorldCopies={false}
      ref={mapRef}
      attributionControl={false}
      initialViewState={{
        longitude: 30.5234,
        latitude: 50.4501,
        zoom: 5,
        pitch: 50,
        bearing: -20,
      }}
      interactiveLayerIds={["points-layer", "3d-buildings"]}
      onClick={handleMapClick}
      onMouseMove={handleMapMouseMove}
      onLoad={handleMapLoad}
      style={{ width: "100vw", height: "100vh" }}
      mapStyle="https://tiles.openfreemap.org/styles/bright"
    >
      <MapScene imagesLoaded={imagesLoaded} geojson={geojson} />
    </Map>
  );
}
