import { Layer, Source } from "react-map-gl/maplibre";
import type { MyGeoJSON } from "../../types/properties";

const TERRAIN_TILES = [
  "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
];
const TERRAIN_SOURCE_PROPS = {
  type: "raster-dem" as const,
  tiles: TERRAIN_TILES,
  tileSize: 256,
  encoding: "terrarium" as const,
  minzoom: 10,
  maxzoom: 14,
};

type Props = {
  geojson: MyGeoJSON | null;
  imagesLoaded: boolean;
};
export function MapScene({ geojson, imagesLoaded }: Props) {
  return (
    <>
      <Source id="terrain" {...TERRAIN_SOURCE_PROPS} />
      <Source id="terrain-hillshade" {...TERRAIN_SOURCE_PROPS}>
        <Layer
          id="hillshade"
          type="hillshade"
          source="terrain-hillshade"
          minzoom={10}
          paint={{
            "hillshade-exaggeration": 0.8,
            "hillshade-shadow-color": "#1f1f1f",
            "hillshade-highlight-color": "#ffffff",
            "hillshade-accent-color": "#888888",
            "hillshade-illumination-direction": 315,
            "hillshade-illumination-anchor": "map",
          }}
        />
      </Source>
      <Layer
        id="forest"
        source="openmaptiles"
        source-layer="landcover"
        type="fill"
        filter={["in", ["get", "class"], ["literal", ["wood", "forest"]]]}
        paint={{
          "fill-color": "#3f7f3f",
          "fill-opacity": 0.7,
        }}
      />
      <Layer
        id="3d-buildings"
        source="openmaptiles"
        source-layer="building"
        type="fill-extrusion"
        minzoom={14}
        paint={{
          "fill-extrusion-color": "#d0d0d0",
          "fill-extrusion-height": ["coalesce", ["get", "render_height"], 0],
          "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
          "fill-extrusion-opacity": 1,
        }}
      />
      {geojson && imagesLoaded && (
        <Source id="points" type="geojson" data={geojson}>
          <Layer
            id="points-layer"
            type="symbol"
            layout={{
              "icon-image": ["get", "sidc"],
              "icon-size": 0.8,
              "icon-allow-overlap": false,
              "icon-ignore-placement": true,
            }}
          />
        </Source>
      )}
    </>
  );
}
