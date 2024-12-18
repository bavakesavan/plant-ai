export async function identifyPlant(file: File) {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      const base64Image = (reader.result as string).split(",")[1]; // Extract base64 image data

      try {
        // Call the server-side API route
        const response = await fetch("/api/identifyPlant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fileType: file.type,    // Send the file type (e.g., "image/jpeg")
            base64Image: base64Image, // Send the base64-encoded image
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to identify the plant.");
        }

        const { response: aiResponse } = await response.json();

        const parsedInfo = parseGeminiResponse(aiResponse);

        resolve(parsedInfo);
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsDataURL(file); // Read the file as a data URL
  });
}


function parseGeminiResponse(response: string) {
  return {
    scientificName: extractValue(response, 'Scientific Name') || 'Unable to determine',
    commonName: extractValue(response, 'Common Name') || 'Unknown',
    family: extractValue(response, 'Plant Family') || 'Unclassified',
    description: extractDescription(response),
    nativeRegion: extractValue(response, 'Native Region') || 'Not specified',
    growthType: extractValue(response, 'Growth Type') || 'Unknown',
    sunlightRequirements: extractValue(response, 'Sunlight Requirements') || 'Not specified',
    temperatureRequirements: extractValue(response, 'Temperature Requirements') || 'Not specified',
    soilPreference: extractValue(response, 'Soil Preference') || 'Not specified',
    waterNeeds: extractValue(response, 'Water Needs') || 'Not specified',
    bloomSeason: extractValue(response, 'Typical Bloom Season') || 'Not specified',
    propagationMethods: extractPropagationMethods(response)
  }
}

function extractValue(text: string, label: string): string | null {
  const regex = new RegExp(`${label}:\\s*(.+?)(?=\\n|$)`, 'i')
  const match = text.match(regex)
  return match ? match[1].trim() : null
}

function extractDescription(text: string): string {
  const descriptionMatch = text.match(/Detailed Description:?\s*(.*?)(?=\n|$)/is)
  if (descriptionMatch) return descriptionMatch[1].trim()

  return text.length > 300 ? text.substring(0, 300) + '...' : text
}

function extractPropagationMethods(text: string): string[] {
  const propagationMatch = text.match(/Detailed Propagation Methods:?\s*(.*?)(?=\n\n|$)/is)
  if (propagationMatch) {
    // Split by method numbers or bullet points
    const methods = propagationMatch[1]
      .split(/\d+\.|\*|-/)
      .filter(method => method.trim().length > 10)
      .map(method => method.trim())

    return methods.length > 0 ? methods : ['No specific propagation methods found.']
  }

  return ['No propagation methods available.']
}