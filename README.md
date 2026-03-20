# Athlete Recovery App (TSA Geo)

A React Native mobile app built for athletes to track injuries, build recovery streaks, and stay accountable with teammates through challenges. Built with Expo and Firebase.

**Core focus: Recovery.** Everything in the app is built around helping athletes recover smarter and stay consistent.

---

## Features

- **Recovery Streak Ring** — Circular progress ring tracking consecutive days of recovery toward your personal goal
- **Injury & Recovery Plans** — Log injuries, work through recovery tasks, monitor progress to being cleared
- **Challenges & Leaderboard** — Create team challenges and compete with teammates
- **Google Sign-In** — Secure Firebase authentication, no password needed
- **Onboarding** — Personalized setup on first launch: role, sport, recovery goal, streak target
- **Profile** — Google avatar, streak stats, sign out

---

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| React Native 0.76.9 | Mobile framework |
| Expo 52 | Build platform and dev tooling |
| Expo Router 4 | File-based navigation |
| TypeScript 5.3 | Type safety |
| Firebase Auth | Google Sign-In authentication |
| Firebase Firestore | Challenges, leaderboard, user profiles |
| NativeWind 4 | Tailwind CSS styling for React Native |
| React Context | Local app state |

---

## Project Structure

```
TSA Geo/
├── app/
│   ├── _layout.tsx          # Root layout — AuthProvider + route guard
│   ├── login.tsx            # Login screen (Google Sign-In)
│   ├── onboarding.tsx       # First-time setup flow (5 steps)
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigation (auth + onboarding protected)
│       ├── index.tsx        # Home — recovery ring, injury alerts, challenges
│       ├── recovery.tsx     # Injury & recovery plan tracking
│       ├── challenges.tsx   # Team challenges + leaderboard
│       └── profile.tsx      # User profile + streak stats + sign out
├── context/
│   ├── AppContext.tsx        # Local app state (injuries, streaks, activities)
│   └── AuthContext.tsx      # Firebase auth + onboarding status + user profile
├── lib/
│   ├── firestore.ts         # All Firestore read/write functions
│   ├── db.ts                # Seed/default data
│   └── helpers.ts           # Date utilities
├── components/ui/           # Shared UI components (Card, Button, Text, etc.)
├── types/index.ts           # TypeScript interfaces
├── app.json                 # Expo config (package name, plugins)
├── eas.json                 # EAS build profiles (dev / preview / production)
└── .gitignore
```

---

## User Flow

```
App open
  └── Firebase checks session
        ├── No session → /login (Google Sign-In)
        └── Signed in
              ├── First time → /onboarding (5 steps, saved to Firestore)
              └── Returning → /(tabs) home screen
```

**Onboarding steps (first launch only):**
1. Role — Athlete / Coach / Parent / Captain
2. Sport
3. Recovery goal — Recover from Injury / Stay Consistent / Return to Competition / Maintain Fitness
4. What to track — Recovery / Sleep / Nutrition / Light Training
5. Streak goal — 7 / 14 / 30 / 60 days

---

## Firebase Setup Summary

| What | Value |
|------|-------|
| Project ID | `rsaapp-b5eac` |
| Android package | `com.rsa.athleteapp` |
| Auth method | Google Sign-In |
| Firestore collections | `users`, `challenges` |
| Firestore mode | Test mode (update rules before production) |

**Every developer must add their own debug SHA-1 to Firebase Console** before Google Sign-In will work on their machine. See step 3 below.

---

## Co-Owner / New Developer Setup

This is the full process to get the app running on a new machine from scratch.

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 18+ | |
| Android Studio | Latest | Includes Android SDK 34 |
| JDK | 17 | Use the JBR bundled with Android Studio |

### Step 1 — Clone and install dependencies

```bash
git clone <repo-url>
cd "TSA Geo"
npm install
```

### Step 2 — Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your Google Web Client ID. You can find it in:
- `google-services.json` → `client[].oauth_client[]` where `client_type` is `3`
- Or: Firebase Console → project **rsaapp-b5eac** → Project Settings → Your apps → Web app → OAuth 2.0 client ID

### Step 3 — Get the Firebase config file

`google-services.json` is gitignored (contains API keys). Get it from the other owner, or download it yourself:
- Go to [Firebase Console](https://console.firebase.google.com) → project **rsaapp-b5eac**
- Project Settings → Your apps → Android app → Download `google-services.json`
- Place the file at the project root: `TSA Geo/google-services.json`

### Step 4 — Add your machine's SHA-1 fingerprint to Firebase

Google Sign-In will silently fail unless your debug key is registered. Run this once:

```powershell
cd android
.\gradlew signingReport
```

Copy the **SHA1** value from `Variant: debug`. Then:
- Firebase Console → project **rsaapp-b5eac** → Project Settings → Your apps → Android → Add fingerprint → paste SHA1 → Save

### Step 5 — Re-download google-services.json

After saving the fingerprint, Firebase updates the config file. Download a fresh copy:
- Project Settings → Your apps → Android → Download `google-services.json`
- Replace the file at the project root

### Step 6 — Set JAVA_HOME (PowerShell — required every session)

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
```

> Tip: Add these two lines to your PowerShell profile (`$PROFILE`) so they run automatically.

### Step 7 — Generate the native Android project

The `android/` folder is gitignored because it is machine-generated. Recreate it:

```bash
npx expo prebuild --platform android --clean
```

> Close Android Studio before running this. The command will fail if Android Studio has the folder open.

### Step 8 — Run the app

```powershell
npm run android
```

This builds and installs the app on your connected Android device or emulator.

---

## Building a Debug APK (for sharing/testing)

```powershell
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
$env:PATH = "$env:JAVA_HOME\bin;$env:PATH"
cd android
.\gradlew assembleDebug
```

Output: `android/app/build/outputs/apk/debug/app-debug.apk`

Transfer this file to any Android device and install it directly. No Play Store needed for testing.

Alternatively, build in the cloud with no local Android setup required:
```bash
eas build --platform android --profile development
```

---

## Deploying to Google Play Store

### Step 1 — Upload Firebase config to EAS (one time only)

```bash
eas secret:create --scope project --name GOOGLE_SERVICES_JSON --type file --value "./google-services.json"
```

### Step 2 — Build production AAB

```bash
eas build --platform android --profile production
```

### Step 3 — Submit to Play Store

```bash
eas submit --platform android --profile production
```

> You also need a Google Play service account key for submission. Set it up in Google Play Console → Setup → API access, then add it as `GOOGLE_PLAY_SERVICE_ACCOUNT_KEY` in EAS secrets.

---

## Firestore Security Rules (update before production)

Currently in test mode (open read/write). Before going to production, update rules in Firebase Console → Firestore → Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /challenges/{challengeId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      allow delete: if request.auth != null &&
        resource.data.creatorId == request.auth.uid;
    }
  }
}
```

---

## Sensitive Files (gitignored — never commit these)

| File | Why |
|------|-----|
| `google-services.json` | Firebase API keys — get from owner or Firebase Console |
| `android/` | Machine-generated — recreate with `expo prebuild` |
| `android/local.properties` | Machine-specific Android SDK path |
| `.env` / `.env.*` | Environment secrets |
| `server/serviceAccountKey.json` | Firebase admin credentials |
| `.claude/` | Local AI assistant memory |

---

## License

MIT
