// This script generates SVG icons for the PWA
// To use: node public/icons/generate-icons.js
// (Requires: npm install sharp)

const fs = require('fs')
const path = require('path')

// SVG template with HawkerCal branding
const createIconSVG = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#fffbf5"/>
  <rect width="${size}" height="${size}" fill="url(#grad)" rx="${Math.floor(size * 0.15)}"/>
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f97316;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ea580c;stop-opacity:1" />
    </linearGradient>
  </defs>
  <text x="50%" y="50%" font-family="system-ui, -apple-system, sans-serif" font-size="${Math.floor(size * 0.5)}" font-weight="bold" text-anchor="middle" dy="0.35em" fill="white">🍜</text>
</svg>`

const sizes = [192, 256, 384, 512]
const iconsDir = path.join(__dirname)

// Ensure directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true })
}

// Generate SVG icons
sizes.forEach(size => {
  const svg = createIconSVG(size)
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}.svg`), svg)
  console.log(`Created icon-${size}x${size}.svg`)

  // Also create maskable version
  fs.writeFileSync(path.join(iconsDir, `icon-${size}x${size}-maskable.svg`), svg)
  console.log(`Created icon-${size}x${size}-maskable.svg`)
})

console.log('Icons generated! To convert SVG to PNG, use an online tool or Sharp library.')
