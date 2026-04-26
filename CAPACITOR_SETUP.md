# HawkerCal AI — Capacitor Mobile App Setup

Your Next.js PWA has been configured for mobile deployment using Capacitor. This guide provides step-by-step instructions to build, sync, and deploy to Android and iOS.

## ✅ What's Been Configured

- **App Name**: HawkerCal AI
- **App ID**: com.hawkercal.app
- **Platforms**: Android and iOS
- **Permissions**: Camera + Photo Library access
- **Web Assets**: Next.js production build output

### Configuration Files Created/Updated
- `capacitor.config.json` — Main Capacitor configuration
- `android/app/src/main/AndroidManifest.xml` — Android permissions (CAMERA, READ_MEDIA_IMAGES, READ_EXTERNAL_STORAGE, WRITE_EXTERNAL_STORAGE)
- `ios/App/App/Info.plist` — iOS privacy descriptions for Camera and Photo Library
- `package.json` — Added Capacitor helper scripts

### Installed Plugins
- `@capacitor/camera` — Camera and photo gallery access
- `@capacitor/filesystem` — File system operations
- `@capacitor/android` — Android platform
- `@capacitor/ios` — iOS platform

---

## 🚀 Quick Start Commands

### 1. Build & Sync (Combined)
```bash
npm run cap:build
```
This builds the Next.js app and syncs it to both Android and iOS platforms.

### 2. Open Android Studio (for Android development/building)
```bash
npm run cap:android
```

### 3. Open Xcode (for iOS development/building)
```bash
npm run cap:ios
```

### 4. Sync Only (after code changes)
```bash
npm run cap:sync
```

---

## 📋 Step-by-Step Workflow

### Before You Start
1. **Android**: Install Android Studio and Android SDK
   - macOS: `brew install android-studio`
   - Linux: Download from [developer.android.com](https://developer.android.com/studio)
   - Windows: Download from [developer.android.com](https://developer.android.com/studio)

2. **iOS** (macOS only): Install Xcode
   ```bash
   xcode-select --install
   ```

### Step 1: Build the Next.js App
```bash
npm run build
```
This creates the production build that Capacitor will package.

### Step 2: Sync to Mobile Platforms
```bash
npx cap sync
```
This copies your web app to the `android/app/src/main/assets/public` and `ios/App/App/public` directories.

**Note**: You must have built the app first (Step 1) for sync to work. If you get "missing out directory" error, this is normal — the app uses `.next` not `out`.

### Step 3A: Android Development
```bash
npm run cap:android
```

**In Android Studio**:
1. Wait for Gradle sync to complete
2. Click **Run** > **Run 'app'** (or press `Shift+F10`)
3. Select your Android device or emulator
4. The app launches with hot reload support

**To Build APK**:
1. **Run** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
2. Find APK at: `android/app/build/outputs/apk/debug/app-debug.apk`

**To Create Release Build**:
1. Generate a keystore:
   ```bash
   keytool -genkey -v -keystore release.jks -keyalg RSA -keysize 2048 -validity 10000 -alias hawkercal
   ```
2. In Android Studio: **Build** > **Generate Signed Bundle / APK**
3. Select **APK**, choose your keystore, and build

### Step 3B: iOS Development
```bash
npm run cap:ios
```

**In Xcode**:
1. Select your target device (iPhone simulator or physical device)
2. Click **Product** > **Run** (or press `⌘R`)
3. The app launches in the simulator/device

**To Build for Testing**:
1. **Product** > **Build** (⌘B)
2. **Product** > **Test** (⌘U) — runs tests if configured

**To Create Archive (for App Store)**:
1. Change scheme to "Generic iOS Device" or your device
2. **Product** > **Archive**
3. In Organizer window, click **Distribute App**
4. Follow steps to upload to App Store Connect

---

## 🔧 Key Configuration Details

### capacitor.config.json
```json
{
  "appId": "com.hawkercal.app",
  "appName": "HawkerCal AI",
  "webDir": "out",  // Points to build output (adjust if needed)
  "plugins": {
    "Camera": {
      "permissions": ["camera", "photos"]
    }
  }
}
```

### Important: For Production Static Export
If you want a true static app (no Node.js server required), configure Next.js for static export:

**Update `next.config.mjs`** to add:
```javascript
const nextConfig = {
  output: 'export',
  // ... rest of config
}
```

Then update `capacitor.config.json`:
```json
{
  "webDir": "out"
}
```

Then build with:
```bash
npm run build
npx cap sync
```

### Permissions Reference

**Android** (`AndroidManifest.xml`):
- `CAMERA` — Access camera hardware
- `READ_MEDIA_IMAGES` — Read photos (Android 13+)
- `READ_EXTERNAL_STORAGE` — Access photo library
- `WRITE_EXTERNAL_STORAGE` — Save photos

**iOS** (`Info.plist`):
- `NSCameraUsageDescription` — Camera permission prompt
- `NSPhotoLibraryUsageDescription` — Photo library access prompt
- `NSPhotoLibraryAddOnlyUsageDescription` — Save to library prompt

---

## 🐛 Troubleshooting

### "Missing out directory" error
This is expected for server-based Next.js builds. The app uses `.next` directory.
- For development: This is fine, continue with `cap open android` or `cap open ios`
- For production: Follow the "Static Export" section above

### Camera not working on iOS
1. Make sure you added privacy descriptions to `Info.plist` ✓ (done)
2. Test on real device (simulator has limited camera support)
3. Request permission explicitly in your app code

### Android APK too large
Use ProGuard/R8 shrinking:
1. In Android Studio: **Build** > **Analyze APK**
2. Review what's included
3. Configure `android/app/build.gradle` to enable shrinking

### Changes not appearing on device
1. Run `npm run cap:sync` after code changes
2. Rebuild in Android Studio / Xcode
3. Uninstall app on device and reinstall

---

## 📱 Testing on Real Devices

### Android Physical Device
1. Enable Developer Mode: Tap Settings > About > Build Number 7 times
2. Enable USB Debugging: Settings > Developer Options > USB Debugging
3. Connect via USB
4. In Android Studio: Device menu > Select your device
5. Run app

### iOS Physical Device
1. Connect iPhone via USB
2. In Xcode: Window > Devices and Simulators
3. Register device with Apple ID
4. Select device in target menu
5. Run app

---

## 🚢 Production Deployment

### Android → Google Play Store
1. Create release APK/AAB in Android Studio
2. Go to [Google Play Console](https://play.google.com/console)
3. Create new app entry
4. Upload AAB file to Internal Testing > Release
5. Add screenshots, description, permissions
6. Review and publish

### iOS → App Store
1. Create archive in Xcode
2. Go to [App Store Connect](https://appstoreconnect.apple.com)
3. Create new app entry
4. Upload build via Xcode > Organizer > Distribute App
5. Add screenshots, description, privacy policy
6. Submit for review

---

## 📚 Useful Links

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor Camera Plugin](https://capacitorjs.com/docs/apis/camera)
- [Android Studio Guide](https://developer.android.com/studio)
- [Xcode Guide](https://developer.apple.com/xcode/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com)

---

## ✨ Next Steps

1. **Decide on app architecture**:
   - Server-based (current): App always connects to `npm run start`
   - Static export: Follow "Static Export" section for offline-capable apps

2. **Generate app icons**:
   - Use PWA icons from `/public/icons/` as base
   - Create 192x192, 512x512, etc. for Android
   - Create 180x180 for iOS

3. **Test camera functionality**:
   - Build and deploy to test device
   - Request camera permission
   - Take photos, upload from library

4. **Set up signing credentials**:
   - Android: Create keystore for production releases
   - iOS: Configure signing certificates in Xcode

5. **Prepare for app store submission**:
   - Create app listings
   - Add screenshots and descriptions
   - Set privacy policy and terms

---

**Configured with ❤️ for HawkerCal AI**
