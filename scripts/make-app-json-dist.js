#!/usr/bin/env node
/*
 * Copies the authoritative app.json used for build into a snapshot file
 * next to wp-oscp.php (WordPress plugin) as app.json.dist so the plugin
 * can later revert to the original shipped configuration.
 */
const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const pluginDir = repoRoot; // wp-oscp.php sits at root
const pluginSnapshot = path.join(pluginDir, 'app.json.dist');

// Determine which app.json the static build will use:
// For static config in angular.json, it pulls from src/configuration/static/app.json
const staticConfigPath = path.join(repoRoot, 'src', 'configuration', 'static', 'app.json');
const fallbackRootAppJson = path.join(repoRoot, 'src', 'app.json');

let source;
if (fs.existsSync(staticConfigPath)) {
    source = staticConfigPath;
} else if (fs.existsSync(fallbackRootAppJson)) {
    source = fallbackRootAppJson;
} else {
    console.error('No source app.json found (expected src/configuration/static/app.json or src/app.json)');
    process.exit(1);
}

try {
    const srcStat = fs.statSync(source);
    if (!srcStat.isFile()) throw new Error('Source is not a file');
    const content = fs.readFileSync(source);
    // Only overwrite if content changed to preserve original snapshot intentionally
    let shouldWrite = true;
    if (fs.existsSync(pluginSnapshot)) {
        const existing = fs.readFileSync(pluginSnapshot);
        if (Buffer.compare(existing, content) === 0) {
            shouldWrite = false;
        }
    }
    if (shouldWrite) {
        fs.writeFileSync(pluginSnapshot, content);
        console.log(`Created/updated app.json.dist from ${path.relative(repoRoot, source)}`);
    } else {
        console.log('app.json.dist already up to date; no change');
    }
} catch (e) {
    console.error('Failed to create app.json.dist:', e.message);
    process.exit(1);
}
