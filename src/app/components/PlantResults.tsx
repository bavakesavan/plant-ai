import { PlantInfo } from "../types/plant-info";

export default function PlantResults({ plantInfo }: { plantInfo: PlantInfo }) {

  if (!plantInfo) return null;

  if (plantInfo.scientificName.short.includes("*")) {
    plantInfo.scientificName.short.replace("*", "");
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-50 mb-4">
          {plantInfo.scientificName.short || "Plant Identified"}
        </h2>
        <p className="text-xl text-gray-300 mb-2">
          <strong>Common Name:</strong> {plantInfo.commonName.short || "Unknown"}
        </p>
        <p className="text-xl text-gray-300 mb-2">
          <strong>Family:</strong> {plantInfo.family.short || "Unknown"}
        </p>
        <p className="text-gray-400 mb-4 text-lg font-semibold py-6">
          {plantInfo.description.detailed || "No description available."}
        </p>
      </div>
    </div>
  );
}
