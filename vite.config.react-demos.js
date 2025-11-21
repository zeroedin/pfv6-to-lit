import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
/**
 * Vite configuration for React comparison demos
 *
 * This builds React demos with PatternFly dependencies bundled locally.
 * React is kept external and loaded from CDN via import map.
 *
 * Output structure (Option C - Simple):
 * - react-demos/dist/pfv6-card/card.js - Demo entry points
 * - react-demos/dist/pfv6-card/tiles.js
 * - react-demos/dist/shared/patternfly-core-[hash].js - Shared PatternFly bundles
 * - react-demos/dist/shared/patternfly-styles-[hash].js
 * - react-demos/dist/patternfly.css - Main PatternFly CSS
 *
 * Benefits:
 * - Single outDir (no post-build script needed!)
 * - Simple relative imports (../shared/)
 * - No bundle duplication
 * - All React demos in one place
 *
 * This reduces network requests from 192+ to ~10-15 local files.
 */
/**
 * Rollup plugin to keep only React as external
 * PatternFly will be bundled locally to reduce CDN requests
 */
function externalReactOnly() {
    return {
        name: 'external-react-only',
        enforce: 'pre', // Run before Vite's default resolution
        resolveId(source) {
            // Keep React sub-path imports as-is (load from CDN)
            if (source.startsWith('react/') || source === 'react') {
                return { id: source, external: true };
            }
            if (source.startsWith('react-dom/') || source === 'react-dom') {
                return { id: source, external: true };
            }
            // Bundle everything else (including PatternFly)
            return null;
        }
    };
}
// Find all React demo files from /patternfly-react/ directory using demos.json manifest
function findReactDemos() {
    const reactDir = resolve('patternfly-react');
    const manifestPath = join(reactDir, 'demos.json');
    const demos = {};
    
    if (!existsSync(manifestPath)) {
        console.warn('⚠️  demos.json not found. Run: npm run postinstall');
        return demos;
    }
    
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'));
    
    for (const [componentName, componentData] of Object.entries(manifest.components)) {
        const componentDir = join(reactDir, componentName);
        
        for (const [kebabName, fileName] of Object.entries(componentData.demos)) {
            const fullPath = join(componentDir, fileName);
            
            if (existsSync(fullPath)) {
                // Entry name: Use original filename without extension
                // e.g., 'Card/CardBasic' (keeps PascalCase)
                const demoName = fileName.replace('.tsx', '');
                demos[`${componentName}/${demoName}`] = fullPath;
            }
        }
    }
    
    return demos;
}
export default defineConfig({
    plugins: [
        react(),
        externalReactOnly()
    ],
    // Resolve asset imports to existing PatternFly assets
    resolve: {
        alias: {
            // Map React demo asset imports to our copied PatternFly assets
            // These assets are copied by scripts/copy-patternfly-assets.ts
            '../../assets': resolve('dev-server/assets/patternfly/images'),
            '../assets': resolve('dev-server/assets/patternfly/images'),
            '../../PF-IconLogo.svg': resolve('dev-server/assets/patternfly/images/PF-IconLogo.svg'),
        }
    },
    // Pre-bundle PatternFly for performance, keep React external
    optimizeDeps: {
        include: [
            '@patternfly/react-core',
            '@patternfly/react-styles',
            '@patternfly/react-icons',
            '@patternfly/react-tokens'
        ],
        exclude: [
            'react',
            'react-dom',
            'react/jsx-runtime'
        ]
    },
    build: {
        // Don't clear the entire elements directory
        emptyOutDir: false,
        // Build all React demo files
        rollupOptions: {
            input: findReactDemos(),
            // Keep external imports as-is, don't resolve them
            makeAbsoluteExternalsRelative: false,
            preserveEntrySignatures: 'strict',
            // Split PatternFly into shared chunks
            output: {
                manualChunks(id) {
                    // Bundle all PatternFly packages into shared chunks
                    if (id.includes('node_modules/@patternfly')) {
                        if (id.includes('@patternfly/react-core')) {
                            return 'patternfly-core';
                        }
                        if (id.includes('@patternfly/react-styles')) {
                            return 'patternfly-styles';
                        }
                        if (id.includes('@patternfly/react-icons')) {
                            return 'patternfly-icons';
                        }
                        if (id.includes('@patternfly/react-tokens')) {
                            return 'patternfly-tokens';
                        }
                    }
                    // Bundle other node_modules into vendor chunk
                    if (id.includes('node_modules') && !id.includes('react')) {
                        return 'vendor';
                    }
                },
                // Output each demo to patternfly-react/dist/{Component}/{DemoName}.js
                // Entry name format: 'Card/CardBasic' -> 'Card/CardBasic.js'
                entryFileNames: (chunkInfo) => {
                    const name = chunkInfo.name;
                    // If name already contains '/', use it as-is (Component/DemoName)
                    if (name.includes('/')) {
                        return `${name}.js`;
                    }
                    return '[name]/bundle.js';
                },
                // Shared PatternFly bundles go to patternfly-react/dist/shared/
                // All demos import from ./dist/shared/[name]-[hash].js
                chunkFileNames: (chunkInfo) => {
                    // All shared chunks go to dist/shared/
                    return 'shared/[name]-[hash].js';
                },
                assetFileNames: (assetInfo) => {
                    // Use consistent filename for PatternFly CSS (no hash)
                    if (assetInfo.name?.includes('patternfly-styles')) {
                        return 'patternfly.css';
                    }
                    return 'assets/[name]-[hash][extname]';
                }
            }
        },
        // Output everything to patternfly-react/dist/ (all demos and shared bundles)
        outDir: 'patternfly-react/dist',
        // Don't minify in development mode
        minify: process.env.NODE_ENV === 'production',
        // Source maps for debugging
        sourcemap: true
    }
});
//# sourceMappingURL=vite.config.react-demos.js.map