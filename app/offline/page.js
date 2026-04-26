'use client'

export const dynamic = 'force-dynamic'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">📡</div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">You're Offline</h1>
        <p className="text-gray-600 mb-6">
          It looks like you've lost your internet connection. Your data is saved locally on your device.
        </p>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 mb-6 space-y-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">✅</span>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Your data is safe</p>
              <p className="text-xs text-gray-500">All your logged meals are stored on your device</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">📸</span>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Camera still works</p>
              <p className="text-xs text-gray-500">You can continue scanning meals offline</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">🔄</span>
            <div className="text-left">
              <p className="font-semibold text-gray-900 text-sm">Auto-syncs when online</p>
              <p className="text-xs text-gray-500">Your data will sync once you reconnect</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.history.back()}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-2xl font-bold transition-colors"
          >
            Go Back
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="w-full border-2 border-gray-300 hover:border-orange-400 text-gray-700 hover:text-orange-600 py-3 rounded-2xl font-bold transition-colors"
          >
            Go to Home
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          You can still use the app locally. Connect to the internet to sync your data.
        </p>
      </div>
    </div>
  )
}
