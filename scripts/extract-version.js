
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function extractLatestVersion() {
  try {
    const changelogPath = path.join(__dirname, '..', 'public', 'CHANGELOG.md');
    const changelogContent = fs.readFileSync(changelogPath, 'utf8');
    
    // Match the first occurrence of ## [x.y.z] format
    const versionMatch = changelogContent.match(/## \[(\d+\.\d+\.\d+)\]/);
    
    if (!versionMatch) {
      console.error('No version found in CHANGELOG.md');
      process.exit(1);
    }
    
    const version = versionMatch[1];
    console.log(`Extracted version: ${version}`);
    
    // Generate version.ts file
    const versionFileContent = `// This file is auto-generated during build
export const APP_VERSION = '${version}';
`;
    
    const versionFilePath = path.join(__dirname, '..', 'src', 'constants', 'version.ts');
    
    // Ensure constants directory exists
    const constantsDir = path.dirname(versionFilePath);
    if (!fs.existsSync(constantsDir)) {
      fs.mkdirSync(constantsDir, { recursive: true });
    }
    
    fs.writeFileSync(versionFilePath, versionFileContent);
    console.log(`Version file generated: ${versionFilePath}`);
    
    return version;
  } catch (error) {
    console.error('Error extracting version:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  extractLatestVersion();
}

module.exports = { extractLatestVersion };
