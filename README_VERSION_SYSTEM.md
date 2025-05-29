
# Version-Based Storage Purge System

This system automatically clears localStorage and sessionStorage whenever a new version of the app is deployed, preventing stale state and auth issues.

## How It Works

1. **Build Time**: The `scripts/extract-version.js` script reads the latest version from `public/CHANGELOG.md` and generates `src/constants/version.ts` with the current app version.

2. **Runtime**: Before any React components load, `src/utils/versionPurge.ts` compares the injected version with the version stored in localStorage (key: `appVersion`).

3. **Version Mismatch**: If versions differ or no version is stored, all storage is cleared, the new version is saved, and the page reloads automatically.

## Files Involved

- `scripts/extract-version.js` - Extracts version from CHANGELOG.md and generates version.ts
- `src/constants/version.ts` - Auto-generated file containing the current app version
- `src/utils/versionPurge.ts` - Storage purge logic that runs before app initialization
- `src/App.tsx` - Modified to run version check before rendering
- `vite.config.ts` - Updated to run version extraction during build

## Build Process

1. During build, Vite runs the `extract-version` plugin
2. The plugin executes `scripts/extract-version.js`
3. The script parses `public/CHANGELOG.md` for the latest version (format: `## [x.y.z] - yyyy-mm-dd`)
4. A new `src/constants/version.ts` file is generated with the extracted version
5. The version is bundled into the app and available at runtime

## Manual Version Extraction

To manually extract the version (useful for testing):

```bash
node scripts/extract-version.js
```

This will update `src/constants/version.ts` with the latest version from the changelog.

## Development Notes

- The version check runs before any auth or app state loading
- If storage is purged, the page automatically reloads to start fresh
- The system gracefully handles errors and won't block app loading
- All storage operations are wrapped in try-catch blocks
- Console logging helps debug version check behavior
