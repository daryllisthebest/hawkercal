import { Inter } from 'next/font/google'
import './globals.css'
import InstallPrompt from '@/components/InstallPrompt'
import PWARegister from '@/components/PWARegister'

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
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'HawkerCal AI',
  },
  icons: {
    icon: [
      { url: '/icons/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/icons/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
}

export const viewport = {
  themeColor: '#f97316',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
  colorScheme: 'light',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="application-name" content="HawkerCal" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="HawkerCal" />
        <meta name="theme-color" content="#f97316" />
        <meta name="description" content="AI-powered calorie tracker for Southeast Asian hawker food" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS Splash Screens */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="apple-touch-startup-image" href="/icons/splash-640x1136.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-750x1334.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-1242x2208.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" />
        <link rel="apple-touch-startup-image" href="/icons/splash-1125x2436.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" />

        {/* PWA Service Worker */}
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-screen bg-orange-50 font-sans antialiased">
        {children}
        <InstallPrompt />
        <PWARegister />
      </body>
    </html>
  )
}
