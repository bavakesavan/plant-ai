'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { identifyPlant } from '../services/gemini-service';
import { PlantInfo } from '../types/plant-info';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
  onIdentify: (plantInfo: PlantInfo, image: string) => void;
}

export default function ImageUploader({ onIdentify }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logMessages, setLogMessages] = useState<string[]>([]);

  const log = useCallback((message: string) => {
    setLogMessages((prevLogs) => [...prevLogs, message]);
    console.log(message);
  }, []);

  const processImage = useCallback(
    async (file: File) => {
      setIsLoading(true);
      setError(null);
  
      try {
        log(`Processing file: ${file.name}`);
        let processedFile = file;
  
        // Compress the image
        log('Compressing the image...');
        const compressedFile = await imageCompression(processedFile, {
          maxSizeMB: 2,
          useWebWorker: true,
        });
        processedFile = new File([compressedFile], file.name, { type: compressedFile.type });
        log('Image compression successful');
  
        const imageUrl = URL.createObjectURL(processedFile);
        log('Image processed, starting identification...');
        const result = await identifyPlant(processedFile, log);
        log('Plant identified successfully');
        onIdentify(result, imageUrl);
      } catch (err) {
        const errorMessage = (err as Error).message;
        log(`Error: ${errorMessage}`);
        setError('Failed to identify plant. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [onIdentify, log]
  );

  const handleFileUpload = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        log(`File uploaded: ${acceptedFiles[0].name}`);
        processImage(acceptedFiles[0]);
      }
    },
    [processImage, log]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileUpload,
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg', '.webp', '.heic', '.heif'],
    },
    multiple: false,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-12 text-center cursor-pointer 
          transition-colors duration-300
          ${
            isDragActive
              ? 'border-gray-300 bg-gray-200'
              : 'border-gray-500 hover:border-gray-200 bg-gray-500'
          }
        `}
         style={{backgroundColor: 'rgb(51, 51, 54)'}}
      >
        <input {...getInputProps()} />
        {isLoading ? (
          <div className="flex justify-center items-center text-gray-300">
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
            <p className="text-xl text-gray-200">
              Drag and drop a plant image, or click to select
            </p>
            <em className="text-sm text-gray-500">
              (Supports *.jpeg, *.png, *.jpg, *.webp, and *.heic images)
            </em>
          </>
        )}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>

      {process.env.NEXT_PUBLIC_USER! == 'dev' && (
        <div className="mt-4">
          <h3 className="text-xl font-bold text-green-800">Logs:</h3>
          <pre
            className="bg-gray-100 p-4 rounded-lg text-sm max-h-60 overflow-y-auto"
            style={{ color: 'black' }}
          >
            {logMessages.join('\n')}
          </pre>
        </div>
      )}
    </div>
  );
}
