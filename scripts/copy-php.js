const fs = require('fs');
const path = require('path');

// Copy wp-oscp.php to dist/browser after build
const sourcePath = path.join(__dirname, '..', 'wp-oscp.php');
const destPath = path.join(__dirname, '..', 'dist', 'browser', 'wp-oscp.php');

// Ensure dist/browser exists
if (!fs.existsSync(path.dirname(destPath))) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
}

// Copy the file
fs.copyFileSync(sourcePath, destPath);

console.log('✅ wp-oscp.php copied to dist/browser');
