import type { MyGeoJSON } from "../types/properties";
import ms from "milsymbol";

export function addSidcImages(map: maplibregl.Map, geojson: MyGeoJSON) {
  const uniqueSidcs = [
    ...new Set(geojson.features.map((f) => f.properties.sidc)),
  ];

  uniqueSidcs.forEach((sidc) => {
    if (map.hasImage(sidc)) return;

    const symbol = new ms.Symbol(sidc, { size: 40 });
    const svg = symbol.asSVG();

    const blob = new Blob([svg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const img = new Image();

    img.onload = () => {
      map.addImage(sidc, img);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  });
}
