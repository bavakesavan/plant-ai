'use client'

import { useState, useCallback, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { identifyPlant } from '../services/gemini-service'
import { PlantInfo } from '../types/plant-info'

interface ImageUploaderProps {
  onIdentify: (plantInfo: PlantInfo, image: string) => void
}

export default function ImageUploader({ onIdentify }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'upload' | 'camera'>('upload')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const processImage = useCallback(async (file: File) => {
    setIsLoading(true)
    setError(null)

    try {
      const imageUrl = URL.createObjectURL(file)
      const result = await identifyPlant(file) as PlantInfo
      onIdentify(result, imageUrl)
    } catch (err) {
      setError('Failed to identify plant. Please try again.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [onIdentify])

  const handleFileUpload = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      processImage(acceptedFiles[0])
    }
  }, [processImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.webp']
    },
    multiple: false
  })

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
    } catch (err) {
      setError('Could not access camera. Please upload an image instead.')
      console.error(err)
    }
  }

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d')
      context?.drawImage(videoRef.current, 0, 0, 400, 300)
      
      canvasRef.current.toBlob(async (blob) => {
        if (blob) {
          const file = new File([blob], 'captured-plant.jpg', { type: 'image/jpeg' })
          await processImage(file)
        }
      }, 'image/jpeg')
    }
  }

  return (
    <div>
      <div className="flex mb-4 border-b">
        <button 
          className={`w-1/2 py-2 ${activeTab === 'upload' ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
          onClick={() => setActiveTab('upload')}
        >
          Upload Image
        </button>
        <button 
          className={`w-1/2 py-2 ${activeTab === 'camera' ? 'bg-green-100 text-green-800' : 'text-gray-600'}`}
          onClick={() => {
            setActiveTab('camera')
            startCamera()
          }}
        >
          Take Photo
        </button>
      </div>

      {activeTab === 'upload' ? (
        <div 
          {...getRootProps()} 
          className={`
            border-2 border-dashed rounded-lg p-12 text-center cursor-pointer 
            transition-colors duration-300
            ${isDragActive 
              ? 'border-green-600 bg-green-100' 
              : 'border-gray-300 hover:border-green-500 bg-white'
            }
          `}
        >
          <input {...getInputProps()} />
          {isLoading ? (
            <div className="flex justify-center items-center text-green-600">
              <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Identifying plant...
            </div>
          ) : (
            <>
              <p className="text-xl text-gray-600">
                Drag and drop a plant image, or click to select
              </p>
              <em className="text-sm text-gray-500">(Only *.jpeg, *.png, *.jpg and *.webp images will be accepted)</em>
            </>
          )}
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      ) : (
        <div className="relative">
          <video 
            ref={videoRef} 
            width={400} 
            height={300} 
            className="w-full rounded-lg"
          />
          <canvas 
            ref={canvasRef} 
            width={400} 
            height={300} 
            className="hidden"
          />
          <button 
            onClick={captureImage}
            className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Capture Photo
          </button>
        </div>
      )}
    </div>
  )
}