# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/).

## [Planned Features or Updates] 
- New style
- Background Images
- Playmode
- Game sync during play mode
- Submitting scores 
- Scoreboards


## [Unreleased]
- Placeholder for changes in progress.

### [0.3.2] - 2025-01-26

### Added 
- Full Rules Reference Section
  
### Fixed 
- Cloud deletes were duplicating other cloud saves. Works as intended now.

### Known Issues
- Email conmfirmation and password resets. 
    -- We setup a custom Email server with Resend and they are having problems verifying our domain. The domain host is kind of whack so might have to
    plan for some downtime on the warcrowarmy.com domain but the project will stay live at it's backup links. Details TBD.

## [0.3.1] - 2025-01-21

### Added
- Ice Archers to Northern Tribes
## [0.3.0] - 2025-01-10

### Added
- warcrowarmy.com domain
- New email service

### Changed
- Navigation now properly redirects to landing page from sign in either as a guest or not choosing to log as a guest
- Updated logo consistency on login page
### Known Issues
- Reset Password not working, migrated email service platform awating verification of new domain

## [0.2.11] - 2025-01-04
### Added
- Guest mode functionality
- Improved navigation flow
- Updated login page with server migration notice

### Changed
- Navigation now properly redirects to landing page
- Updated logo consistency across pages

## [0.2.10] - 2025-01-03
### Added
- New feature: Export functionality for user data.

### Fixed
- Resolved bug causing app to go to 404 on page refresh.

## [0.2.9] - 2025-01-01
### Added
- Initial deployment to Netlify due to issues with Lovable hosting.
