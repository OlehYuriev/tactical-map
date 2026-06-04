import type { FeatureInfo } from "../../types/featureInfo";

type PopupInfo = {
  feature: FeatureInfo;
};
export function FeatureDetails({ feature }: PopupInfo) {
  return (
    <>
      <h2>{feature.properties?.name ?? "No name"}</h2>

      <p>
        <strong>Description:</strong>
        <br />
        {feature.properties?.description ?? "No description"}
      </p>

      <p>
        <strong>Place:</strong>
        <br />
        {feature.properties?.place ?? "No place"}
      </p>
      <p>
        <strong>Subsystem:</strong>
        <br />
        {feature.properties?.subsystem ?? "No subsystem"}
      </p>
      <p>
        <strong>MGRS:</strong>
        <br />
        {feature.properties?.MGRS ?? "No MGRS"}
      </p>

      <p>
        <strong>Created:</strong>
        <br />
        {feature.properties?.created_at ?? "No date"}
      </p>
    </>
  );
}
