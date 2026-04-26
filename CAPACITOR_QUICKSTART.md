# HawkerCal AI — Capacitor Quick Start

## ⚡ Essential Commands

```bash
# 1. Build & Sync (do this once after setup)
npm run cap:build

# 2. Open Android Studio
npm run cap:android

# 3. Open Xcode (macOS only)
npm run cap:ios

# 4. Sync only (after code changes)
npm run cap:sync
```

## 📱 What to do next

### Android
1. Run `npm run cap:android`
2. Wait for Android Studio to load
3. Click **Run** (green play button) or press `Shift+F10`
4. Select emulator or connected device
5. App launches on your device

### iOS
1. Run `npm run cap:ios`
2. Wait for Xcode to load
3. Press `⌘R` or click **Run**
4. Select iPhone simulator or device
5. App launches in simulator/device

## ✅ What's Installed

- ✅ Capacitor Core & CLI
- ✅ Android platform
- ✅ iOS platform
- ✅ Camera plugin (for photo capture & gallery)
- ✅ FileSystem plugin (for saving photos)
- ✅ Camera + photo permissions (Android & iOS)
- ✅ capacitor.config.json configured
- ✅ Android manifest updated
- ✅ iOS Info.plist updated

## 🔍 Verify Setup

Check that everything is in place:

```bash
# Check Capacitor CLI is installed
npx cap --version

# Check platforms are added
npx cap list

# Check config is valid
cat capacitor.config.json
```

## 📖 Full Documentation

Read `CAPACITOR_SETUP.md` for:
- Detailed workflow
- Android APK/AAB build instructions
- iOS archive & App Store submission steps
- Troubleshooting
- Production deployment guide

---

**Ready to build? Run `npm run cap:build` now!**
