import { PlantInfo } from "../types/plant-info";
import { FaSun, FaCloudSun, FaCloud } from "react-icons/fa";
import { WiThermometer, WiRaindrop } from "react-icons/wi";
import { GiTreeBranch, GiEarthCrack, GiFlowerPot, GiHearts, GiHouse, GiWorld } from "react-icons/gi";
import { useState } from "react";

export default function PlantResults({ plantInfo }: { plantInfo: PlantInfo }) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  if (!plantInfo) return null;

  const toggleCard = (label: string) => {
    setExpandedCard(expandedCard === label ? null : label);
  };

  const getSunlightIcon = (sunlight: string | undefined) => {
    if (!sunlight) return <FaCloud className="text-gray-400" />;
    if (sunlight.toLowerCase().includes("full")) return <FaSun className="text-yellow-500" />;
    if (sunlight.toLowerCase().includes("partial")) return <FaCloudSun className="text-yellow-400" />;
    return <FaCloud className="text-gray-400" />;
  };

  const getTemperatureColor = (temperature: string | undefined) => {
    if (!temperature) return "text-gray-400";
    const tempValue = parseFloat(temperature.replace(/[^0-9.-]/g, ""));
    if (tempValue < 15) return "text-blue-500";
    if (tempValue >= 15 && tempValue <= 25) return "text-green-500";
    return "text-red-500";
  };

  const getWaterNeedsIcon = (waterNeeds: string | undefined) => {
    if (!waterNeeds) return <WiRaindrop className="text-gray-400" />;
    if (waterNeeds.toLowerCase().includes("high")) return <WiRaindrop className="text-blue-500" />;
    if (waterNeeds.toLowerCase().includes("medium")) return <WiRaindrop className="text-green-500" />;
    if (waterNeeds.toLowerCase().includes("regular")) return <WiRaindrop className="text-green-500" />;
    return <WiRaindrop className="text-yellow-500" />;
  };

  const details = [
    {
      label: "Sunlight",
      icon: getSunlightIcon(plantInfo.sunlightRequirements.short),
      shortText: plantInfo.sunlightRequirements.short || "None Found",
      value: plantInfo.sunlightRequirements.detailed || "Not specified",
    },
    {
      label: "Temperature",
      icon: <WiThermometer className={getTemperatureColor(plantInfo.temperatureRequirements.short)} />,
      shortText: plantInfo.temperatureRequirements.short || "None Found",
      value: plantInfo.temperatureRequirements.detailed || "Not specified",
    },
    {
      label: "Watering",
      icon: getWaterNeedsIcon(plantInfo.waterNeeds.detailed),
      shortText: plantInfo.waterNeeds.short || "None Found",
      value: plantInfo.waterNeeds.detailed || "Not specified",
    },
    {
      label: "Native Region",
      icon: <GiWorld className="text-black-500" />,
      shortText: plantInfo.nativeRegion.short || "None Found",
      value: plantInfo.nativeRegion.detailed || "Not specified",
    },
    {
      label: "Soil Preference",
      icon: <GiEarthCrack className="text-brown-500" />,
      shortText: plantInfo.soilPreference.short || "None Found",
      value: plantInfo.soilPreference.detailed || "Not specified",
    },
    {
      label: "Bloom Season",
      icon: <GiFlowerPot className="text-pink-500" />,
      shortText: plantInfo.bloomSeason.short || "None  Found",
      value: plantInfo.bloomSeason.detailed || "Not specified",
    },
    {
      label: "Propagation",
      icon: <GiTreeBranch className="text-blue-500" />,
      shortText: plantInfo.propagationMethods.short || "None Found",
      value: plantInfo.propagationMethods.detailed || "No propagation methods specified",
    },
    {
      label: "Health Benefits",
      icon: <GiHearts className="text-red-500" />,
      shortText: plantInfo.healthBenefits.short || "None Found",
      value: plantInfo.healthBenefits.detailed || "No health benefits methods specified",
    },
    {
      label: "Location",
      icon: <GiHouse className="text-grey-500" />,
      shortText: plantInfo.location.short || "None Found",
      value: plantInfo.location.detailed || "No location specified",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-3xl font-bold text-green-800 mb-4">
          {plantInfo.name || "Plant Identified"}
        </h2>
        <p className="text-xl text-gray-700 mb-2">
          <strong>Common Name:</strong> {plantInfo.commonName.short || "Unknown"}
        </p>
        <p className="text-xl text-gray-700 mb-2">
          <strong>Family:</strong> {plantInfo.family.short || "Unknown"}
        </p>
        <p className="text-gray-600 mb-4">
          {plantInfo.description.detailed || "No description available."}
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {details.map((detail, index) => (
          <div key={index} className="relative">
            {/* Card */}
            <div
              className="bg-green-50 rounded-lg p-4 shadow-md cursor-pointer text-center"
              onClick={() => toggleCard(detail.label)}
            >
              <p className="text-gray-800 font-semibold mb-2">{detail.label}</p>
              <div className="flex items-center justify-center text-3xl mb-3">{detail.icon}</div>
              <p className="text-sm text-gray-500">{detail.shortText}</p>
            </div>

            {/* Expanded Grey Card */}
            {expandedCard === detail.label && (
              <div className="bg-gray-100 rounded-lg p-4 shadow-lg w-full mt-4">
                <p className="text-gray-700 text-lg font-medium">{detail.value}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
