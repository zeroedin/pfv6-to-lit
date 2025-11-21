#!/usr/bin/env tsx

/**
 * Copy PatternFly styles and assets from node_modules to dev-server
 * 
 * This script copies:
 * - @patternfly/react-core/dist/styles/base.css → dev-server/styles/patternfly/base.css
 * - @patternfly/patternfly/assets/fonts/** → dev-server/styles/assets/fonts/
 * - @patternfly/react-styles/css/assets/images/** → dev-server/assets/patternfly/images/
 * 
 * Note: This also serves as the asset source for React demo builds (via Vite aliases)
 */

import { cp, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

async function copyPatternFlyAssets() {
  console.log('📦 Copying PatternFly styles and assets...');

  try {
    // Create output directories
    const patternflyStylesDir = join(projectRoot, 'dev-server/styles/patternfly');
    const patternflyFontsDir = join(projectRoot, 'dev-server/styles/patternfly/assets/fonts');
    const imagesDir = join(projectRoot, 'dev-server/assets/patternfly/images');

    await mkdir(patternflyStylesDir, { recursive: true });
    await mkdir(patternflyFontsDir, { recursive: true });
    await mkdir(imagesDir, { recursive: true });

    // Copy PatternFly React base.css (includes tokens, resets, icons)
    const baseCssSource = join(
      projectRoot,
      'node_modules/@patternfly/react-core/dist/styles/base.css'
    );
    const baseCssDest = join(patternflyStylesDir, 'base.css');

    console.log('  ✓ Copying base.css...');
    await cp(baseCssSource, baseCssDest);

    // Copy PatternFly fonts (to location expected by base.css)
    const fontsSource = join(
      projectRoot,
      'node_modules/@patternfly/patternfly/assets/fonts'
    );

    console.log('  ✓ Copying fonts...');
    await cp(fontsSource, patternflyFontsDir, { recursive: true });

    // Copy PatternFly images (logos, etc.)
    const imagesSource = join(
      projectRoot,
      'node_modules/@patternfly/react-styles/css/assets/images'
    );

    console.log('  ✓ Copying images...');
    await cp(imagesSource, imagesDir, { recursive: true });

    // Copy React demo assets (avatarImg.svg, etc.)
    // These are used by React demo imports like ../../assets/avatarImg.svg
    const demoAssetsSource = join(
      projectRoot,
      'node_modules/@patternfly/react-core/src/demos/assets'
    );

    console.log('  ✓ Copying demo assets...');
    await cp(demoAssetsSource, imagesDir, { recursive: true, force: false });

    console.log('✅ PatternFly styles and assets copied successfully!');
    console.log(`   📄 base.css → ${baseCssDest}`);
    console.log(`   🔤 fonts → ${patternflyFontsDir}`);
    console.log(`   🖼️  images → ${imagesDir}`);
  } catch (error) {
    console.error('❌ Error copying PatternFly assets:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  copyPatternFlyAssets();
}

export { copyPatternFlyAssets };

