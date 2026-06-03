export type Properties = {
  sidc: string;
  subsystem?: string;
  moving_status?: string | null;
  discovery_date?: string | null;
  source?: string | null;
  name?: string;
  description?: string;
  place: string;
  MGRS: string;
  military_unit: null | string;
  document_path: string;
  processed_by: string;
  created_at: string;
};

export type MyGeoJSON = GeoJSON.FeatureCollection<GeoJSON.Point, Properties>;
