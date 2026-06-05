import "maplibre-gl/dist/maplibre-gl.css";
import { useState } from "react";

import { Drawer } from "./components/Drawer";
import type { FeatureInfo } from "./types/featureInfo";
import { FeatureDetails } from "./components/FeatureDetails";
import { MapView } from "./components/MapView";

function App() {
  const [selectedFeature, setSelectedFeature] = useState<FeatureInfo | null>(
    null,
  );

  return (
    <>
      <MapView setSelectedFeature={setSelectedFeature} />

      <Drawer open={!!selectedFeature} onClose={() => setSelectedFeature(null)}>
        {selectedFeature && <FeatureDetails feature={selectedFeature} />}
      </Drawer>
    </>
  );
}

export default App;
