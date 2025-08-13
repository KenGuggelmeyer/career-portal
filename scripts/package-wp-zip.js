#!/usr/bin/env node
/*
 * Packages ONLY the built static Angular portal files (dist/career-portal/browser)
 * into a flat zip (no extra top-level folder). Intended for direct upload.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const distBrowser = path.join(root, 'dist', 'career-portal', 'browser');
const outputDir = path.join(root, 'release');
const zipName = 'career-portal-static.zip';
const zipPath = path.join(outputDir, zipName);

function fail(msg) { console.error(msg); process.exit(1); }
if (!fs.existsSync(distBrowser)) fail('Missing dist/career-portal/browser. Run build first.');
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

try {
    if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);
    // Zip contents (.) so files are at archive root
    execSync(`cd ${distBrowser} && zip -r ${zipPath} . > /dev/null`);
    console.log('Created zip:', zipPath);
} catch (e) {
    fail('Failed to create zip: ' + e.message);
}
