'use client'
import { useState, useEffect } from 'react'

export default function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if dismissed recently
    const dismissed = typeof window !== 'undefined' ? localStorage.getItem('pwa-prompt-dismissed') : null
    if (dismissed) {
      const daysSinceDismissed = (Date.now() - parseInt(dismissed)) / (1000 * 60 * 60 * 24)
      if (daysSinceDismissed < 7) {
        setIsDismissed(true)
        return
      }
    }

    // Check for iOS
    const isAppleDevice = /iPad|iPhone|iPod/.test(navigator.userAgent)
    setIsIOS(isAppleDevice)

    // Android install prompt
    if (!isAppleDevice) {
      const handleBeforeInstallPrompt = (e) => {
        e.preventDefault()
        setDeferredPrompt(e)
        setShowPrompt(true)
      }

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      }
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      if (outcome === 'accepted') {
        setShowPrompt(false)
        setDeferredPrompt(null)
      }
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setIsDismissed(true)
    // Don't show again for 7 days
    if (typeof window !== 'undefined') {
      localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
    }
  }

  if (!mounted || isInstalled || isDismissed) {
    return null
  }

  // iOS Install Instructions
  if (isIOS && showPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-orange-200 shadow-xl max-w-md mx-auto rounded-t-3xl">
        <div className="space-y-4">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <div className="pt-2">
            <h3 className="text-lg font-black text-gray-900 mb-2">Add to Home Screen</h3>
            <p className="text-sm text-gray-600 mb-4">
              Install HawkerCal on your iPhone for quick access and offline support.
            </p>

            <div className="bg-orange-50 rounded-2xl p-4 space-y-3 text-left text-sm">
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0 mt-0.5">1️⃣</span>
                <span className="text-gray-700">
                  Tap the <strong>Share</strong> button (arrow up from bottom)
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0 mt-0.5">2️⃣</span>
                <span className="text-gray-700">
                  Scroll down and tap <strong>Add to Home Screen</strong>
                </span>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-base flex-shrink-0 mt-0.5">3️⃣</span>
                <span className="text-gray-700">
                  Tap <strong>Add</strong> in the top right
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDismiss}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-900 py-3 rounded-2xl font-bold transition-colors"
          >
            Got it!
          </button>
        </div>
      </div>
    )
  }

  // Android Install Prompt
  if (!isIOS && showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t-2 border-orange-300 shadow-xl max-w-md mx-auto rounded-t-3xl">
        <div className="space-y-4">
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-4 text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>

          <div className="pt-2">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">🍜</span>
              <div>
                <h3 className="text-lg font-black text-gray-900">HawkerCal</h3>
                <p className="text-xs text-gray-500">Track hawker food calories</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Install HawkerCal on your home screen for instant access and offline support.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleInstall}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-2xl font-bold transition-all"
              >
                Install App
              </button>
              <button
                onClick={handleDismiss}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-2xl font-bold transition-colors"
              >
                Not Now
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
