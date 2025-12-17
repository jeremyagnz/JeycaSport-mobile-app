# Development Guide

## Project Overview

JeycaSports Stats App is a mobile-first React Native application built with Expo and TypeScript. This guide provides detailed information for developers working on this project.

## Technology Stack

- **React Native**: 0.81.5
- **React**: 19.1.0
- **Expo**: ~54.0
- **TypeScript**: ~5.9.2
- **ESLint**: 8.57.0
- **Prettier**: 3.2.5

## Getting Started

### First Time Setup

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start development**: `npm start`
4. **Test on device**: Install Expo Go and scan QR code

### Development Workflow

1. Make code changes
2. See instant updates on your device/emulator
3. Run linting and type checking before committing
4. Push changes and create a pull request

## Project Structure

### Source Directory (`src/`)

```
src/
├── components/       # Reusable UI components
│   └── index.ts      # Component exports
├── screens/          # Application screens
│   ├── HomeScreen.tsx
│   └── index.ts
├── navigation/       # Navigation setup
│   └── index.ts
├── services/         # API clients
│   └── index.ts
├── hooks/            # Custom React hooks
│   └── index.ts
├── utils/            # Utility functions
│   └── index.ts
├── types/            # TypeScript types
│   └── index.ts
├── constants/        # App constants
│   └── index.ts
├── theme/            # Theme system
│   ├── colors.ts
│   ├── spacing.ts
│   ├── typography.ts
│   └── index.ts
└── assets/           # Static assets
```

## Using the Theme System

Always use the theme for consistent styling:

```typescript
import { theme } from '../theme';

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
});
```

## Code Quality

### Before Committing

Always run these commands:

```bash
npm run type-check   # TypeScript validation
npm run lint:fix     # Fix linting issues
npm run format       # Format code
```

## Best Practices

1. **Component Design**
   - Keep components small and focused
   - Use functional components with hooks
   - Extract reusable logic into custom hooks

2. **State Management**
   - Start with local state
   - Use Context API for shared state
   - Consider Redux/Zustand for complex state

3. **Performance**
   - Use React.memo for expensive components
   - Optimize images before adding
   - Use FlatList for long lists

4. **TypeScript**
   - Use strict mode (enabled by default)
   - Define interfaces for all data structures
   - Avoid `any` type

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
