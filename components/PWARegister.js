'use client'
import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service Workers not supported')
      return
    }

    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        })
        console.log('[PWA] Service Worker registered:', registration)

        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Check every minute

        // Listen for controller change (indicates SW update)
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              // Show update notification
              showUpdateNotification()
            }
          })
        })

        // Handle waiting service worker
        if (registration.waiting) {
          showUpdateNotification(registration.waiting)
        }
      } catch (error) {
        console.error('[PWA] Service Worker registration failed:', error)
      }
    }

    const showUpdateNotification = (worker) => {
      const updateBanner = document.createElement('div')
      updateBanner.className =
        'fixed bottom-0 left-0 right-0 z-40 p-4 bg-orange-500 text-white max-w-md mx-auto shadow-2xl animate-slide-up'
      updateBanner.innerHTML = `
        <div class="flex items-center justify-between">
          <div>
            <p class="font-bold">Update Available</p>
            <p class="text-sm opacity-90">New version of HawkerCal is ready</p>
          </div>
          <button id="update-btn" class="ml-4 bg-white text-orange-600 px-4 py-2 rounded-lg font-bold whitespace-nowrap hover:bg-orange-50 transition-colors">
            Update
          </button>
        </div>
      `

      document.body.appendChild(updateBanner)

      document.getElementById('update-btn').addEventListener('click', () => {
        if (worker) {
          worker.postMessage({ type: 'SKIP_WAITING' })
        }
        window.location.reload()
      })

      // Auto-remove after 10 seconds if not clicked
      setTimeout(() => {
        updateBanner.remove()
      }, 10000)
    }

    // Register SW on load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', registerServiceWorker)
    } else {
      registerServiceWorker()
    }

    // Listen for controller change
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] Service Worker controller changed')
    })
  }, [])

  return null
}
