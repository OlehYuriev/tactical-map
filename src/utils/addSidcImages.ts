import type { MyGeoJSON } from "../types/properties";
import ms from "milsymbol";

export async function addSidcImages(map: maplibregl.Map, geojson: MyGeoJSON) {
  const uniqueSidcs = [
    ...new Set(geojson.features.map((f) => f.properties.sidc)),
  ];

  await Promise.all(
    uniqueSidcs.map((sidc) => {
      if (map.hasImage(sidc)) return Promise.resolve();

      return new Promise<void>((resolve, reject) => {
        const symbol = new ms.Symbol(sidc, { size: 40 });
        const svg = symbol.asSVG();
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);

        const img = new Image();
        img.onload = () => {
          map.addImage(sidc, img);
          URL.revokeObjectURL(url);
          resolve();
        };
        img.onerror = reject;
        img.src = url;
      });
    }),
  );
}
