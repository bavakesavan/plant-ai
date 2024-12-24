import { InfoDetail, PropagationMethods } from '../types/plant-info';

interface GeminiResponse {
  [key: string]: {
    short?: string;
    detailed?: string;
  } | string;
  name: string;
  imageUrl: string;
}

export async function identifyPlant(
  file: File,
  log: (message: string) => void
): Promise<ReturnType<typeof parseGeminiResponse>> {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      const base64Image = (reader.result as string).split(",")[1];
      log(`Base64 Image Generated: Length ${base64Image.length}`);

      try {
        const payload = {
          fileType: file.type,
          base64Image,
        };
        log(`Preparing payload with file type: ${file.type}`);

        const response = await fetch("/api/identifyPlant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorText = await response.text();
          log(`API Response Error: ${errorText}`);
          throw new Error("Failed to identify the plant: " + errorText);
        }

        const { response: aiResponse } = await response.json();
        log(`AI Response Received: ${aiResponse}`);

        // Extract the JSON string from the markdown code block
        const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```/);
        if (!jsonMatch) {
          throw new Error("Failed to parse AI response: Invalid format");
        }

        const cleanedResponse = jsonMatch[1].trim();
        const parsedResponse = JSON.parse(cleanedResponse) as GeminiResponse;
        
        const parsedInfo = parseGeminiResponse(parsedResponse);
        log("Plant information parsed successfully.");
        resolve(parsedInfo);
      } catch (error) {
        log(`Error identifying plant: ${(error as Error).message}`);
        reject(error);
      }
    };

    log(`Reading file: ${file.name} (type: ${file.type})`);
    reader.readAsDataURL(file);
  });
}

function parseGeminiResponse(response: GeminiResponse) {
  return {
    scientificName: extractInfoDetail(response, 'Scientific Name'),
    commonName: extractInfoDetail(response, 'Common Name'),
    family: extractInfoDetail(response, 'Plant Family'),
    description: extractDescription(response),
    nativeRegion: extractInfoDetail(response, 'Native Region'),
    growthType: extractInfoDetail(response, 'Growth Type'),
    sunlightRequirements: extractInfoDetail(response, 'Sunlight Requirements'),
    temperatureRequirements: extractInfoDetail(response, 'Temperature Requirements'),
    soilPreference: extractInfoDetail(response, 'Soil Preference'),
    waterNeeds: extractInfoDetail(response, 'Water Needs'),
    bloomSeason: extractInfoDetail(response, 'Typical Bloom Season'),
    propagationMethods: extractPropagationMethods(response),
    name: extractInfoDetail(response, 'Scientific Name').short,
    imageUrl: response.imageUrl || '',
  };
}

function extractInfoDetail(response: GeminiResponse, label: string): InfoDetail {
  const value = response[label];
  if (typeof value === 'object' && value !== null) {
    const short = value.short ?? 'Not specified';
    const detailed = value.detailed ?? short;
    return { short, detailed };
  }
  const fallback = value ?? 'Not specified';
  return { short: fallback, detailed: fallback };
}

function extractDescription(response: GeminiResponse): InfoDetail {
  const value = response['Detailed Description'];
  if (typeof value === 'object' && value !== null) {
    const short = value.short ?? 'No description available';
    const detailed = value.detailed ?? short;
    return { short, detailed };
  }
  const fallback = value ?? 'No description available';
  return { short: fallback, detailed: fallback };
}

function extractPropagationMethods(response: GeminiResponse): PropagationMethods {
  const value = response['Detailed Propagation Methods'];
  if (typeof value === 'object' && value !== null) {
    const short = value.short ?? 'No propagation methods available';
    const detailed = value.detailed ?? short;
    return { short, detailed };
  }
  const fallback = value ?? 'No propagation methods available';
  return { short: fallback, detailed: fallback };
}