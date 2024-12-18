'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import heic2any from 'heic2any'
import { identifyPlant } from '../services/gemini-service'
import { PlantInfo } from '../types/plant-info'

interface ImageUploaderProps {
  onIdentify: (plantInfo: PlantInfo, image: string) => void
}

export default function ImageUploader({ onIdentify }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [logMessages, setLogMessages] = useState<string[]>([])

  const log = (message: string) => {
    setLogMessages((prevLogs) => [...prevLogs, message])
  }

  const processImage = useCallback(
    async (file: File) => {
      setIsLoading(true)
      setError(null)

      try {
        let processedFile = file

        // Check if the file is a HEIC/HEIF format
        if (file.type.includes('heic') || file.type.includes('heif') || file.name.endsWith('.heic')) {
          try {
            log('Processing HEIC/HEIF file: ' + file.name)
            const blob = await heic2any({
              blob: file,
              toType: 'image/jpeg',
              quality: 0.9,
            })
            processedFile = new File([blob as Blob], 'converted-image.jpg', { type: 'image/jpeg' })
            log('Converted HEIC to JPEG successfully')
          } catch (heicError) {
            log('HEIC conversion failed: ' + (heicError as Error).message)
            throw new Error('Failed to process HEIC/HEIF image. Please try a different format.')
          }
        }

        const imageUrl = URL.createObjectURL(processedFile)
        log('Image processed, identifying plant...')
        const result = (await identifyPlant(processedFile)) as PlantInfo
        log('Plant identified successfully')
        onIdentify(result, imageUrl)
      } catch (err) {
        log('Error during plant identification: ' + (err as Error).message)
        setError('Failed to identify plant. Please try again.')
      } finally {
        setIsLoading(false)
      }
    },
    [onIdentify]
  )

  const handleFileUpload = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        log('File uploaded: ' + acceptedFiles[0].name)
        processImage(acceptedFiles[0])
      }
    },
    [processImage]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.webp', '.heic', '.heif'],
    },
    multiple: false,
  })

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer 
          transition-colors duration-300
          ${
            isDragActive
              ? 'border-green-600 bg-green-100'
              : 'border-gray-300 hover:border-green-500 bg-white'
          }
        `}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="flex justify-center items-center text-green-600">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Identifying plant...
          </div>
        ) : (
          <>
            <p className="text-xl text-gray-600">
              Drag and drop a plant image, or click to select
            </p>
            <em className="text-sm text-gray-500">
              (Supports *.jpeg, *.png, *.jpg, *.webp, and *.heic images)
            </em>
          </>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      <div className="mt-4">
        <h3 className="text-xl font-bold text-green-800">Logs:</h3>
        <pre className="bg-gray-100 p-4 rounded-lg text-sm max-h-60 overflow-y-auto">
          {logMessages.join('\n')}
        </pre>
      </div>
    </div>
  )
}
