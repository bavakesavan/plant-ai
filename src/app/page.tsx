'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import PlantResults from './components/PlantResults'
import { PlantInfo } from './types/plant-info'
import {Card, CardHeader, CardBody, Image } from "@nextui-org/react"
import ResultsCards from "@/app/components/ResultsCards";

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
        <div className="mx-auto px-4">
          <header className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-green-600 mb-4">
              Plant <span className="text-gray-200">Helpline</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Save any plant, powered by AI.
              Simply upload an image, and we`ll identify the plant and provide you with detailed information about it.
            </p>
          </header>

          <section className="mt-12 rounded-2xl p-8" aria-label="How it works">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="py-4" style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                <CardBody className="overflow-visible py-2">
                  <Image
                      alt="Picture of person taking a photo of a plant"
                      className="object-cover rounded-xl"
                      src="hand_picture.webp"
                      width={550}
                  />
                </CardBody>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <div>
                    <h4 className="font-bold text-large inline">Upload</h4>
                    <h4 className="font-normal text-large text-gray-400 inline"> a clear image of the plant you want to
                      identify.</h4>
                  </div>
                </CardHeader>
              </Card>
              <Card className="py-4" style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                <CardBody className="overflow-visible py-2">
                  <Image
                      alt="Picture of person taking a photo of a plant"
                      className="object-cover rounded-xl"
                      src="hand_picture.webp"
                      width={550}
                  />
                </CardBody>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <div>
                    <h4 className="font-normal text-large text-gray-400 inline">The </h4>
                    <h4 className="font-bold text-large inline">AI</h4>
                    <h4 className="font-normal text-large text-gray-400 inline"> scans the image and processes
                      plant characteristics.
                    </h4>
                  </div>
                </CardHeader>
              </Card>
              <Card className="py-4" style={{backgroundColor: 'rgb(10, 10, 10)'}}>
                <CardBody className="overflow-visible py-2">
                  <Image
                      alt="Picture of person taking a photo of a plant"
                      className="object-cover rounded-xl"
                      src="hand_picture.webp"
                      width={550}
                  />
                </CardBody>
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <div>
                    <h4 className="font-normal text-large text-gray-400 inline">Instantly get </h4>
                    <h4 className="font-bold text-large inline">detailed</h4>
                    <h4 className="font-normal text-large text-gray-400 inline"> information about the plant.
                    </h4>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </section>

          <section className="shadow rounded p-8 border border-gray-500" style={{backgroundColor: 'rgb(10, 10, 10)'}}>
            <ImageUploader onIdentify={handleIdentify}/>
          </section>
          <section className="shadow-xl rounded-2xl p-8">
            <div className="grid md:grid-cols-[40%_60%] gap-6">
              {uploadedImage && (
                  <div id="plantInfo" className="flex justify-center mb-8">
                    <img
                        src={uploadedImage}
                        alt="Uploaded plant"
                        className="shadow-md object-cover w-full h-full"
                        style={{maxWidth: '100%', maxHeight: '100%'}}
                    />
                  </div>
              )}
              {plantInfo && (
                  <PlantResults plantInfo={plantInfo}/>
              )}
            </div>


            <div className="rounded-2xl">
              {plantInfo && (
                  <ResultsCards plantInfo={plantInfo}/>
              )}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}