# NextV Movie Recommendation App - Quick Start Deployment

## What's Ready ✅

Your app is now configured and ready for deployment! Here's what we've set up:

### ✅ App Configuration

- Bundle identifier: `com.nextv.movierecommendation`
- Version: 1.0.0
- iOS and Android builds configured
- EAS Build and Submit profiles ready

### ✅ Icons & Assets

- iOS icon: 1024x1024 PNG created
- Android adaptive icons: foreground, background, monochrome
- Splash screen configured

### ✅ Build System

- EAS CLI installed and configured
- Build profiles: development, preview, production
- Auto-increment version numbers

## Quick Commands

### Build Your App

```bash
# Build for iOS App Store
npm run build:ios

# Build for Google Play Store
npm run build:android

# Build for both platforms
npm run build:all

# Build preview versions for testing
npm run build:preview
```

### Submit to Stores

```bash
# Submit to App Store (after iOS build completes)
npm run submit:ios

# Submit to Google Play Store (after Android build completes)
npm run submit:android

# Submit to both stores
npm run submit:all
```

## Next Steps

### 1. Create Developer Accounts

- **Apple Developer Account**: $99/year at [developer.apple.com](https://developer.apple.com)
- **Google Play Console**: $25 one-time at [play.google.com/console](https://play.google.com/console)

### 2. Start with Preview Build

```bash
npm run build:preview
```

This creates internal builds you can test on devices without going through store review.

### 3. Test Your App

- Download preview builds to test on real devices
- Share with beta testers
- Fix any issues before production build

### 4. Production Build & Submit

```bash
# When ready for stores
npm run build:all
# Then after builds complete
npm run submit:all
```

## Important Notes

### Before First Build

1. Make sure you're logged into EAS: `npx eas login`
2. Your backend API should be deployed and accessible
3. Test your app thoroughly in development

### Store Requirements

- **App Store**: Need app description, screenshots, privacy policy
- **Play Store**: Need store listing, content rating, target audience info

### Review Times

- **iOS**: 1-7 days
- **Android**: 1-3 days

## Need Help?

Check the full `DEPLOYMENT_GUIDE.md` for detailed instructions, troubleshooting, and store setup guides.

Ready to deploy? Run `npm run build:preview` to create your first build! 🚀
