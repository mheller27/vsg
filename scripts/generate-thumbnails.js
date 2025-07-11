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
      
      // Handle regular folders (amenities, building, residences, etc.)
      if (subdir !== 'units') {
        await processFolder(subdirPath, subdir);
      } else {
        // Handle units folder - process each unit's gallery
        const unitsDir = path.join(propertyDir, 'units');
        if (fs.existsSync(unitsDir)) {
          const unitDirs = fs.readdirSync(unitsDir).filter(dir => 
            fs.statSync(path.join(unitsDir, dir)).isDirectory()
          );
          
          for (const unitDir of unitDirs) {
            const unitPath = path.join(unitsDir, unitDir);
            const galleryPath = path.join(unitPath, 'gallery');
            
            if (fs.existsSync(galleryPath)) {
              await processFolder(galleryPath, `units/${unitDir}/gallery`);
            }
          }
        }
      }
    }
  }
  
  console.log('Thumbnail generation complete!');
}

async function processFolder(folderPath, folderName) {
  // Create thumbnails directory
  const thumbnailsDir = path.join(folderPath, 'thumbnails');
  if (!fs.existsSync(thumbnailsDir)) {
    fs.mkdirSync(thumbnailsDir, { recursive: true });
  }

  // Get all jpg files
  const files = fs.readdirSync(folderPath).filter(file => 
    file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
  );

  for (const file of files) {
    const inputPath = path.join(folderPath, file);
    const outputPath = path.join(thumbnailsDir, file);

    // Skip if thumbnail already exists
    if (fs.existsSync(outputPath)) {
      console.log(`  Skipping ${folderName}/${file} (thumbnail exists)`);
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
      
      console.log(`  Generated thumbnail for ${folderName}/${file}`);
    } catch (error) {
      console.error(`  Error processing ${folderName}/${file}:`, error.message);
    }
  }
}

// Run the script
generateThumbnails().catch(console.error); 