#!/usr/bin/env node
/**
 * PatternFly Cache Setup Script
 *
 * Downloads PatternFly v6.4.0 release archives to .cache/ for component conversion reference.
 * These repositories are used by AI agents to analyze React component APIs and CSS
 * when converting PatternFly React components to LitElement web components.
 *
 * Exits early if repositories already exist.
 *
 * Usage: npm run cache
 *
 * Note: This is a development-only script. Not needed for CI/CD or production builds.
 * Only run this when you need to convert PatternFly components.
 */

import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, renameSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');
const CACHE_DIR = join(PROJECT_ROOT, '.cache');

interface Repository {
  name: string;
  repo: string;
  version: string;
  path: string;
}

const REPOS: Repository[] = [
  {
    name: 'patternfly-react',
    repo: 'patternfly/patternfly-react',
    version: '6.4.0',
    path: join(CACHE_DIR, 'patternfly-react'),
  },
  {
    name: 'patternfly',
    repo: 'patternfly/patternfly',
    version: '6.4.0',
    path: join(CACHE_DIR, 'patternfly'),
  },
];

function log(message: string): void {
  console.log(`[patternfly-cache] ${message}`);
}

function checkIfReposExist(): boolean {
  return REPOS.every(repo => existsSync(repo.path));
}

function downloadAndExtract(repo: Repository): void {
  log(`Downloading ${repo.name} v${repo.version}...`);

  const zipUrl = `https://github.com/${repo.repo}/archive/refs/tags/v${repo.version}.tar.gz`;
  const tempFile = join(CACHE_DIR, `${repo.name}-${repo.version}.tar.gz`);
  const extractedName = `${repo.name}-${repo.version}`;
  const extractedPath = join(CACHE_DIR, extractedName);

  try {
    // Download the release tarball
    log(`Downloading from ${zipUrl}...`);
    execSync(`curl -L -o "${tempFile}" "${zipUrl}"`, {
      stdio: 'inherit',
      cwd: CACHE_DIR,
    });

    // Extract the tarball
    log(`Extracting ${repo.name}...`);
    execSync(`tar -xzf "${tempFile}" -C "${CACHE_DIR}"`, {
      stdio: 'inherit',
      cwd: CACHE_DIR,
    });

    // Rename extracted folder to expected name (removes version suffix)
    if (existsSync(extractedPath)) {
      renameSync(extractedPath, repo.path);
    }

    // Clean up downloaded tarball
    rmSync(tempFile);

    log(`✅ Successfully downloaded and extracted ${repo.name}`);
  } catch (error) {
    console.error(`❌ Failed to download ${repo.name}:`, error);

    // Clean up on failure
    if (existsSync(tempFile)) {
      rmSync(tempFile);
    }
    if (existsSync(extractedPath)) {
      rmSync(extractedPath, { recursive: true, force: true });
    }

    process.exit(1);
  }
}

function main(): void {
  log('Checking PatternFly cache repositories...');

  // Check if all repos already exist
  if (checkIfReposExist()) {
    log('✅ All PatternFly repositories already cached. Skipping download.');
    process.exit(0);
  }

  // Ensure .cache directory exists
  if (!existsSync(CACHE_DIR)) {
    log(`Creating .cache directory...`);
    mkdirSync(CACHE_DIR, { recursive: true });
  }

  // Download and extract any missing repos
  for (const repo of REPOS) {
    if (!existsSync(repo.path)) {
      downloadAndExtract(repo);
    } else {
      log(`⏭️  ${repo.name} already exists, skipping.`);
    }
  }

  log('✅ PatternFly cache setup complete!');
}

main();
