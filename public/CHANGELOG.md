
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
- Playmode
- Game sync during play mode
- Filter by tournament legal or not

## [0.5.16] - 2025-07-01

### Fixed
- Army Builder routing issues causing black screen on builder page
- Removed lazy loading for Index page to resolve dynamic import errors
- Restored full Army Builder functionality after loading issues

## [0.5.15] - 2025-06-23

### Added
- Syenann Captain
- Warded Captain
  
## [0.5.14] - 2025-06-18

### Added
- Mounted Hetman unit added
- PWA to handle caching issues, still some quirks being worked out

## [0.5.13] - 2025-06-03

### Added
- Redirects from the old links to the main domain site (might be work in progress need more testing)

## [0.5.12] - 2025-05-30

### Updated
- Updated some information in Syenann. 
### Fixed
- Rebuilt the auth token checking and purging old data if there is a mismatch of versions so no more needing to manually clearing local storage (hopefully, tested it a bunch on our end so we'll see).
-  Unit cards and data should be 100% now.
### To Do
- Lots to do but the most important recent items are related to tournament play. We've added the data but want to carefully adjust the units to show tournament legal or not on the cards and in your lists and without breaking everything
- 
## [0.5.11] - 2025-05-29


### Added 
- System to clear/purge local cache data on version change to eliminate stale data
- Improved authnetication system to keep state throughout out
- Tournament Legal is added to the data but needs to be added to the builder in next update
- Performance optimization again for a smooth experience

### Fixed
- Units not showing correctly or their stats matching the data sheet we use
- Data not clearing locally such as auth tokens causing old app data to show up instead
- Units needing to be normalized so using a faction-id column to resolve the issue

## [0.5.10] - 2025-05-25

### Fixed
- Missing units again x2 but everything looks 100% locked down and images/portraits are good
- Cleaned out old code
- Updated the csv sheets format

  
## [0.5.9] - 2025-05-23

### Fixed
- Missing units again
  
## [0.5.8] - 2025-05-21

### Fixed
- Master Keorl not matching data
- Automatic storage purge not working correctly when version changes
### Updated
- Unit Validator to quickly check if units are not correct
- Version detection and storage purge mechanism for more reliable updates

## [0.5.6] - 2025-05-21 
-will update needed version change to refresh app
### Added
- Check for current version of the app and clear local storage if it has changed to refresh the site
### Fixed
- Will fill out later, had 7 lines worth and it did not save

  
## [0.5.3] - 2025-05-03
- Spanish translation support being added in live so we might miss some spots but will make sure we have full coverage. Spanish language cards soon.
- Replaced cards with High Res cards
- Fixed miscellaneous bugs

### In Progress
- Working on the social system and adding friends and also the notification system. We were informed of various issues and are working on them

## [0.5.0] - 2025-03-31

### Added
- Profile is now added. You can add your friends send messages and now a special ID called WAB_ID that you can use to play games
once Play Mode is finished up. Some features of the profile are still buggy but we are working on the important stuff first. 
  

## [0.4.6] - 2025-03-12

### Added 
- Sÿenann are being added as we get the data

### Fixed
- Minor UI improvements

### Testing
- Profile is in testing/development still

## [0.4.5] - 2025-03-02

### Fixed
- Broken code links to the art cards and portraits for Scions were fixed and improved card files

### [0.4.4] - 2025-03-01

### Added 
-Scions now added with portraits. No art cards yet but soon!
  
## [0.4.3] - 2025-02-37

### Added 
- Currently devloping the Profile feature to showcase wins/losses and some fun information to share, an avatar, and your lists. Full feature list will be documented.

### Fixed
-Saving a list locally would happen without a list name and creatre duplicate lists
-Swapped versions and Github repos after some issues syncing up

## [0.4.2] - 2025-02-20

### Added 
- Missions Page with details and deployment cards
- Updated navigation bar on several pages

## [0.4.1] - 2025-01-27

### Added 
- Better error handling on login and password change
  
### Fixed 
- Confirmation emails working correctly again. Everyone sign on up!
- Password reset is working now too!

## [0.3.2] - 2025-01-26

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
