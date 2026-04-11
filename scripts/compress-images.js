/**
 * Compress large PNG images in public/ to reduce Vercel connection reset errors
 * Keeps PNG format (for compatibility) but applies lossy compression
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

const targets = [
  'FINALSOHAM.png',
  'Multi-Chat.png',
  'Hist.png',
  'search.png',
  'com.png',
  'web.png',
  'harsh.png',
  'security.png',
  'an.png',
  'icon-192x192.png',
  'eng.png',
];

async function compress() {
  for (const file of targets) {
    const filePath = path.join(publicDir, file);
    if (!fs.existsSync(filePath)) {
      console.log(`Skipping ${file} (not found)`);
      continue;
    }

    const before = fs.statSync(filePath).size;
    const tmpPath = filePath + '.tmp';

    try {
      await sharp(filePath)
        .png({ quality: 80, compressionLevel: 9, effort: 10 })
        .toFile(tmpPath);

      const after = fs.statSync(tmpPath).size;

      // Only replace if smaller
      if (after < before) {
        fs.renameSync(tmpPath, filePath);
        console.log(`✓ ${file}: ${Math.round(before/1024)}KB → ${Math.round(after/1024)}KB (saved ${Math.round((before-after)/1024)}KB)`);
      } else {
        fs.unlinkSync(tmpPath);
        console.log(`- ${file}: already optimal (${Math.round(before/1024)}KB)`);
      }
    } catch (err) {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      console.error(`✗ ${file}: ${err.message}`);
    }
  }
}

compress();
