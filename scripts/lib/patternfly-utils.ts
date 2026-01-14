/**
 * Shared utilities for PatternFly component analysis and conversion
 *
 * This module consolidates common logic used across multiple scripts:
 * - Component exclusion configuration
 * - Import extraction from TypeScript and Markdown files
 * - Markdown→TSX conversion helpers
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../..');

/**
 * Component exclusions configuration
 */
export interface ComponentExclusions {
  layouts: string[];
  styling: string[];
}

/**
 * Load component exclusions from config file
 */
export function loadExclusions(): ComponentExclusions {
  const configPath = join(rootDir, '.config/component-exclusions.json');

  if (!existsSync(configPath)) {
    throw new Error(
      `Component exclusions config not found: ${configPath}\n`
      + 'Expected file: .config/component-exclusions.json'
    );
  }

  try {
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch (error) {
    throw new Error(
      `Failed to parse component exclusions config: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Check if a component should be ignored (layout or styling component)
 * @param name - The component name to check
 */
export function shouldIgnoreComponent(name: string): boolean {
  const exclusions = loadExclusions();
  return [...exclusions.layouts, ...exclusions.styling].includes(name);
}

/**
 * Check if a component is a layout component
 * @param name - The component name to check
 */
export function isLayoutComponent(name: string): boolean {
  return loadExclusions().layouts.includes(name);
}

/**
 * Check if a component is a styling component
 * @param name - The component name to check
 */
export function isStylingComponent(name: string): boolean {
  return loadExclusions().styling.includes(name);
}

/**
 * Import item extracted from a file
 */
export interface ImportItem {
  name: string;
  source: string;
}

/**
 * Imports categorized by source
 */
export interface ImportsBySource {
  patternfly: string[];
  relative: string[];
  icons: string[];
}

/**
 * Extract imports from TypeScript file
 *
 * @param filePath - Path to TypeScript file
 * @param options - Options for import extraction
 * @param options.separateBySource - If true, return imports separated by source
 * @param options.filterFn - Optional filter function to check if a name is a valid component
 * @returns Array of import names or categorized imports by source
 */
export function extractImports(
  filePath: string,
  options: {
    separateBySource?: boolean;
    filterFn?: (name: string) => boolean;
  } = {}
): string[] | ImportsBySource {
  const { separateBySource = false, filterFn = () => true } = options;

  if (!existsSync(filePath)) {
    return separateBySource ?
      { patternfly: [], relative: [], icons: [] }
      : [];
  }

  const content = readFileSync(filePath, 'utf-8');
  const patternflyImports: string[] = [];
  const relativeImports: string[] = [];
  const iconImports: string[] = [];

  // Match import statements from @patternfly/react-core
  const patternflyImportRegex = /import\s+{([^}]+)}\s+from\s+['"]@patternfly\/react-core['"]/g;
  let match: RegExpExecArray | null;

  while ((match = patternflyImportRegex.exec(content)) !== null) {
    const importList = match[1]
        .split(',')
        .map(item => item.trim().replace(/\s+as\s+\w+/, ''))
        .filter(item => item && filterFn(item));

    patternflyImports.push(...importList);
  }

  // Match relative imports from same directory, parent directory, or subdirectories
  const relativeImportRegex = /import\s+{([^}]+)}\s+from\s+['"]\.\.?\//g;

  while ((match = relativeImportRegex.exec(content)) !== null) {
    const importList = match[1]
        .split(',')
        .map(item => item.trim().replace(/\s+as\s+\w+/, ''))
        .filter(item => item && filterFn(item));

    relativeImports.push(...importList);
  }

  // Match default imports from @patternfly/react-icons
  const iconImportRegex = /import\s+(\w+Icon)\s+from\s+['"]@patternfly\/react-icons/g;

  while ((match = iconImportRegex.exec(content)) !== null) {
    iconImports.push(match[1]);
  }

  // Return combined array or separated by source
  if (!separateBySource) {
    return [...new Set([...patternflyImports, ...relativeImports, ...iconImports])];
  }

  return {
    patternfly: [...new Set(patternflyImports)],
    relative: [...new Set(relativeImports)],
    icons: [...new Set(iconImports)],
  };
}

/**
 * Extract imports from markdown code blocks
 * Parses inline code examples in markdown files to find component dependencies
 *
 * @param mdPath - Path to markdown file
 * @returns Array of import items (name and source)
 */
export function extractImportsFromMarkdown(mdPath: string): ImportItem[] {
  if (!existsSync(mdPath)) {
    return [];
  }

  const content = readFileSync(mdPath, 'utf-8');
  const imports: ImportItem[] = [];

  // Split by markdown headings (### )
  const sections = content.split(/^### /m).slice(1);

  for (const section of sections) {
    // Find inline code blocks (not file references)
    const codeMatch = section.match(/```(?:js|jsx|tsx)\n([\s\S]*?)```/);
    if (!codeMatch) {
      continue;
    }

    // Skip if it's a file reference
    const [firstLine] = codeMatch[1].trim().split('\n');
    if (firstLine.includes('file=')) {
      continue;
    }

    const code = codeMatch[1].trim();

    // Extract imports from the code block
    const importRegex = /import\s+(?:{([^}]+)}|(\w+))\s+from\s+['"]([^'"]+)['"]/g;
    let match: RegExpExecArray | null;

    while ((match = importRegex.exec(code)) !== null) {
      const namedImports = match[1] ? match[1].split(',').map(s => s.trim()) : [];
      const defaultImport = match[2] ? [match[2]] : [];
      const [, , , source] = match;

      const allImports = [...namedImports, ...defaultImport]
          .filter((name): name is string => !!name && /^[A-Z]/.test(name)); // PascalCase (likely components)

      allImports.forEach(name => {
        imports.push({ name, source });
      });
    }
  }

  return imports;
}

/**
 * Extract imports with more specific options
 *
 * @param code - Code string to extract imports from
 * @returns Array of import names
 */
export function extractImportedNames(code: string): Set<string> {
  const importedNames = new Set<string>();

  // Match import statements: import { A, B, C } from '...';
  const importPattern = /import\s+\{([^}]+)\}\s+from\s+['"][^'"]+['"]/g;
  let match: RegExpExecArray | null;

  while ((match = importPattern.exec(code)) !== null) {
    const imports = match[1].split(',').map(name => name.trim());
    imports.forEach(importName => {
      // Handle "as" aliases: import { A as B }
      const parts = importName.split(/\s+as\s+/);
      const actualName = parts.length > 1 ? parts[1].trim() : parts[0].trim();
      importedNames.add(actualName);
    });
  }

  return importedNames;
}

/**
 * Detect if code contains bare JSX (no export, no const declaration)
 * Pattern: imports followed by JSX expression ending with semicolon
 *
 * Example bare JSX:
 *   import { Avatar } from '@patternfly/react-core';
 *   <Avatar src={img} alt="avatar" />;
 * @param code - The code string to check
 */
export function isBareJsx(code: string): boolean {
  // Remove comments and whitespace
  const cleaned = code
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*/g, '')
      .trim();

  // Split into lines
  const lines = cleaned.split('\n').filter(line => line.trim());

  // Check if code has:
  // 1. No 'export' keyword
  // 2. No 'const' declarations (except in imports)
  // 3. Ends with JSX (starts with < after imports)

  const hasExport = /^export\s+/.test(cleaned);
  const hasConstDeclaration = /^const\s+\w+\s*[=:]/.test(cleaned.replace(/^import.*/gm, ''));

  if (hasExport || hasConstDeclaration) {
    return false;
  }

  // Find first non-import line
  let firstNonImport = '';
  for (const line of lines) {
    if (!line.startsWith('import ')) {
      firstNonImport = line;
      break;
    }
  }

  // Check if it starts with JSX (< followed by uppercase letter or Fragment)
  return /^<[A-Z]/.test(firstNonImport) || /^<Fragment/.test(firstNonImport);
}

/**
 * Transform bare JSX into proper React component export
 *
 * Input:
 *   import { Avatar } from '@patternfly/react-core';
 *   <Avatar src={img} alt="avatar" />;
 *
 * Output:
 *   import { Avatar } from '@patternfly/react-core';
 *
 *   export const AvatarBasic: React.FunctionComponent = () => (
 *     <Avatar src={img} alt="avatar" />
 *   );
 * @param code - The code string to transform
 * @param exportName - The name for the exported component
 */
export function transformBareJsx(code: string, exportName: string): string {
  // Split into imports and JSX
  const lines = code.split('\n');
  const imports: string[] = [];
  const jsxLines: string[] = [];

  let inJsx = false;
  for (const line of lines) {
    if (line.trim().startsWith('import ')) {
      imports.push(line);
    } else if (line.trim()) {
      inJsx = true;
      jsxLines.push(line);
    } else if (inJsx) {
      jsxLines.push(line);
    }
  }

  // Get JSX content and remove trailing semicolon
  let jsx = jsxLines.join('\n').trim();
  if (jsx.endsWith(';')) {
    jsx = jsx.slice(0, -1);
  }

  // Indent JSX (2 spaces)
  const indentedJsx = jsx.split('\n').map(line =>
    line ? `  ${line}` : line
  ).join('\n');

  // Build transformed code
  return `${imports.join('\n')}

export const ${exportName}: React.FunctionComponent = () => (
${indentedJsx}
);
`;
}

/**
 * Transform inline code to proper React component format
 * - Adds export statement
 * - Adds React.FunctionComponent type annotation
 * - Optionally renames component to match filename
 *
 * Returns: { code: transformed code, exportName: final export name }
 * @param code - The code string to transform
 * @param exportName - The desired export name
 * @param shouldRename - Whether to rename the component (default: true)
 */
export function transformInlineCode(
  code: string,
  exportName: string,
  shouldRename = true
): { code: string; exportName: string } {
  // Extract the original component name from the code
  // Match patterns like: const ComponentName = () => (
  const componentMatch = code.match(/const\s+(\w+)\s*[=:]/);
  const originalName = componentMatch ? componentMatch[1] : null;

  if (!originalName) {
    // If we couldn't find the pattern, add export to the beginning
    return { code: `export ${code}`, exportName };
  }

  let transformed = code;
  let finalExportName = exportName;

  if (shouldRename && originalName !== exportName) {
    // Rename to match filename AND check for conflicts
    const importedNames = extractImportedNames(code);

    if (importedNames.has(exportName)) {
      // Conflict detected - add "Example" suffix
      // PanelHeader → PanelHeaderExample
      finalExportName = `${exportName}Example`;
    }

    // Replace the component declaration with export + type annotation + new name
    const declarationPattern = new RegExp(`const\\s+${originalName}\\s*=`, 'g');
    transformed = transformed.replace(
      declarationPattern,
      `export const ${finalExportName}: React.FunctionComponent =`
    );
  } else {
    // Keep original name (no rename, no conflict check needed)
    const declarationPattern = new RegExp(`const\\s+${originalName}\\s*=`, 'g');
    transformed = transformed.replace(
      declarationPattern,
      `export const ${originalName}: React.FunctionComponent =`
    );
    finalExportName = originalName;
  }

  return { code: transformed, exportName: finalExportName };
}

/**
 * Demo extracted from markdown file
 */
export interface ExtractedDemo {
  filename: string;
  code: string;
  exportName: string;
}

/**
 * Extract inline code blocks from markdown file and transform to TSX
 *
 * @param mdPath - Path to markdown file
 * @param componentName - Name of component (e.g., "Panel")
 * @returns Array of extracted demos with filename and code
 */
export function extractInlineCodeFromMd(
  mdPath: string,
  componentName: string
): ExtractedDemo[] {
  if (!existsSync(mdPath)) {
    return [];
  }

  const content = readFileSync(mdPath, 'utf-8');
  const demos: ExtractedDemo[] = [];

  // Split by markdown headings (### )
  const sections = content.split(/^### /m).slice(1);

  for (const section of sections) {
    const lines = section.split('\n');
    const title = lines[0].trim();

    // Find inline code blocks (not file references)
    const codeMatch = section.match(/```(?:js|jsx|tsx)\n([\s\S]*?)```/);
    if (!codeMatch) {
      continue;
    }

    // Skip if it's a file reference
    const [firstLine] = codeMatch[1].trim().split('\n');
    if (firstLine.includes('file=')) {
      continue;
    }

    const code = codeMatch[1].trim();

    // Generate filename from title (for URL routing)
    // "Basic" → "PanelBasic"
    // "Header and footer" → "PanelHeaderAndFooter"
    let fileName = title
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join('');

    if (!fileName.startsWith(componentName)) {
      fileName = componentName + fileName;
    }

    // Transform code but KEEP original const name (don't rename)
    // This preserves the markdown author's naming choices
    // (e.g., "HeaderPanel" instead of "PanelHeader")
    // which avoids import conflicts
    const { code: transformedCode, exportName: finalExportName } =
      transformInlineCode(code, fileName, false);

    demos.push({
      filename: `${fileName}.tsx`,
      code: `${transformedCode}\n`,
      exportName: finalExportName,
    });
  }

  return demos;
}
