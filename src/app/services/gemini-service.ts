import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

export async function identifyPlant(file: File) {
  const reader = new FileReader()
  return new Promise((resolve, reject) => {
    reader.onloadend = async () => {
      const base64Image = (reader.result as string).split(',')[1]
      
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
        
        const prompt = 
          "Identify this plant in detail. Provide comprehensive information:" +
          "\n- Scientific Name" +
          "\n- Common Name" +
          "\n- Plant Family" +
          "\n- Detailed Description" +
          "\n- Native Region" +
          "\n- Growth Type (tree, shrub, herb)" +
          "\n- Sunlight Requirements" +
          "\n- Soil Preference" +
          "\n- Water Needs" +
          "\n- Typical Bloom Season" +
          "\n- Detailed Propagation Methods (at least 2-3 methods if possible)" +
          "\n\nProvide the most accurate and detailed information possible."

        const result = await model.generateContent({
          contents: [{
            role: "user",
            parts: [
              { text: prompt },
              { inlineData: { 
                mimeType: file.type, 
                data: base64Image 
              }}
            ]
          }]
        })

        const response = await result.response.text()
        
        const parsedInfo = parseGeminiResponse(response)
        
        resolve(parsedInfo)
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsDataURL(file)
  })
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