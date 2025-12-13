/**
 * Image Processing Script
 * Optimizes and creates thumbnails for hairstyle images
 *
 * Usage: pnpm run process-images
 */

import sharp from 'sharp';
import { readdir, mkdir, stat } from 'fs/promises';
import { join } from 'path';

const CATEGORIES = ['oval', 'round', 'square', 'heart', 'oblong', 'diamond'];
const PUBLIC_DIR = join(process.cwd(), 'public', 'hairstyles');

// Image specifications from SPEC.md
const SPECS = {
  main: {
    width: 800,
    height: 1200,
    quality: 80,
    maxSize: 500 * 1024, // 500KB
  },
  thumb: {
    size: 150,
    quality: 70,
    maxSize: 50 * 1024, // 50KB
  },
};

interface ProcessingStats {
  processed: number;
  errors: number;
  totalSize: number;
  thumbsGenerated: number;
}

async function ensureDirectory(path: string): Promise<void> {
  try {
    await mkdir(path, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }
}

async function getFileSize(path: string): Promise<number> {
  try {
    const stats = await stat(path);
    return stats.size;
  } catch {
    return 0;
  }
}

async function optimizeImage(
  inputPath: string,
  outputPath: string,
  options: { width: number; height: number; quality: number }
): Promise<void> {
  await sharp(inputPath)
    .resize(options.width, options.height, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({
      quality: options.quality,
      compressionLevel: 9,
      palette: true, // Use palette for smaller file size
    })
    .toFile(outputPath);
}

async function createThumbnail(
  inputPath: string,
  outputPath: string
): Promise<void> {
  await sharp(inputPath)
    .resize(SPECS.thumb.size, SPECS.thumb.size, {
      fit: 'cover',
      position: 'top', // Focus on top of hairstyle
    })
    .png({
      quality: SPECS.thumb.quality,
      compressionLevel: 9,
      palette: true,
    })
    .toFile(outputPath);
}

async function processCategory(category: string): Promise<ProcessingStats> {
  const stats: ProcessingStats = {
    processed: 0,
    errors: 0,
    totalSize: 0,
    thumbsGenerated: 0,
  };

  const categoryPath = join(PUBLIC_DIR, category);
  const thumbsPath = join(categoryPath, 'thumbs');

  console.log(`\n📁 Processing ${category.toUpperCase()} category...`);

  try {
    // Ensure directories exist
    await ensureDirectory(categoryPath);
    await ensureDirectory(thumbsPath);

    // Read all PNG files in category
    const files = await readdir(categoryPath);
    const pngFiles = files.filter(
      (f) => f.endsWith('.png') && !f.includes('-opt')
    );

    if (pngFiles.length === 0) {
      console.log(`  ⚠️  No PNG files found in ${category}/`);
      return stats;
    }

    // Process each file
    for (const file of pngFiles) {
      const inputPath = join(categoryPath, file);
      const optimizedPath = join(categoryPath, file.replace('.png', '-opt.png'));
      const thumbnailPath = join(thumbsPath, file);

      try {
        // Check original size
        const originalSize = await getFileSize(inputPath);

        console.log(`  🖼️  Processing: ${file}`);
        console.log(`     Original: ${(originalSize / 1024).toFixed(2)} KB`);

        // Optimize main image
        await optimizeImage(inputPath, optimizedPath, {
          width: SPECS.main.width,
          height: SPECS.main.height,
          quality: SPECS.main.quality,
        });

        const optimizedSize = await getFileSize(optimizedPath);
        console.log(`     Optimized: ${(optimizedSize / 1024).toFixed(2)} KB`);

        // Create thumbnail
        await createThumbnail(inputPath, thumbnailPath);

        const thumbSize = await getFileSize(thumbnailPath);
        console.log(`     Thumbnail: ${(thumbSize / 1024).toFixed(2)} KB`);

        // Warn if file is too large
        if (optimizedSize > SPECS.main.maxSize) {
          console.log(`     ⚠️  WARNING: Optimized file exceeds 500KB!`);
        }

        stats.processed++;
        stats.totalSize += optimizedSize;
        stats.thumbsGenerated++;

        console.log(`     ✅ Done`);

      } catch (error) {
        console.error(`     ❌ Error processing ${file}:`, error);
        stats.errors++;
      }
    }

    console.log(`\n  📊 ${category}: Processed ${stats.processed}/${pngFiles.length} files`);

  } catch (error) {
    console.error(`  ❌ Error processing category ${category}:`, error);
  }

  return stats;
}

async function validateImageTransparency(imagePath: string): Promise<boolean> {
  try {
    const metadata = await sharp(imagePath).metadata();
    return metadata.hasAlpha === true;
  } catch {
    return false;
  }
}

async function validateAllImages(): Promise<void> {
  console.log('\n🔍 Validating transparency...');

  for (const category of CATEGORIES) {
    const categoryPath = join(PUBLIC_DIR, category);

    try {
      const files = await readdir(categoryPath);
      const pngFiles = files.filter((f) => f.endsWith('-opt.png'));

      for (const file of pngFiles) {
        const filePath = join(categoryPath, file);
        const hasAlpha = await validateImageTransparency(filePath);

        if (!hasAlpha) {
          console.log(`  ⚠️  ${category}/${file} - No transparency detected!`);
        }
      }
    } catch (error) {
      // Category might not exist yet
    }
  }

  console.log('  ✅ Transparency validation complete');
}

async function generateReport(allStats: ProcessingStats[]): Promise<void> {
  const totals = allStats.reduce(
    (acc, stats) => ({
      processed: acc.processed + stats.processed,
      errors: acc.errors + stats.errors,
      totalSize: acc.totalSize + stats.totalSize,
      thumbsGenerated: acc.thumbsGenerated + stats.thumbsGenerated,
    }),
    { processed: 0, errors: 0, totalSize: 0, thumbsGenerated: 0 }
  );

  console.log('\n' + '='.repeat(50));
  console.log('📈 PROCESSING REPORT');
  console.log('='.repeat(50));
  console.log(`Total images processed: ${totals.processed}/30`);
  console.log(`Thumbnails generated: ${totals.thumbsGenerated}`);
  console.log(`Total size: ${(totals.totalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`Average size: ${(totals.totalSize / totals.processed / 1024).toFixed(2)} KB`);
  console.log(`Errors: ${totals.errors}`);
  console.log('='.repeat(50));

  if (totals.processed < 30) {
    console.log(`\n⚠️  Missing ${30 - totals.processed} images!`);
    console.log('Check HAIRSTYLE_PROMPTS.md for required files');
  } else {
    console.log('\n✅ All 30 hairstyles processed successfully!');
  }
}

// Main execution
async function main() {
  console.log('🎨 AI Hair Salon - Image Processing Script');
  console.log('==========================================\n');

  const allStats: ProcessingStats[] = [];

  // Process each category
  for (const category of CATEGORIES) {
    const stats = await processCategory(category);
    allStats.push(stats);
  }

  // Validate transparency
  await validateAllImages();

  // Generate report
  await generateReport(allStats);

  console.log('\n✨ Processing complete!\n');
}

// Run the script
main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
