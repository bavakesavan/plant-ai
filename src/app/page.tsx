// app/page.tsx
'use client'
import { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import PlantResults from './components/PlantResults'

export default function Home() {
  const [plantInfo, setPlantInfo] = useState<any>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleIdentify = (info: any, image: string) => {
    setPlantInfo(info)
    setUploadedImage(image)
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-green-900 mb-4">
          Plant <span className="text-green-600">AI</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover the world of plants with our advanced AI-powered plant identification technology. 
          Simply upload an image, and let our intelligent system unveil the botanical mysteries.
        </p>
      </div>

      <div className="mt-12 bg-green-50 rounded-2xl p-8">
        <h3 className="text-3xl font-bold text-green-900 mb-6">How It Works</h3>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-green-700 mb-4">1. Upload</h4>
            <p className="text-gray-600">
              Choose a clear image of the plant you want to identify.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-green-700 mb-4">2. Analyze</h4>
            <p className="text-gray-600">
              Our AI scans the image and processes plant characteristics.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold text-green-700 mb-4">3. Discover</h4>
            <p className="text-gray-600">
              Instantly get detailed information about the plant species.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-2xl p-8 border border-green-100">
        <ImageUploader onIdentify={handleIdentify} />
        
        {uploadedImage && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">Uploaded Image</h2>
            <div className="flex justify-center mb-8">
              <img 
                src={uploadedImage} 
                alt="Uploaded plant" 
                className="max-h-96 rounded-lg shadow-md object-cover"
              />
            </div>
          </div>
        )}
        
        {plantInfo && (
          <PlantResults plantInfo={plantInfo} />
        )}
      </div>
    </div>
  )
}