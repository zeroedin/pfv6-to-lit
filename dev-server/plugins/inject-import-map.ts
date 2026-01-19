import type { Plugin } from '@web/dev-server-core';
import { parse, serialize } from 'parse5';
import { isElementNode, query, setTextContent } from '@parse5/tools';

interface ImportMap {
  imports: Record<string, string>;
  scopes: Record<string, Record<string, string>>;
}

/**
 * Plugin that injects an import map into HTML files for module resolution
 */
export function injectImportMapPlugin(): Plugin {
  return {
    name: 'inject-import-map',
    transform(context) {
      // Only process HTML files
      if (context.response.is('html')) {
        const document = parse(context.body as string);
        const importMapNode = query(document, node =>
          isElementNode(node)
            && node.tagName === 'script'
            && node.attrs.some(attr =>
              attr.name === 'type' && attr.value === 'importmap'));

        if (importMapNode && isElementNode(importMapNode)) {
          // React from CDN (kept external in Vite build)
          // PatternFly is now bundled locally in react-demos/dist/shared/
          // and imported directly via relative paths from demo files
          const json: ImportMap = {
            imports: {
              '@pfv6/elements/': '/elements/',
              'lit': 'https://cdn.jsdelivr.net/npm/lit@3.3.1/index.js',
              'lit/': 'https://cdn.jsdelivr.net/npm/lit@3.3.1/',
              '@lit/context': 'https://cdn.jsdelivr.net/npm/@lit/context@1.1.6/development/index.js',
              'tslib': 'https://cdn.jsdelivr.net/npm/tslib@2.8.1/tslib.es6.mjs',
              '@floating-ui/dom': 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.7.4/+esm',
              '@floating-ui/core': 'https://cdn.jsdelivr.net/npm/@floating-ui/core@1.7.4/+esm',
              '@floating-ui/utils': 'https://cdn.jsdelivr.net/npm/@floating-ui/utils@0.2.9/+esm',
              '@floating-ui/utils/dom': 'https://cdn.jsdelivr.net/npm/@floating-ui/utils@0.2.9/dom/+esm',
              'react': 'https://cdn.jsdelivr.net/npm/react@19.2.0/+esm',
              'react/jsx-runtime': 'https://cdn.jsdelivr.net/npm/react@19.2.0/jsx-runtime/+esm',
              'react-dom': 'https://cdn.jsdelivr.net/npm/react-dom@19.2.0/+esm',
              'react-dom/client': 'https://cdn.jsdelivr.net/npm/react-dom@19.2.0/client/+esm',
            },
            scopes: {
              'https://cdn.jsdelivr.net/npm/': {
                '@lit/context': 'https://cdn.jsdelivr.net/npm/@lit/context@1.1.6/development/index.js',
                '@lit/reactive-element': 'https://cdn.jsdelivr.net/npm/@lit/reactive-element@2.1.0/reactive-element.js',
                '@lit/reactive-element/decorators/': 'https://cdn.jsdelivr.net/npm/@lit/reactive-element@2.1.0/decorators/',
                'lit': 'https://cdn.jsdelivr.net/npm/lit@3.3.1/index.js',
                'lit/': 'https://cdn.jsdelivr.net/npm/lit@3.3.1/',
                'lit-element/lit-element.js': 'https://cdn.jsdelivr.net/npm/lit-element@4.2.0/lit-element.js',
                'lit-html': 'https://cdn.jsdelivr.net/npm/lit-html@3.3.0/lit-html.js',
                'lit-html/': 'https://cdn.jsdelivr.net/npm/lit-html@3.3.0/',
                'tslib': 'https://cdn.jsdelivr.net/npm/tslib@2.8.1/tslib.es6.mjs',
                '@floating-ui/dom': 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.7.4/+esm',
                '@floating-ui/core': 'https://cdn.jsdelivr.net/npm/@floating-ui/core@1.7.4/+esm',
                '@floating-ui/utils': 'https://cdn.jsdelivr.net/npm/@floating-ui/utils@0.2.9/+esm',
                '@floating-ui/utils/dom': 'https://cdn.jsdelivr.net/npm/@floating-ui/utils@0.2.9/dom/+esm',
                'react': 'https://cdn.jsdelivr.net/npm/react@19.2.0/+esm',
                'react/jsx-runtime': 'https://cdn.jsdelivr.net/npm/react@19.2.0/jsx-runtime/+esm',
                'react-dom': 'https://cdn.jsdelivr.net/npm/react-dom@19.2.0/+esm',
                'react-dom/client': 'https://cdn.jsdelivr.net/npm/react-dom@19.2.0/client/+esm',
                'scheduler': 'https://cdn.jsdelivr.net/npm/scheduler@0.27.0/+esm',
              },
            },
          };

          setTextContent(importMapNode, JSON.stringify(json, null, 2));
          return serialize(document);
        }
      }
    },
  };
}

