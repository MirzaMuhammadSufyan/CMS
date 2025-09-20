# CMS Magic - Punjab Police CMS Enhancement Extension

A powerful Chrome extension that enhances the functionality of the Punjab Police Complaint Management System (CMS) website.

## Features

### 🌙 Dark Mode
- Toggle dark mode for better viewing experience
- Persistent across all pages of the CMS website
- Fixed button positioned in top-right corner
- Smooth transitions and visual feedback

### 📝 Bulk Edit All Records
- **Only available on Pucar15 page**: https://cms.punjabpolice.gov.pk/complaint/Pucar15
- Adds "Bulk Edit All Records" button after the filter button
- Opens all complaint edit links in new tabs automatically
- Auto-fills forms in each tab with predefined data:
  - **CNIC field**: `0000000000000`
  - **Name field**: Appends "15 Caller" to existing name, or "Unknown 15 Caller" if empty
  - **Father name**: Appends "15 Caller" to existing name, or "Unknown 15 Caller" if empty
  - **Place of occurrence**: Copies from permanent address field
  - **Incident date**: Sets to current date and time

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the CMS Magic folder
5. The extension will be installed and ready to use

## Usage

### Dark Mode
- Click the 🌙 button in the top-right corner of any CMS page
- Dark mode preference is automatically saved and persists across all pages
- Use keyboard shortcut `Ctrl + Shift + D` to toggle dark mode

### Bulk Edit Feature
- Navigate to the Pucar15 page: https://cms.punjabpolice.gov.pk/complaint/Pucar15
- Click the "Bulk Edit All Records" button that appears after the filter button
- All complaint edit links will open in new tabs automatically
- Forms will be auto-filled with the predefined data

## Compatibility

- **Target Website**: https://cms.punjabpolice.gov.pk/
- **Browser**: Chrome (Manifest V3)
- **Permissions**: Active tab, storage, scripting

## Development

### File Structure
```
CMS/
├── manifest.json          # Extension manifest
├── content.js            # Content script for page enhancement
├── content.css           # Styles for injected elements
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── popup.css             # Popup styles
├── background.js         # Background service worker
├── icons/                # Extension icons
└── README.md             # This file
```

### Key Components

1. **Content Script** (`content.js`): Injects functionality into CMS pages
2. **Popup Interface** (`popup.html/js`): Extension control panel
3. **Background Script** (`background.js`): Handles extension lifecycle and messaging
4. **Manifest** (`manifest.json`): Extension configuration and permissions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly on CMS pages
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, feature requests, or questions:
1. Check the extension popup help section
2. Review the keyboard shortcuts
3. Ensure you're on a supported CMS page
4. Check browser console for any error messages

## Version History

- **v2.0.0**: Simplified and focused release
  - Removed floating magic button and panel
  - Removed unnecessary features (notifications, export, search, auto-refresh, bulk actions)
  - Dark mode button fixed in top-right corner, persistent across all pages
  - Bulk edit feature only available on Pucar15 page
  - Streamlined codebase and improved performance
  - Enhanced auto-fill functionality with multiple retry attempts

- **v1.0.0**: Initial release with core functionality
  - Magic panel and floating button
  - Notification management
  - Data export capabilities
  - Quick search functionality
  - Auto refresh toggle
  - Dark mode support
  - Bulk actions for tables
  - Keyboard shortcuts
  - Settings persistence
