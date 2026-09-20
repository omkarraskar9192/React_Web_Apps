# 🤖 Android APK Generation Guide for Habit Flow

This comprehensive guide explains how to convert your **Habit Flow** React + Vite project into an installable **Android APK** (`.apk`) using **Capacitor** (the modern, official successor to Apache Cordova).

---

## 📋 Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Step 1: Install Capacitor in Your Project](#step-1-install-capacitor-in-your-project)
3. [Step 2: Initialize Capacitor](#step-2-initialize-capacitor)
4. [Step 3: Build Your Web Production Code](#step-3-build-your-web-production-code)
5. [Step 4: Add the Android Platform](#step-4-add-the-android-platform)
6. [Step 5: Important Mobile API Configuration](#step-5-important-mobile-api-configuration)
7. [Step 6: Sync Web Assets to Android](#step-6-sync-web-assets-to-android)
8. [Step 7: Build the APK File](#step-7-build-the-apk-file)
   - [Method A: Fast CLI Build (No Android Studio needed)](#method-a-fast-cli-build)
   - [Method B: Using Android Studio](#method-b-using-android-studio)
9. [Step 8: Install and Test APK on Your Phone](#step-8-install-and-test-apk-on-your-phone)
10. [Troubleshooting & Pro Tips](#troubleshooting--pro-tips)

---

## 1. Prerequisites

Before starting, ensure you have:
1. **Node.js & npm** (already installed on your machine).
2. **Android Studio** (Free download from [developer.android.com/studio](https://developer.android.com/studio)):
   - Download and run the Android Studio installer.
   - During setup, ensure **Android SDK**, **Android SDK Command-line Tools**, and **Android SDK Build-Tools** are checked.
3. **Java JDK 17 or JDK 21** (Android Studio bundles its own JDK automatically, or install Temurin / OpenJDK).

---

## Step 1: Install Capacitor in Your Project

Open your PowerShell terminal in the project root (`04_Habit_Flow`):

```powershell
npm install @capacitor/core @capacitor/cli @capacitor/android
```

---

## Step 2: Initialize Capacitor

Initialize Capacitor with your App Name and Package ID:

```powershell
npx cap init "Habit Flow" "com.habitflow.app" --web-dir "dist"
```

This creates a `capacitor.config.json` (or `capacitor.config.ts`) file in the root of your project:
```json
{
  "appId": "com.habitflow.app",
  "appName": "Habit Flow",
  "webDir": "dist",
  "server": {
    "androidScheme": "https",
    "cleartext": true
  }
}
```

---

## Step 3: Build Your Web Production Code

Vite compiles all your React components, Tailwind styling, and icons into static HTML, CSS, and JS bundles inside the `dist/` directory:

```powershell
npm run build
```

Verify that the `dist/` directory exists and contains `index.html` and `assets/`.

---

## Step 4: Add the Android Platform

Add the native Android native wrapper project:

```powershell
npx cap add android
```

This will generate an `android/` directory in your project containing a complete Android native Gradle project.

---

## Step 5: Important Mobile API Configuration

### Why this is needed:
When your app runs on an Android phone, `http://localhost:5000` refers to the **phone itself**, **not** your computer running the Node.js backend.

### Option 1: Testing locally over Wi-Fi
1. Find your computer's local IP address:
   ```powershell
   ipconfig
   ```
   Look for `IPv4 Address`, e.g., `192.168.1.15`.
2. In `src/services/api.js`, set the base URL to your computer's local IP:
   ```javascript
   const API_BASE_URL = 'http://192.168.1.15:5000/api'
   ```
3. Make sure your phone and PC are connected to the same Wi-Fi network.
4. Allow cleartext HTTP in `android/app/src/main/AndroidManifest.xml`:
   Inside the `<application>` tag, add `android:usesCleartextTraffic="true"`:
   ```xml
   <application
       android:usesCleartextTraffic="true"
       android:allowBackup="true"
       ... >
   ```

### Option 2: Production Cloud Backend (Recommended for live app)
Deploy `server/server.js` to a cloud service (e.g. Render, Railway, fly.io, or Heroku), and point `API_BASE_URL` to:
```javascript
const API_BASE_URL = 'https://your-habitflow-backend.onrender.com/api'
```

---

## Step 6: Sync Web Assets to Android

Whenever you make changes to your React frontend, run:

```powershell
npm run build
npx cap sync android
```

This copies the latest `dist/` build directly into the Android project (`android/app/src/main/assets/public`).

---

## Step 7: Build the APK File

### Method A: Fast CLI Build (PowerShell)

You can build the APK directly from your command line without opening Android Studio GUI:

```powershell
cd android
.\gradlew assembleDebug
```

> If you are on Linux or macOS, run `./gradlew assembleDebug`.

Once the Gradle build finishes, your APK will be generated at:
```
android\app\build\outputs\apk\debug\app-debug.apk
```

---

### Method B: Using Android Studio GUI

1. Open the Android project in Android Studio:
   ```powershell
   npx cap open android
   ```
2. Wait for Android Studio to sync the Gradle project (bottom progress bar).
3. In the top navigation menu, click:
   **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**
4. Once completed, Android Studio will show a pop-up in the bottom right corner with a clickable **locate** link pointing directly to `app-debug.apk`.

---

## Step 8: Install and Test APK on Your Phone

1. **Transfer the APK**:
   - Send `app-debug.apk` to your phone via USB cable, Google Drive, Telegram, or WhatsApp.
2. **Install**:
   - Open your phone's File Manager and tap `app-debug.apk`.
   - If prompted with "Install unknown apps", toggle **Allow from this source**.
   - Tap **Install**.
3. **Run Habit Flow**:
   - Open **Habit Flow** from your app drawer.
   - It will open as a full-screen, native-feeling Android app with offline storage, streak tracking, habit completion, and cloud login!

---

## ?? Quick Reference Script

To build an updated APK in one go, you can add this convenient script to your `package.json`:

```json
"scripts": {
  "build:apk": "npm run build && npx cap sync android && cd android && gradlew assembleDebug && cd .."
}
```

Now, anytime you update your app, just run:
```powershell
npm run build:apk
```
And grab your fresh APK from `android/app/build/outputs/apk/debug/app-debug.apk`!

