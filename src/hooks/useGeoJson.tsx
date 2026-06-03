import { useEffect, useState } from "react";
import type { MyGeoJSON } from "../types/properties";

export function useGeoJson() {
  const [geojson, setGeojson] = useState<MyGeoJSON | null>(null);
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

  return { geojson };
}
