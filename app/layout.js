import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata = {
  title: 'HawkerCal AI – Track Your Hawker Food Calories',
  description:
    'AI-powered calorie tracker for Southeast Asian hawker food. Snap a photo, detect the dish, and log your daily intake in seconds.',
  keywords:
    'hawker food calories, Singapore food tracker, SE Asian diet app, AI food detection, calorie counter Singapore',
}

export const viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-orange-50 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
