export default function PlantResults({ plantInfo }: { plantInfo: any }) {
    if (!plantInfo) return null

    // Check if the identification was unsuccessful
    const isUnidentified = 
        plantInfo.scientificName === 'Unable to determine' && 
        (!plantInfo.description || plantInfo.description.length < 50)

    if (isUnidentified) {
        return (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold text-yellow-800 mb-4">Plant Identification Unsuccessful</h3>
                <div className="text-gray-700">
                    {plantInfo.description && plantInfo.description.length > 0 ? (
                        <div>
                            <p className="italic mb-2">"Additional context from AI:"</p>
                            <p>{plantInfo.description}</p>
                        </div>
                    ) : (
                        <p>Our AI was unable to identify the specific plant in the image. This could be due to several reasons:</p>
                    )}
                    
                    <ul className="list-disc list-inside mt-4 space-y-2 text-gray-600">
                        <li>The image may be unclear or blurry</li>
                        <li>The plant might be partially obscured</li>
                        <li>The species could be uncommon or not in our database</li>
                        <li>The lighting or angle might make identification difficult</li>
                    </ul>
                    
                    <p className="mt-4 font-medium">Suggestions:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-600">
                        <li>Try taking a clearer, well-lit photo</li>
                        <li>Ensure the entire plant is visible</li>
                        <li>Take the photo from multiple angles</li>
                        <li>Make sure the plant is the main focus of the image</li>
                    </ul>
                </div>
            </div>
        )
    }

    // Predefined additional details
    const additionalDetails = [
      { label: 'Native Region', value: plantInfo.nativeRegion || 'Not Available' },
      { label: 'Growth Type', value: plantInfo.growthType || 'Not Available' },
      { label: 'Sunlight Requirements', value: plantInfo.sunlightRequirements || 'Not Available' },
      { label: 'Soil Preference', value: plantInfo.soilPreference || 'Not Available' },
      { label: 'Water Needs', value: plantInfo.waterNeeds || 'Not Available' },
      { label: 'Bloom Season', value: plantInfo.bloomSeason || 'Not Available' }
    ]
  
    return (
      <div className="space-y-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-bold text-green-800 mb-4">
            {plantInfo.scientificName || 'Plant Identified'}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3">Botanical Details</h3>
              <div className="space-y-2">
                <p className="text-gray-800"><strong>Common Name:</strong> {plantInfo.commonName || 'Unknown'}</p>
                <p className="text-gray-800"><strong>Plant Family:</strong> {plantInfo.family || 'Unclassified'}</p>
              </div>
            </div>
  
            <div>
              <h3 className="text-xl font-semibold text-green-700 mb-3">Description</h3>
              <p className="text-gray-800">
                {plantInfo.description || 'No additional information available'}
              </p>
            </div>
          </div>
        </div>
  
        <div className="bg-green-50 rounded-lg p-6">
          <h3 className="text-2xl font-semibold text-green-800 mb-5">Plant Characteristics</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-green-100">
                <th className="p-3 text-left border border-green-200 text-gray-800">Characteristic</th>
                <th className="p-3 text-left border border-green-200 text-gray-800">Details</th>
              </tr>
            </thead>
            <tbody>
              {additionalDetails.map((detail, index) => (
                <tr key={index} className="border-b border-green-200">
                  <td className="p-3 font-medium text-gray-800">{detail.label}</td>
                  <td className="p-3 text-gray-800">{detail.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
  
        {plantInfo.propagationMethods && plantInfo.propagationMethods.length > 0 && (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-2xl font-semibold text-green-800 mb-5">Propagation Methods</h3>
            <div className="space-y-4">
              {plantInfo.propagationMethods.map((method: string, index: number) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-bold text-green-700 mb-2">Method {index + 1}</h4>
                  <p className="text-gray-800">{method}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }