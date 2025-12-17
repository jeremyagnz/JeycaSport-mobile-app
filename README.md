# JeycaSports Stats App

A mobile-first React Native application built with Expo and TypeScript for sports statistics tracking.

## 🚀 Features

- **TypeScript**: Fully typed codebase for better development experience
- **Expo**: Streamlined React Native development
- **Clean Architecture**: Scalable folder structure with separation of concerns
- **Production-Ready**: Configured with linting, formatting, and best practices
- **Mobile-First**: Optimized for mobile devices with responsive design

## 📁 Project Structure

```
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens/pages
│   ├── navigation/     # Navigation configuration
│   ├── services/       # API services and data fetching
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── types/          # TypeScript type definitions
│   ├── constants/      # App constants
│   ├── theme/          # Theme configuration (colors, spacing, typography)
│   └── assets/         # Images, fonts, and other static assets
├── assets/             # Expo managed assets (icons, splash screen)
├── App.tsx             # Main app component
└── app.json            # Expo configuration
```

## 🛠️ Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing)

## 📦 Installation

1. Clone the repository:

```bash
git clone https://github.com/jeremyagnz/JeycaSport-mobile-app.git
cd JeycaSport-mobile-app
```

2. Install dependencies:

```bash
npm install
```

## 🏃‍♂️ Running the App

### Development Mode

Start the development server:

```bash
npm start
```

This will open Expo Dev Tools in your browser. From there, you can:

- **Scan QR code** with Expo Go app (iOS/Android) to run on your physical device
- Press `a` to run on Android emulator
- Press `i` to run on iOS simulator (macOS only)
- Press `w` to run in web browser

### Testing on Your Phone (FREE) 📱

1. **Install Expo Go**:
   - **Android**: [Download from Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - **iOS**: [Download from App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Connect to the same network**: Make sure your phone and computer are on the same Wi-Fi network

3. **Start the app**: Run `npm start` in your terminal

4. **Scan the QR code**:
   - **Android**: Open Expo Go app and scan the QR code from the terminal or browser
   - **iOS**: Open Camera app and scan the QR code, then tap the notification to open in Expo Go

5. **See changes in real-time**: Any code changes you make will automatically refresh on your phone!

### Platform-Specific Commands

```bash
npm run android    # Run on Android emulator/device
npm run ios        # Run on iOS simulator (macOS only)
npm run web        # Run in web browser
```

## 🌐 Deployment Options

### Option 1: Expo App Distribution (Recommended for Testing)

**FREE** - Share your app with testers without publishing to stores

1. Create an Expo account at [expo.dev](https://expo.dev)

2. Install EAS CLI:

```bash
npm install -g eas-cli
```

3. Login to your account:

```bash
eas login
```

4. Build and publish a preview:

```bash
eas build --profile preview --platform android
# or for iOS
eas build --profile preview --platform ios
```

5. Share the build URL with testers - they can install directly on their devices!

### Option 2: Expo Publish (Development Builds)

**FREE** - Publish updates to your development app

```bash
# Publish your app
expo publish
```

Anyone with Expo Go can access your app by scanning the QR code or using the published URL.

### Option 3: Web Deployment with Netlify

**FREE** - Deploy the web version of your app

1. Build the web version:

```bash
npm run web
npx expo export --platform web
```

2. **Deploy to Netlify**:

   **Option A: Using Netlify CLI (Recommended)**

   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli

   # Login to Netlify
   netlify login

   # Deploy (from project root)
   netlify deploy --dir=dist --prod
   ```

   **Option B: Using Netlify Dashboard**
   - Go to [netlify.com](https://netlify.com) and sign up for FREE
   - Click "Add new site" → "Deploy manually"
   - Drag and drop the `dist` folder
   - Your site will be live at `https://your-app.netlify.app`

   **Option C: Continuous Deployment from GitHub**
   - Connect your GitHub repository to Netlify
   - Set build command: `npx expo export --platform web`
   - Set publish directory: `dist`
   - Every push to your repository will auto-deploy! 🚀

3. **Configure for React Native Web** (add to `netlify.toml`):

```toml
[build]
  command = "npx expo export --platform web"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 4: Production App Stores

For publishing to Google Play Store and Apple App Store:

```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

Note: Publishing to app stores requires:

- **Android**: One-time $25 Google Play Developer fee
- **iOS**: $99/year Apple Developer Program membership

## 🧪 Development

### Linting

```bash
npm run lint        # Check for linting errors
npm run lint:fix    # Fix linting errors automatically
```

### Formatting

```bash
npm run format       # Format all files
npm run format:check # Check formatting without modifying files
```

### Type Checking

```bash
npm run type-check   # Run TypeScript type checking
```

## 🎨 Theme System

The app uses a centralized theme system for consistent styling:

- **Colors**: Defined in `src/theme/colors.ts`
- **Spacing**: Defined in `src/theme/spacing.ts`
- **Typography**: Defined in `src/theme/typography.ts`

Import and use the theme in your components:

```typescript
import { theme } from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
});
```

## 💡 Quick Start Guide (For Testing on Phone)

1. **Install dependencies**: `npm install`
2. **Start the server**: `npm start`
3. **Install Expo Go** on your phone from your app store
4. **Scan the QR code** with Expo Go (Android) or Camera app (iOS)
5. **Start coding** - changes appear instantly on your phone! 🎉

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Authors

- Jeremy Agnz

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev/)
- React Native by Meta
- TypeScript by Microsoft
