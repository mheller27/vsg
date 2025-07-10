import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const THUMBNAIL_WIDTH = 1000;
const THUMBNAIL_HEIGHT = 750;
const QUALITY = 95;

async function generateThumbnails() {
  const assetsDir = path.join(__dirname, '../public/assets');
  
  // Get all property directories
  const properties = fs.readdirSync(assetsDir).filter(dir => 
    fs.statSync(path.join(assetsDir, dir)).isDirectory()
  );

  for (const property of properties) {
    console.log(`Processing ${property}...`);
    const propertyDir = path.join(assetsDir, property);
    
    // Get all subdirectories (amenities, building, residences, etc.)
    const subdirs = fs.readdirSync(propertyDir).filter(dir => 
      fs.statSync(path.join(propertyDir, dir)).isDirectory()
    );

    for (const subdir of subdirs) {
      const subdirPath = path.join(propertyDir, subdir);
      
      // Create thumbnails directory
      const thumbnailsDir = path.join(subdirPath, 'thumbnails');
      if (!fs.existsSync(thumbnailsDir)) {
        fs.mkdirSync(thumbnailsDir, { recursive: true });
      }

      // Get all jpg files
      const files = fs.readdirSync(subdirPath).filter(file => 
        file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
      );

      for (const file of files) {
        const inputPath = path.join(subdirPath, file);
        const outputPath = path.join(thumbnailsDir, file);

        // Skip if thumbnail already exists
        if (fs.existsSync(outputPath)) {
          console.log(`  Skipping ${subdir}/${file} (thumbnail exists)`);
          continue;
        }

        try {
          await sharp(inputPath)
            .resize(THUMBNAIL_WIDTH, THUMBNAIL_HEIGHT, {
              fit: 'cover',
              position: 'center'
            })
            .jpeg({ quality: QUALITY })
            .toFile(outputPath);
          
          console.log(`  Generated thumbnail for ${subdir}/${file}`);
        } catch (error) {
          console.error(`  Error processing ${subdir}/${file}:`, error.message);
        }
      }
    }
  }
  
  console.log('Thumbnail generation complete!');
}

// Run the script
generateThumbnails().catch(console.error); 