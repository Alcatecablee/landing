import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateFavicon() {
  const svgPath = path.join(__dirname, '../client/public/favicon.svg');
  const icoPath = path.join(__dirname, '../client/public/favicon.ico');

  try {
    // Convert SVG to PNG with multiple sizes (16x16, 32x32, 48x48)
    const sizes = [16, 32, 48];
    const pngBuffers = await Promise.all(
      sizes.map(size => 
        sharp(svgPath)
          .resize(size, size)
          .png()
          .toBuffer()
      )
    );

    // Write the PNG buffer directly as ICO
    // This is a simple implementation - for production, you might want to use a proper ICO generator
    fs.writeFileSync(icoPath, Buffer.concat(pngBuffers));
    
    console.log('Favicon.ico generated successfully!');
  } catch (error) {
    console.error('Error generating favicon:', error);
  }
}

generateFavicon(); 