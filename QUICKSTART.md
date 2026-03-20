# Quick Start Guide

## Running Your App

### 1. Start the Development Server

```bash
cd /home/micha/RSA/athlete-app
npm start
```

This will open the Expo Developer Tools in your terminal with a QR code.

### 2. Test on Your Phone (Recommended)

**For iOS:**
1. Install "Expo Go" from the App Store
2. Open the Camera app
3. Scan the QR code from the terminal
4. Tap the notification to open in Expo Go

**For Android:**
1. Install "Expo Go" from Google Play
2. Open Expo Go app
3. Tap "Scan QR Code"
4. Scan the QR code from the terminal

### 3. Test on Emulator/Simulator

**Android Emulator:**
```bash
npm run android
```

**iOS Simulator (macOS only):**
```bash
npm run ios
```

**Web Browser:**
```bash
npm run web
```

## Current Features

### ✅ Implemented
- 5 main screens with navigation:
  - **Home** - Dashboard with stats overview
  - **Recovery** - Injury tracking and consistency
  - **Streaks** - Track training, recovery, nutrition, and sleep streaks
  - **Challenges** - Compete with teammates
  - **Profile** - Settings and caregiver management
- Bottom tab navigation with icons
- TypeScript support
- Local storage utilities
- Date helper functions

### 🚧 Coming Next
- Functional injury logging
- Working streak calculations
- Activity tracking
- Reminder system
- Challenge creation and leaderboards

## Project Structure Overview

```
src/
├── screens/       # All 5 main screens
├── navigation/    # Tab and stack navigation
├── types/        # TypeScript interfaces
├── storage/      # AsyncStorage helpers
├── utils/        # Date formatting, streak calculations
└── components/   # Reusable UI components (empty for now)
```

## Customization

### Change App Name
Edit `app.json`:
```json
{
  "expo": {
    "name": "Your App Name",
    "slug": "your-app-slug"
  }
}
```

### Change Colors
The app currently uses:
- Primary: `#007AFF` (blue)
- Success: `#34C759` (green)
- Background: `#f5f5f5` (light gray)

Search for these hex codes in the screen files to customize.

## Troubleshooting

### Can't find module errors
```bash
npm install
```

### Metro bundler issues
```bash
npm start -- --clear
```

### Port already in use
```bash
npm start -- --port 8081
```

## Next Steps

1. **Run the app** to see the UI
2. **Customize the screens** to match your vision
3. **Add functionality** - Start with injury logging or streak tracking
4. **Test with real data** - Add forms and storage integration

Happy coding! 🚀
