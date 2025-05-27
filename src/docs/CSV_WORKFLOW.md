
# CSV-First Unit Data Workflow

## Overview

This document establishes the CSV files as the single source of truth for all unit data in the Warcrow Army Builder. This workflow ensures data consistency and prevents manual editing errors.

## Core Principles

1. **CSV is the Source of Truth**: All unit data originates from CSV files
2. **No Manual Static Edits**: TypeScript unit files are generated, never hand-edited
3. **Validation Before Deployment**: Always validate sync before publishing changes
4. **Structured Updates**: Follow the established process for all unit changes

## File Structure

### CSV Files Location
```
/public/data/reference-csv/units/
├── Northern Tribes.csv
├── The Syenann.csv
├── Hegemony of Embersig.csv
└── Scions of Taldabaoth.csv
```

### Generated Static Files Location
```
/src/data/factions/{faction-id}/
├── troops.ts
├── characters.ts
├── highCommand.ts
└── index.ts
```

## CSV Format Specification

### Required Columns
- **Unit Name**: Exact unit name as it appears in game
- **Unit Type**: `troop`, `character`, `high-command`
- **Faction**: Full faction name
- **Faction ID**: Normalized faction identifier
- **Command**: Numeric command value (empty if none)
- **AVB**: Availability number
- **Characteristics**: Comma-separated list (Character, Elite, etc.)
- **Keywords**: Comma-separated list (Join, Spellcaster, etc.)
- **High Command**: `Yes` or `No`
- **Points Cost**: Numeric point value
- **Special Rules**: Comma-separated list
- **Companion**: Optional companion unit ID

### Data Separation Rules

**Characteristics** (go in characteristics column):
- Character
- Elite
- High Command
- Any value in `/src/data/characteristicDefinitions.ts`

**Keywords** (go in keywords column):
- Join (specific units)
- Spellcaster
- Ambusher
- Dispel (color)
- Race/faction identifiers
- Any descriptive abilities

## Workflow Process

### Adding New Units

1. **Update CSV File**
   ```
   1. Open the appropriate faction CSV file
   2. Add new row with complete unit data
   3. Ensure all required fields are filled
   4. Use proper comma separation for lists
   5. Save CSV file
   ```

2. **Generate Static Files**
   ```
   1. Open Admin Panel > CSV Sync Manager
   2. Select the faction
   3. Click "Generate Files"
   4. Copy generated TypeScript code
   5. Replace existing static files
   ```

3. **Validate Changes**
   ```
   1. Run "Validate Only" to check sync
   2. Verify no mismatches exist
   3. Test in application
   4. Commit changes
   ```

### Updating Existing Units

1. **Modify CSV Data**
   - Edit the CSV file with new values
   - Maintain exact unit names and IDs
   - Follow data separation rules

2. **Regenerate and Replace**
   - Use CSV Sync Manager to generate new files
   - Replace all affected static files
   - Do not manually edit individual fields

3. **Verify Sync**
   - Run validation to confirm changes
   - Check for unintended side effects

### Data Validation

#### Regular Validation Tasks
- Run CSV Sync Manager validation weekly
- Check for missing units after CSV updates
- Verify field mismatches before releases

#### Common Issues and Solutions

**Missing Units**: Unit in CSV but not in static files
- Solution: Regenerate static files from CSV

**Extra Units**: Unit in static files but not in CSV
- Solution: Add unit to CSV or remove from static files

**Field Mismatches**: Different values between CSV and static
- Solution: Update CSV with correct values, regenerate

## Tools and Utilities

### CSV Sync Manager
Location: `Admin Panel > CSV Sync Manager`

Features:
- Generate TypeScript files from CSV
- Validate synchronization status
- Copy generated code to clipboard
- View detailed mismatch reports

### Validation Tools
Location: `Admin Panel > Unit Validation Tool`

Features:
- Compare CSV vs static data
- Identify data inconsistencies
- Generate sync reports

## Best Practices

### For Contributors

1. **Always Update CSV First**
   - Never edit static TypeScript files directly
   - Make all changes in the appropriate CSV file
   - Use the sync manager to generate static files

2. **Maintain Data Quality**
   - Use consistent naming conventions
   - Verify faction assignments
   - Check spelling and formatting

3. **Test Changes**
   - Validate sync after updates
   - Test units in the army builder
   - Verify all fields display correctly

### For Administrators

1. **Regular Maintenance**
   - Run weekly validation checks
   - Monitor for data drift
   - Update documentation as needed

2. **Release Process**
   - Validate all factions before deployment
   - Generate fresh static files
   - Document any breaking changes

## Troubleshooting

### Common Errors

**CSV Parse Errors**
- Check for malformed CSV data
- Verify column headers match specification
- Ensure proper comma escaping

**Validation Failures**
- Review mismatch reports carefully
- Check for manual edits to static files
- Verify CSV data integrity

**Missing Generated Content**
- Ensure CSV file is accessible
- Check faction ID mapping
- Verify unit categorization logic

### Emergency Procedures

If the CSV sync process fails:
1. Backup current static files
2. Revert to last known good CSV state
3. Regenerate all affected files
4. Validate complete synchronization
5. Document the issue for future prevention

## Contact and Support

For questions about this workflow:
- Check existing validation tools first
- Review this documentation
- Contact the development team with specific issues

---

**Remember**: CSV files are the authoritative source. Always start there for any unit data changes.
