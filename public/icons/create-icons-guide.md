# How to Generate App Icons for HawkerCal PWA

## Required Icon Sizes

Generate these PNG icons from `/public/icons/icon.svg` or using an online tool:

### Android Icons
- `icon-192x192.png` (192x192) - Android home screen
- `icon-192x192-maskable.png` (192x192) - Maskable icon for Android adaptive icons
- `icon-256x256.png` (256x256) - Additional size
- `icon-384x384.png` (384x384) - Larger devices
- `icon-512x512.png` (512x512) - Splash screens
- `icon-512x512-maskable.png` (512x512) - Maskable variant

### iOS Icons
- `apple-touch-icon.png` (180x180) - iOS home screen
- `splash-640x1136.png` (640x1136) - iPhone SE splash
- `splash-750x1334.png` (750x1334) - iPhone 8 splash
- `splash-1125x2436.png` (1125x2436) - iPhone X splash
- `splash-1242x2208.png` (1242x2208) - iPhone 6 Plus splash

## Online Tools to Convert

1. **Cloudinary**: https://cloudinary.com/
2. **TinyPNG**: https://tinypng.com/
3. **Favicon Generator**: https://realfavicongenerator.net/
4. **PWA Asset Generator**: https://www.pwabuilder.com/

## Using PWA Asset Generator (Recommended)

```bash
# Install globally
npm install -g pwa-asset-generator

# Generate all sizes from icon.svg
pwa-asset-generator icon.svg ./output --splash-only --quality 80
```

## For Development

You can use the SVG icon temporarily:
- The manifest.json references PNG files
- Serve the SVG as a fallback during development
- Generate actual PNGs before production

## Maskable Icons

Maskable icons display with different shapes on different devices:
- Material You: Rounded corners, circles, etc.
- Add 40px safe zone padding inside the icon
- The emoji/logo should be in the center

## Testing Icons

After adding icons, test with:
1. Chrome DevTools > Application > Manifest
2. PWABuilder: https://www.pwabuilder.com/
3. Lighthouse audit in Chrome DevTools

## Icon Design Tips

- Keep emoji/logo centered and on a solid background
- Use high contrast (orange on white works well)
- Test on different backgrounds
- Ensure readability at small sizes (192x192)

## If You're In a Hurry

Use this command with a PNG version of your logo:

```bash
# Using ImageMagick
convert icon.png -resize 192x192 icon-192x192.png
convert icon.png -resize 256x256 icon-256x256.png
convert icon.png -resize 384x384 icon-384x384.png
convert icon.png -resize 512x512 icon-512x512.png
```
