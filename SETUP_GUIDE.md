# Athlete App — Setup Guide

## Step 1: Google Cloud OAuth Setup

### 1.1 Create a Google Cloud Project
1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Click **Select a Project** → **New Project**
3. Name it (e.g., "Athlete App") and click **Create**

### 1.2 Enable Required APIs
1. Go to **APIs & Services → Library**
2. Search for **"Google Identity Toolkit API"** and click **Enable**
3. Also search for **"Google People API"** and click **Enable** (needed for profile info during sign-in)

### 1.3 Create OAuth 2.0 Credentials

#### Web Client ID (for Firebase)
1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Name: "Athlete App Web"
5. No URIs needed — this is used by Firebase
6. Copy the **Client ID** — this goes in `context/AuthContext.tsx` line 7

#### Android Client ID
1. Click **Create Credentials → OAuth client ID** again
2. Application type: **Android**
3. Name: "Athlete App Android"
4. Package name: `com.rsa.athleteapp`
5. SHA-1 fingerprint: Run this in your project:
   ```bash
   cd android && ./gradlew signingReport
   ```
   Or for Expo dev builds:
   ```bash
   eas credentials -p android
   ```
6. Paste the SHA-1 certificate fingerprint

### 1.4 Configure Firebase
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (or create one)
3. Go to **Project Settings → General**
4. Under "Your apps", add an **Android app** with package `com.rsa.athleteapp`
5. Download `google-services.json` and place it in the project root
6. Go to **Authentication → Sign-in method → Google** and enable it
7. Set the Web Client ID from step 1.3

### 1.5 Update the Code
Open `context/AuthContext.tsx` and replace the placeholder:
```typescript
GoogleSignin.configure({
  webClientId: 'YOUR_ACTUAL_WEB_CLIENT_ID.apps.googleusercontent.com',
});
```

---

## Step 2: Install Dependencies

### Mobile App
```bash
cd athlete-app
npm install
npx expo prebuild  # Regenerate native projects with new plugins
```

### Server
```bash
cd athlete-app/server
npm install
```

---

## Step 3: Firebase Service Account (for Server)

1. Go to **Firebase Console → Project Settings → Service Accounts**
2. Click **Generate New Private Key**
3. Save the JSON file as `server/serviceAccountKey.json` (for local dev)
4. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

For **Railway deployment**, you'll paste the entire JSON contents into an environment variable instead of using a file (see Step 4).

---

## Step 4: Deploy Server to Railway

### 4.1 Create a Railway Account
1. Go to [railway.com](https://railway.com) and sign up (GitHub login works)
2. Click **New Project → Deploy from GitHub repo**
3. Select your repository
4. Railway will auto-detect the project — set the **Root Directory** to `server`

### 4.2 Configure Build Settings
In your Railway service settings:
- **Root Directory:** `server`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

Railway automatically assigns a `PORT` environment variable — the server already reads it.

### 4.3 Add Environment Variables
In the Railway dashboard, go to your service's **Variables** tab and add:

| Variable | Value |
|----------|-------|
| `FIREBASE_SERVICE_ACCOUNT` | Paste the **entire contents** of your `serviceAccountKey.json` as a single line |

To convert your service account key to a single line:
```bash
cat server/serviceAccountKey.json | jq -c .
```
Copy the output and paste it as the value.

### 4.4 Deploy
Railway deploys automatically on every push to your connected branch. You can also trigger a manual deploy from the dashboard.

Once deployed, Railway gives you a public URL like `https://your-service.up.railway.app`. Test it:
```bash
curl https://your-service.up.railway.app/health
```

### 4.5 Custom Domain (Optional)
1. Go to your service **Settings → Networking → Custom Domain**
2. Add your domain
3. Update your DNS with the CNAME record Railway provides
4. SSL is handled automatically

---

## Step 5: Run Locally for Development

### Server
```bash
cd server
cp .env.example .env
# Add your serviceAccountKey.json
npm run dev
```

### Mobile App
```bash
cd athlete-app
npx expo run:android  # or run:ios
```

---

## Verification Checklist

- [ ] Google Sign-In works with real credentials
- [ ] Data persists across app restarts (check Firestore console)
- [ ] Express server responds to `GET /health` (locally and on Railway)
- [ ] Push notifications arrive on device
- [ ] Can add a contact via the Contacts screen
- [ ] Recovery check-in increments recovery streak
- [ ] Streak milestones trigger notifications to contacts
