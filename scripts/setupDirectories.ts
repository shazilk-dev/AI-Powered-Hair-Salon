/**
 * Directory Setup Script
 * Creates the hairstyle directory structure
 *
 * Usage: pnpm run setup-dirs
 */

import { mkdir, writeFile } from 'fs/promises';
import { join } from 'path';

const CATEGORIES = ['oval', 'round', 'square', 'heart', 'oblong', 'diamond'];
const PUBLIC_DIR = join(process.cwd(), 'public', 'hairstyles');

const FILE_STRUCTURE: Record<string, string[]> = {
  oval: [
    'long-layers.png',
    'textured-crop.png',
    'side-part.png',
    'messy-quiff.png',
    'slicked-back.png',
  ],
  round: [
    'high-fade-volume.png',
    'angular-fringe.png',
    'pompadour.png',
    'undercut.png',
    'textured-crop.png',
  ],
  square: [
    'soft-waves.png',
    'layered-fringe.png',
    'textured-brush-up.png',
    'medium-layers.png',
    'soft-side-part.png',
  ],
  heart: [
    'full-fringe.png',
    'chin-bob.png',
    'side-waves.png',
    'textured-crop.png',
    'medium-layers.png',
  ],
  oblong: [
    'horizontal-layers.png',
    'full-fringe.png',
    'chin-blunt.png',
    'side-bangs.png',
    'volume-crop.png',
  ],
  diamond: [
    'side-fringe.png',
    'chin-layers.png',
    'textured-quiff.png',
    'beard-combo.png',
    'slick-side.png',
  ],
};

async function createDirectoryStructure(): Promise<void> {
  console.log('📁 Creating directory structure...\n');

  for (const category of CATEGORIES) {
    const categoryPath = join(PUBLIC_DIR, category);
    const thumbsPath = join(categoryPath, 'thumbs');

    try {
      await mkdir(categoryPath, { recursive: true });
      await mkdir(thumbsPath, { recursive: true });
      console.log(`  ✅ Created: hairstyles/${category}/`);
      console.log(`  ✅ Created: hairstyles/${category}/thumbs/`);
    } catch (error) {
      console.error(`  ❌ Error creating ${category}:`, error);
    }
  }

  console.log('\n✅ Directory structure created successfully!\n');
}

async function generateReadme(): Promise<void> {
  const readme = `# Hairstyle Images

## Directory Structure

This directory contains hairstyle template images for the StyleAI project.

\`\`\`
public/hairstyles/
${CATEGORIES.map(
  (cat) => `├── ${cat}/
│   ├── ${FILE_STRUCTURE[cat].map((f) => f).join('\n│   ├── ')}
│   └── thumbs/
│       └── (auto-generated thumbnails)`
).join('\n')}
\`\`\`

## Image Requirements

- **Format:** PNG with transparent background
- **Dimensions:** 800x1200px (portrait, 2:3 ratio)
- **File size:** < 500KB each
- **Thumbnails:** 150x150px, < 50KB

## File Checklist

### OVAL Face (5 images)
${FILE_STRUCTURE.oval.map((f, i) => `- [ ] \`${f}\``).join('\n')}

### ROUND Face (5 images)
${FILE_STRUCTURE.round.map((f, i) => `- [ ] \`${f}\``).join('\n')}

### SQUARE Face (5 images)
${FILE_STRUCTURE.square.map((f, i) => `- [ ] \`${f}\``).join('\n')}

### HEART Face (5 images)
${FILE_STRUCTURE.heart.map((f, i) => `- [ ] \`${f}\``).join('\n')}

### OBLONG Face (5 images)
${FILE_STRUCTURE.oblong.map((f, i) => `- [ ] \`${f}\``).join('\n')}

### DIAMOND Face (5 images)
${FILE_STRUCTURE.diamond.map((f, i) => `- [ ] \`${f}\``).join('\n')}

## Generation Instructions

See **HAIRSTYLE_PROMPTS.md** in the project root for AI generation prompts.

## Processing Instructions

After placing PNG files in their respective directories:

\`\`\`bash
# Install dependencies
pnpm install

# Process and optimize images
pnpm run process-images
\`\`\`

This will:
1. Optimize images to meet size requirements
2. Generate thumbnails automatically
3. Validate transparency
4. Create processing report

## Notes

- All images must have transparent backgrounds
- Front-facing view only
- No face or body parts visible
- Hairstyle isolated in space
- See SPEC.md section 4.1 for detailed requirements
`;

  const readmePath = join(PUBLIC_DIR, 'README.md');
  await writeFile(readmePath, readme, 'utf-8');
  console.log('📄 Created: public/hairstyles/README.md\n');
}

async function generatePlaceholderInfo(): Promise<void> {
  console.log('📋 Expected Files:\n');

  let totalFiles = 0;

  for (const category of CATEGORIES) {
    console.log(`  ${category.toUpperCase()}:`);
    FILE_STRUCTURE[category].forEach((file) => {
      console.log(`    • ${file}`);
      totalFiles++;
    });
    console.log('');
  }

  console.log(`  Total: ${totalFiles} files needed\n`);
}

// Main execution
async function main() {
  console.log('🎨 AI Hair Salon - Directory Setup\n');
  console.log('='.repeat(50));
  console.log('');

  await createDirectoryStructure();
  await generateReadme();
  await generatePlaceholderInfo();

  console.log('='.repeat(50));
  console.log('');
  console.log('✨ Setup complete!');
  console.log('');
  console.log('Next steps:');
  console.log('  1. Generate images using prompts from HAIRSTYLE_PROMPTS.md');
  console.log('  2. Place PNG files in public/hairstyles/{category}/');
  console.log('  3. Run: pnpm run process-images');
  console.log('');
}

main().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
