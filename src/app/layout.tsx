import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plant Helpline',
  description: 'Identify plants with AI',
  openGraph: {
    title: 'Plant Helpline | AI-Powered Plant Identification',
    description: 'Upload plant images for instant AI-powered identification and detailed care information.',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/images/preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Plant Helpline Preview',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body className={`${inter.className} min-h-screen flex flex-col`} style={{ backgroundColor: 'rgb(0, 0, 0)' }}>
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>
        <footer className="py-4 text-center" style={{ backgroundColor: 'rgb(29, 29, 31)' }}>
          <p className="text-gray-400">
            Built by <a href="https://bavakesavan.com/" target="_blank" rel="noopener noreferrer"
              className="text-green-600 font-semibold hover:underline">
              Bava Kesavan
            </a> •
            Source Code on <a href="https://github.com/bavakesavan/plant-ai" target="_blank" rel="noopener noreferrer"
              className="text-green-600 font-semibold hover:underline">
              GitHub
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
