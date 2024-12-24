import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Plant Helpline',
  description: 'Identify plants with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-green-50 min-h-screen flex flex-col`}>
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>
        <footer className="bg-green-100 py-4 text-center">
          <p className="text-gray-600">
            Built by <a href="https://bavakesavan.com/" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">
              Bava Kesavan
            </a> • 
            Source Code on <a href="https://github.com/bavakesavan/plant-ai" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">
              GitHub
            </a>
          </p>
        </footer>
      </body>
    </html>
  )
}
