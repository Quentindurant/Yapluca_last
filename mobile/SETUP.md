# YapluCa Mobile App Setup Guide

## Prerequisites

1. **Node.js** (v16 or higher)
2. **Expo CLI**: `npm install -g @expo/cli`
3. **Firebase Project** with Authentication and Firestore enabled
4. **ChargeNow API** credentials
5. **OpenRouteService API** key

## Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual API keys in `.env`:

### Firebase Configuration
- Create a Firebase project at https://console.firebase.google.com
- Enable Authentication (Email/Password)
- Enable Firestore Database
- Enable Storage
- Get your config from Project Settings > General > Your apps

### ChargeNow API
- Contact ChargeNow for API credentials
- Get your username and password for API access

### OpenRouteService
- Sign up at https://openrouteservice.org
- Get your free API key

## Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npx expo start
   ```

3. Use Expo Go app on your phone or run on simulator

## API Integration Status

✅ **Firebase Authentication** - Email/password registration and login
✅ **ChargeNow API** - Real charging station data
✅ **User Profile** - Firebase user data integration
✅ **Location Services** - Expo Location for user position
🔄 **OpenRouteService** - Ready for navigation features

## Features

- **Authentication**: Register/Login with Firebase
- **Map Screen**: Real charging stations from ChargeNow API
- **Profile Screen**: User data from Firebase
- **Station Details**: Battery rental information
- **History**: Rental tracking (mock data)

## Troubleshooting

### Common Issues

1. **Metro bundler errors**: Clear cache with `npx expo start --clear`
2. **Location permissions**: Enable location services on device
3. **API errors**: Check your .env file has correct credentials
4. **Firebase errors**: Verify Firebase project configuration

### Development Tips

- Use `npx expo install` for Expo-compatible packages
- Check Expo documentation for platform-specific features
- Test on real device for location and camera features

## Next Steps

1. Test all authentication flows
2. Verify API data loading
3. Add error handling for network failures
4. Implement real payment integration
5. Add push notifications
6. Optimize performance and add animations
