import { PlantInfo } from "../types/plant-info";
import { FaSun, FaCloudSun, FaCloud } from "react-icons/fa";
import { WiThermometer, WiRaindrop } from "react-icons/wi";
import { GiTreeBranch, GiEarthCrack, GiFlowerPot, GiHearts, GiHouse, GiWorld, GiTreehouse } from "react-icons/gi";
import { useState } from "react";
import {
  Card, CardBody,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";

export default function ResultsCards({ plantInfo }: { plantInfo: PlantInfo }) {
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

  const getLocationIcon = (location: string | undefined) => {
    if (!location) return <GiHouse className="text-gray-500" />;
    if (location.toLowerCase().includes("indoor")) return <GiHouse className="text-blue-400" />;
    if (location.toLowerCase().includes("outdoor")) return <GiTreehouse className="text-green-500" />;
    return <GiHouse className="text-gray-500" />;
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
      icon: getLocationIcon(plantInfo.location.detailed),
      shortText: plantInfo.location.short || "None Found",
      value: plantInfo.location.detailed || "No location specified",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {details.map((detail, index) => (
          <div key={index} className="relative rounded-2xl" style={{ backgroundColor: 'rgb(29, 29, 31)' }}>
            {/* Card */}
            <Card key={index} isPressable shadow="sm" onPress={() => toggleCard(detail.label)} className="p-6 rounded-2xl w-full h-full" style={{ backgroundColor: 'rgb(29, 29, 31)' }}>
              <CardBody className="overflow-visible py-2">
                <div className="text-4xl mb-3">{detail.icon}</div>
              </CardBody>
              <b className="text-lg">{detail.label}</b>
              <div className="flex justify-between items-center text-left w-full">
                <p className="text-gray-400">{detail.shortText}</p>
                <img
                  src="/green_plus.png"
                  alt="Plus Icon"
                  className="w-[30px] h-[30px] object-contain"
                />
              </div>
            </Card>

            {/* Modal */}
            <Modal
              isOpen={expandedCard === detail.label}
              backdrop="blur"
              size={"2xl"}
              onClose={() => setExpandedCard(null)}
              onClick={() => setExpandedCard(null)}
              style={{ backgroundColor: 'rgb(10, 10, 10)' }}
            >
              <ModalContent>
                <div className="grid md:grid-cols-[70%_30%] p-8">
                  <div className="col-span-1 text-left">
                    <ModalHeader className="text-left text-3xl font-bold">
                      {detail.label}
                    </ModalHeader>
                    <ModalBody>
                      <p className="text-gray-400">{detail.value}</p>
                    </ModalBody>
                  </div>
                  <div className="col-span-1 flex justify-center text-7xl mb-3 p-4">
                    {detail.icon}
                  </div>
                </div>
              </ModalContent>
            </Modal>
          </div>
        ))}
      </div>
    </div>
  );
}
