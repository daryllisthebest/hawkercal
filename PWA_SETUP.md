# HawkerCal PWA Setup Guide

HawkerCal is now a fully-fledged Progressive Web App (PWA) that works on iPhone, Android, and the web.

## ✅ What's Included

### Core PWA Features
- ✅ **Service Worker** (`public/service-worker.js`) - Enables offline support and caching
- ✅ **Web Manifest** (`public/manifest.json`) - Makes app installable on home screen
- ✅ **Install Prompts** - Native Android prompt + iOS instructions
- ✅ **Offline Fallback** - Graceful offline page when connection is lost
- ✅ **Camera Support** - Works on both iPhone and Android
- ✅ **LocalStorage Sync** - All data persists on device
- ✅ **Mobile Optimized** - Touch-friendly UI, viewport settings

### Caching Strategy
- **Static Assets**: Cache-first (CSS, JS, fonts, images)
- **HTML Pages**: Network-first with cache fallback
- **API Requests**: Network-first with cache fallback
- **Offline Pages**: Served from cache when offline

## 📱 Installation

### Android Chrome

1. **Automatic Prompt** (if not shown):
   - Click the three-dot menu → "Install app"
   - Or look for the install button that appears automatically

2. **Manual Installation**:
   - Open Chrome menu (⋮)
   - Select "Install app" or "Create shortcut"
   - Choose to create on home screen

### iPhone Safari

1. **Manual Installation** (Apple doesn't auto-prompt):
   - Open HawkerCal in Safari
   - Tap the Share button (↑ at bottom)
   - Scroll down and tap "Add to Home Screen"
   - Tap "Add"

2. **Features in Standalone Mode**:
   - ✅ Full-screen experience (no Safari UI)
   - ✅ Camera access
   - ✅ Offline support
   - ✅ LocalStorage persistence
   - ⚠️ Limited to 50MB storage

## 🎨 App Icons

### Icon Files Needed

Generate these from `/public/icons/icon.svg`:

**Android Icons:**
```
/public/icons/
  ├── icon-192x192.png
  ├── icon-192x192-maskable.png
  ├── icon-256x256.png
  ├── icon-384x384.png
  ├── icon-512x512.png
  └── icon-512x512-maskable.png
```

**iOS Icons:**
```
/public/icons/
  ├── apple-touch-icon.png (180x180)
  ├── splash-640x1136.png (iPhone SE)
  ├── splash-750x1334.png (iPhone 8)
  ├── splash-1125x2436.png (iPhone X)
  └── splash-1242x2208.png (iPhone 6 Plus)
```

### Generate Icons Quickly

Using online tools:
1. **RealFaviconGenerator**: https://realfavicongenerator.net/
2. **PWA Asset Generator**: https://www.pwabuilder.com/imageGenerator
3. **Cloudinary**: Upload SVG, download in all sizes

## 🚀 Features

### Offline Support
- ✅ View your food log offline
- ✅ All historical data is cached
- ✅ App shows "Offline" page when no connection
- ✅ Auto-syncs when connection restored
- ✅ Camera works offline (uses device storage)

### Camera & Upload
- ✅ **Android**: Full camera support via Chrome
- ✅ **iPhone**: Native camera access via Safari
- ✅ Direct capture from camera app
- ✅ Upload from photo gallery
- ✅ Supported formats: JPG, PNG, WebP, HEIC

### Data Persistence
- ✅ All meal logs stored in LocalStorage
- ✅ Data never sent to server (privacy-first)
- ✅ Survives app updates
- ✅ Manually clearable in browser settings
- ⚠️ Limited to ~5MB on most devices (check iPhone's 50MB limit)

### App Updates
- ✅ Service worker checks for updates periodically
- ✅ Shows notification when update available
- ✅ User can choose to update immediately
- ✅ Updates don't interrupt active use

## 🛠️ Configuration Files

### `manifest.json`
Defines app metadata, icons, colors, and installation options.

**Key settings:**
```json
{
  "start_url": "/",
  "display": "standalone",     // Full-screen app mode
  "theme_color": "#f97316",    // Orange accent
  "background_color": "#fffbf5" // Cream background
}
```

### `service-worker.js`
Handles offline support and caching.

**Caching tiers:**
1. Static assets (100+ year cache)
2. Dynamic pages (network-first)
3. API requests (network-first)
4. Offline fallback page

### `app/layout.js`
Meta tags for iOS/Android installation and PWA support.

**Includes:**
- Apple web app meta tags
- Splash screen links for iOS
- Theme color
- Manifest reference

## 📊 Testing

### Chrome DevTools
1. Open DevTools (F12)
2. Go to Application → Manifest
3. Check "Manifest loaded successfully"
4. Test offline: Application → Service Workers → Offline checkbox

### Lighthouse Audit
1. Open DevTools
2. Click Lighthouse tab
3. Run audit for "PWA"
4. Look for score ≥ 80

### Real Device Testing
1. **Android**: Install via Chrome, test offline mode
2. **iPhone**: Add to home screen, test in full-screen mode
3. Check both portrait and landscape
4. Test camera access
5. Force-kill app and relaunch

## ⚠️ iPhone Safari Limitations

Apple restricts PWA features in Safari:
- ⚠️ No install prompt (user must manually add)
- ⚠️ Limited to 50MB storage (vs Android's 5MB+)
- ⚠️ Service workers are less robust
- ⚠️ Some APIs may be restricted
- ✅ Camera access works
- ✅ LocalStorage works
- ✅ Offline pages work

## 🔧 Development

### Run Locally
```bash
npm run dev
```

Service worker only works in production mode:
```bash
npm run build
npm run start
```

### Test Service Worker
1. Open http://localhost:3000
2. DevTools → Application → Service Workers
3. Check "Offline" checkbox
4. Refresh page → should see offline page

### Update Icons During Development
Keep `icon.svg` in `/public/icons/` and regenerate as needed.

## 📦 Production Deployment

### Vercel
- ✅ Automatically serves with correct headers
- ✅ Caching headers are configured
- ✅ HTTPS enabled (required for PWA)

### Self-Hosted
Ensure these headers are set:
```
/service-worker.js:
  Cache-Control: public, max-age=0, must-revalidate
  Service-Worker-Allowed: /

/manifest.json:
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=3600
```

## 🚀 Next Steps

1. **Generate PNG Icons**
   - Use RealFaviconGenerator or PWA Asset Generator
   - Replace SVG icons in `/public/icons/`
   - Update manifest.json icon paths

2. **Test on Real Devices**
   - Use ngrok to expose localhost
   - Test on iPhone and Android
   - Verify camera and offline functionality

3. **Customize Theme**
   - Update `theme_color` in manifest.json
   - Update splash screens to match branding

4. **Monitor Analytics**
   - Track install rates
   - Monitor offline usage
   - Check service worker performance

## 💡 Tips

- **Faster loads**: Service worker caches aggressively
- **Offline first**: Works great on slow networks
- **Battery efficient**: No constant network polling
- **Privacy**: No data sent to servers
- **iOS users**: Make installing easy by showing instructions

## 🐛 Troubleshooting

### Service worker not registering?
- Check DevTools Console for errors
- Ensure HTTPS in production
- Clear cache and reload

### Icons not showing?
- Check manifest.json paths
- Icons should be in `/public/icons/`
- Ensure correct file formats (PNG recommended)

### Camera not working?
- Android: Grant camera permission
- iPhone: Add to home screen first (Safari browser mode limited)
- Check browser privacy settings

### Storage full?
- Clear app data in browser settings
- iPhone: Delete app from home screen and reinstall
- Android: Settings → Apps → Storage → Clear cache

## 📚 Resources

- **MDN PWA**: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps
- **Web.dev**: https://web.dev/progressive-web-apps/
- **PWABuilder**: https://www.pwabuilder.com/
- **Manifest Spec**: https://w3c.github.io/manifest/

---

**HawkerCal is now a true PWA!** 🎉 Install on your home screen and enjoy offline-first food tracking.
