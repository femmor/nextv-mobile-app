# NextV Movie Recommendation App - Deployment Guide

This guide will walk you through deploying your React Native Expo app to both the Apple App Store and Google Play Store.

## Prerequisites

1. **Apple Developer Account** ($99/year)

   - Sign up at [developer.apple.com](https://developer.apple.com)
   - Required for App Store deployment

2. **Google Play Console Account** ($25 one-time fee)

   - Sign up at [play.google.com/console](https://play.google.com/console)
   - Required for Google Play Store deployment

3. **Expo Account** (Free)
   - Already created during EAS setup

## Pre-Deployment Checklist

### App Icons & Assets

- [x] App icon configured (1024x1024 PNG for iOS, various sizes for Android)
- [x] Splash screen configured
- [x] Android adaptive icons set up

### App Configuration

- [x] Bundle identifier set: `com.nextv.movierecommendation`
- [x] App version: `1.0.0`
- [x] Build numbers configured for auto-increment
- [x] Permissions properly declared

## Step 1: Build Your App

### For iOS (App Store)

1. **Build the iOS app:**

   ```bash
   npx eas build --platform ios --profile production
   ```

2. **Wait for the build to complete** (usually 15-30 minutes)
   - You'll get an email when it's done
   - You can check status at [expo.dev/accounts/your-username/projects/nextv-movie-recommendation/builds](https://expo.dev)

### For Android (Google Play Store)

1. **Build the Android app:**

   ```bash
   npx eas build --platform android --profile production
   ```

2. **Wait for the build to complete** (usually 10-20 minutes)

### Build Both Platforms

```bash
npx eas build --platform all --profile production
```

## Step 2: iOS App Store Deployment

### Prerequisites for iOS

1. **Apple Developer Account Setup:**

   - Add your Apple ID to `eas.json` submit configuration
   - Get your Apple Team ID from developer.apple.com
   - Create an App Store Connect app

2. **Create App in App Store Connect:**
   - Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Click "My Apps" → "+"
   - Choose "New App"
   - Fill in app information:
     - Platform: iOS
     - Name: NextV Movie Recommendation
     - Primary Language: English
     - Bundle ID: com.nextv.movierecommendation
     - SKU: nextv-movie-rec-001

### Submit to App Store

1. **Upload the build:**

   ```bash
   npx eas submit --platform ios --latest
   ```

2. **Alternative: Manual upload**

   - Download the `.ipa` file from EAS build
   - Use Transporter app or Xcode to upload

3. **Complete App Store Connect:**
   - Add app description, screenshots, keywords
   - Set pricing (Free)
   - Add privacy policy URL
   - Complete app review information
   - Submit for review

### Required App Store Assets

- App icon (1024x1024)
- Screenshots:
  - iPhone 6.7" (1290 x 2796) - 3 required
  - iPhone 6.5" (1284 x 2778) - Optional but recommended
  - iPad Pro (2048 x 2732) - If supporting iPad
- App description (4000 characters max)
- Keywords (100 characters max)
- Privacy policy URL
- Support URL

## Step 3: Google Play Store Deployment

### Prerequisites for Android

1. **Google Play Console Setup:**

   - Create app in Play Console
   - Complete store listing
   - Set up app signing

2. **Create App in Play Console:**
   - Go to [play.google.com/console](https://play.google.com/console)
   - Create app
   - App name: NextV Movie Recommendation
   - Default language: English
   - App or game: App
   - Free or paid: Free

### Submit to Google Play Store

1. **Upload the build:**

   ```bash
   npx eas submit --platform android --latest
   ```

2. **Alternative: Manual upload**

   - Download the `.aab` file from EAS build
   - Upload in Play Console under "Release" → "Production"

3. **Complete Play Console setup:**
   - App content questionnaire
   - Store listing (description, screenshots)
   - Content rating
   - Target audience
   - Privacy policy

### Required Google Play Assets

- App icon (512x512)
- Feature graphic (1024 x 500)
- Screenshots:
  - Phone screenshots (minimum 2, maximum 8)
  - Tablet screenshots (optional)
- Short description (80 characters)
- Full description (4000 characters)
- Privacy policy URL

## Step 4: Post-Deployment

### Monitor Your App

1. **Check build status:**

   ```bash
   npx eas build:list
   ```

2. **Check submission status:**
   ```bash
   npx eas submit:list
   ```

### App Store Review Process

- **iOS:** 1-7 days review process
- **Android:** 1-3 days review process

### Update Your App

When you need to release updates:

1. **Update version in app.json:**

   ```json
   {
     "expo": {
       "version": "1.0.1",
       "ios": {
         "buildNumber": "2"
       },
       "android": {
         "versionCode": 2
       }
     }
   }
   ```

2. **Build and submit:**
   ```bash
   npx eas build --platform all --profile production
   npx eas submit --platform all --latest
   ```

## Troubleshooting

### Common Issues

1. **Bundle Identifier Issues:**

   - Ensure it matches in app.json and developer accounts
   - Must be unique and follow reverse domain format

2. **Icon Issues:**

   - iOS requires 1024x1024 PNG with no transparency
   - Android needs adaptive icons (foreground, background, monochrome)

3. **Permission Issues:**

   - Declare all required permissions in app.json
   - Provide usage descriptions for sensitive permissions

4. **Build Failures:**
   - Check build logs in EAS dashboard
   - Common issues: missing assets, incorrect configurations

### Useful Commands

```bash
# Check EAS account
npx eas whoami

# Login to EAS
npx eas login

# View build history
npx eas build:list

# View submission history
npx eas submit:list

# Cancel a build
npx eas build:cancel [build-id]

# Download build artifacts
npx eas build:download [build-id]
```

## Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy](https://play.google.com/about/developer-policy/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer/)

## Next Steps

1. Start with a **preview build** to test on devices
2. Submit to **internal testing** first (TestFlight/Internal App Sharing)
3. Gather feedback and fix any issues
4. Submit to production stores
5. Monitor crash reports and user feedback
6. Plan regular updates and improvements

Good luck with your app deployment! 🚀
