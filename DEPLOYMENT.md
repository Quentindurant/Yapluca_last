# YapluCa Mobile App - Deployment Guide

## 🚀 Development Build Setup

### Prerequisites
- Node.js and npm installed
- Android SDK with required components
- Java JDK 21
- USB debugging enabled on Android device

### Environment Setup

1. **Install Android SDK**
```bash
# Download Android Command Line Tools
wget https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip

# Extract and setup
mkdir -p ~/Android/sdk
cd ~/Android/sdk && unzip ~/commandlinetools-linux-11076708_latest.zip
mkdir cmdline-tools && mv cmdline-tools temp && mv temp cmdline-tools/latest

# Configure environment variables
echo 'export ANDROID_HOME=$HOME/Android/sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools' >> ~/.bashrc
source ~/.bashrc
```

2. **Install Java and Accept Licenses**
```bash
sudo apt install default-jdk
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --licenses
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### Build and Deploy

1. **Install Dependencies**
```bash
cd mobile
npm install
npm install expo-dev-client react-native-maps
```

2. **Configure Development Build**
```bash
npx expo prebuild --clean
```

3. **Build for Android**
```bash
export ANDROID_HOME=$HOME/Android/sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools
npx expo run:android
```

4. **Manual Installation (if needed)**
```bash
adb devices  # Verify device connection
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

## 📱 Device Configuration

### Enable Developer Options
1. Go to **Settings** → **About Phone**
2. Tap **Build Number** 7 times
3. Enable **Developer Options**

### Enable USB Debugging
1. Go to **Settings** → **Developer Options**
2. Enable **USB Debugging**
3. Authorize computer when prompted

### Allow Unknown Sources
1. Go to **Settings** → **Security** → **Unknown Sources**
2. Or **Settings** → **Apps** → **Special Access** → **Install Unknown Apps**
3. Allow installation from ADB/USB

## 🗺️ Map Features

### Interactive Map (react-native-maps)
- Real-time user location tracking
- Custom markers for charging stations
- Callout popups with station details
- Navigation integration with Google Maps
- Professional YapluCa branding

### Station Data Integration
- ChargeNow API for real charging station data
- OpenRouteService API for navigation
- Firebase authentication and data storage
- Real-time availability updates

## 🔧 Troubleshooting

### Common Issues

1. **Module not found errors**: Ensure expo-dev-client is installed
2. **Build failures**: Check Android SDK components are installed
3. **Installation blocked**: Enable unknown sources on device
4. **USB not detected**: Check cable supports data transfer

### Build Requirements
- Minimum Android API 24
- Target Android API 36
- NDK 27.1.12297006
- Gradle 8.14.3

## 📦 Production Deployment

For production builds, use EAS Build:
```bash
npx eas build --platform android --profile production
```

## 🎯 Testing Checklist

- [ ] App launches successfully
- [ ] Authentication flows work
- [ ] Map displays with user location
- [ ] Station markers appear correctly
- [ ] Callouts show station details
- [ ] Navigation to Google Maps works
- [ ] All UI elements display properly
- [ ] Firebase data syncs correctly

## 📱 App Features

### Core Functionality
- User authentication (email/password, social login)
- Interactive map with charging stations
- Station details and availability
- Battery rental system
- User profile and history
- Real-time location services

### Technical Stack
- React Native with Expo
- react-native-maps for native map functionality
- Firebase (Auth, Firestore, Storage)
- ChargeNow API for station data
- OpenRouteService for navigation

---

**Status**: ✅ Fully deployed and functional on Android devices
**Last Updated**: September 14, 2025
