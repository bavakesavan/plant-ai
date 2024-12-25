'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import PlantResults from './components/PlantResults'
import { PlantInfo } from './types/plant-info'

const ImageUploader = dynamic(() => import('./components/ImageUploader'), { ssr: false })

export default function Home() {
  const [plantInfo, setPlantInfo] = useState<PlantInfo | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleIdentify = (info: PlantInfo, image: string) => {
    setPlantInfo(info)
    setUploadedImage(image)
  }

  return (
    <main className="flex flex-col">
      <section className="flex-grow">
        <div className="max-w-4xl mx-auto px-4">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-green-900 mb-4">
              Plant <span className="text-green-600">Helpline</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Save any plant, powered by AI.
              Simply upload an image, and we'll identify the plant and provide you with detailed information about it.
            </p>
          </header>

          <section className="mt-12 bg-green-50 rounded-2xl p-8" aria-label="How it works">
            <div className="grid md:grid-cols-3 gap-6">
              <article className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-green-700 mb-4">1. Upload</h2>
                <p className="text-gray-600">
                  Choose a clear image of the plant you want to identify.
                </p>
              </article>
              <article className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-green-700 mb-4">2. Analyze</h2>
                <p className="text-gray-600">
                  The AI scans the image and processes plant characteristics.
                </p>
              </article>
              <article className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-green-700 mb-4">3. Discover</h2>
                <p className="text-gray-600">
                  Instantly get detailed information about the plant species.
                </p>
              </article>
            </div>
          </section>

          <section className="bg-white shadow-xl rounded-2xl p-8 border border-green-100">
            <ImageUploader onIdentify={handleIdentify} />

            {uploadedImage && (
              <article className="mt-8">
                <h2 className="text-2xl font-bold text-green-800 mb-4">Uploaded Image</h2>
                <div className="flex justify-center mb-8">
                  <img
                    src={uploadedImage}
                    alt="Uploaded plant"
                    className="max-h-96 rounded-lg shadow-md object-cover"
                  />
                </div>
              </article>
            )}

            {plantInfo && (
              <PlantResults plantInfo={plantInfo} />
            )}
          </section>
        </div>
      </section>
    </main>
  )
}