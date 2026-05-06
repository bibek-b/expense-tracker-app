# Expense Tracker - Complete Setup Guide

This guide walks you through setting up and running the full-stack expense tracker application with auto-sync capabilities.

## Project Structure

```
d:\aigeeks\
├── backend/                    # Node.js/Express backend
│   ├── src/
│   │   ├── server.ts          # Entry point
│   │   ├── config/
│   │   │   └── database.ts    # MongoDB connection
│   │   ├── models/
│   │   │   └── Expense.ts     # Mongoose schema
│   │   ├── controllers/
│   │   │   └── expenseController.ts
│   │   └── routes/
│   │       └── expenseRoutes.ts
│   ├── package.json
│   └── tsconfig.json
│
└── expense-tracker/            # Expo React Native app
    ├── src/
    │   ├── store/
    │   │   └── useExpensesStore.ts
    │   ├── sync.ts            # Backend API calls
    │   ├── autoSync.ts        # Auto-sync orchestration
    │   ├── storage.ts         # Local AsyncStorage
    │   ├── screens/
    │   ├── navigation/
    │   ├── utils/
    │   └── ...
    ├── App.tsx
    ├── package.json
    └── tsconfig.json
```

## Prerequisites

- **Node.js** 18+ and npm
- **MongoDB** running locally or MongoDB Atlas URI
- **Expo CLI** (optional, can use `npm start`)
- **Android emulator** or physical phone with Expo Go app

## Part 1: Backend Setup

### 1.1 Install & Configure

```bash
cd d:\aigeeks\backend
npm install
```

### 1.2 Set Environment Variables

Create a `.env` file (optional):

```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/expense-tracker
```

Or use defaults (MongoDB on `localhost:27017`).

### 1.3 Start Backend

**Development mode:**
```bash
npm run dev
```

**Production build:**
```bash
npm run build
npm start
```

The backend will listen on `http://localhost:3001`.

### 1.4 Verify Backend

```bash
curl http://localhost:3001/health
# Expected: { "ok": true }
```

## Part 2: Frontend Setup

### 2.1 Install Dependencies

```bash
cd d:\aigeeks\expense-tracker
npm install
```

### 2.2 Configure Backend URL

Edit `src/config/backend.ts`:

```typescript
// For Android emulator:
export const BACKEND_URL = "http://10.0.2.2:3001";

// For physical phone on same LAN:
// Find your PC IP: ipconfig (look for IPv4 Address)
// export const BACKEND_URL = "http://192.168.1.10:3001";
```

### 2.3 Start the App

```bash
npm start
```

Or for specific platforms:
```bash
npm run android    # Android emulator
npm run ios        # iOS simulator
npm run web        # Web browser
```

## Part 3: Auto-Sync Configuration

The app **automatically syncs** when:

1. **Device comes online** – immediate sync attempt
2. **Device is online** – background sync every 30 seconds

### 3.1 Enable Auto-Sync in Settings

1. Open the app → **Settings** tab
2. Scroll to **"Cloud sync (optional)"**
3. Enter your backend URL: `http://192.168.1.10:3001` (or your server)
4. Tap **"Save URL"**

The app will then:
- ✅ Automatically download any changes from the server
- ✅ Automatically upload your local changes
- ✅ Work completely offline (local AsyncStorage)
- ✅ Gracefully handle no internet connection

### 3.2 Manual Sync

In Settings, use the **Upload** and **Download** buttons for:
- One-time syncs
- Testing connectivity
- Resolving conflicts manually

## Part 4: Running in Development

### Start all services:

**Terminal 1 - Backend:**
```bash
cd d:\aigeeks\backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd d:\aigeeks\expense-tracker
npm start
```

Then:
- Scan the QR code with **Expo Go** app (Android/iOS)
- Or press `a` for Android emulator, `i` for iOS

## Part 5: Testing Auto-Sync

### 5.1 Test Offline Functionality

1. Open app in Expo Go
2. Add an expense: "Lunch" - $15 - Food
3. Turn off WiFi/mobile data
4. Add another expense: "Gas" - $50 - Travel
5. Verify both expenses are saved locally
6. Turn internet back on
7. Watch the app auto-sync (30s timer)
8. In Settings, tap **Upload** to push changes to server

### 5.2 Test Multi-Device Sync

1. Open app on **Phone A**
2. Open app on **Phone B** (or emulator)
3. On Phone A, add an expense
4. Wait 30-60 seconds (or tap **Download** in Settings on Phone B)
5. The expense should appear on Phone B

## Part 6: Features Reference

### Dashboard
- Monthly total expense
- Category breakdown
- Weekly trend chart

### Expenses List
- Filter by date range, category, or keyword
- Add/edit/delete expenses
- Auto-category suggestions from keywords

### Recurring Expenses
- Create monthly or weekly recurring rules
- Automatically generates entries on app load
- Manage in Settings

### Settings
- **Theme**: Light/Dark/System
- **Budget**: Monthly limit with alert
- **Cloud Sync**: Backend URL + Manual upload/download
- **Recurring Rules**: View and remove

### Budget Alerts
- One alert per month when budget exceeded
- Triggered on app load or when editing expenses

## Part 7: Deployment

### For Submission:

1. **GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Expense Tracker with auto-sync"
   git remote add origin https://github.com/YOUR_USERNAME/expense-tracker
   git push -u origin main
   ```

2. **Expo Link**
   - Publish to Expo:
     ```bash
     cd d:\aigeeks\expense-tracker
     expo publish
     ```
   - Or use Expo Go QR code during development

3. **Backend Deployment**
   - Deploy to Heroku, Railway, Render, or your own server
   - Update backend URL in `src/config/backend.ts`

4. **README Updates**
   - See [SUBMISSION_CHECKLIST.md](./SUBMISSION_CHECKLIST.md)

## Part 8: Troubleshooting

### Backend won't start
```bash
# Check MongoDB is running
# Windows: Services → MongoDB
# Or start MongoDB: mongod

# Check port 3001 is available
netstat -ano | findstr :3001
```

### App can't connect to backend
1. Verify backend URL in `src/config/backend.ts`
2. On physical phone, use your PC's LAN IP (not localhost)
3. Check both devices are on same network
4. Test with `curl http://YOUR_IP:3001/health`

### Sync not working
1. Check Settings → Cloud sync has a valid URL
2. Verify backend is running (`npm run dev`)
3. Check network connectivity (toggle WiFi off/on)
4. Look at console for error messages

### Expenses not persisting offline
- AsyncStorage is working but data might be cleared
- Check `src/storage.ts` for storage keys
- Try clearing app data and retry

## Part 9: Architecture Decisions

### Why Zustand?
- Lightweight state management
- Built-in persistence support
- Easy async/await handling
- Minimal boilerplate

### Why AsyncStorage?
- Works offline perfectly
- Simple key-value store
- Sufficient for expense data size
- Easy to debug

### Auto-Sync Strategy
- Uses `@react-native-community/netinfo` for connectivity
- Syncs on connect + every 30s while online
- Silent failures don't interrupt user workflow
- Pull → Push order prevents data loss

### Why MongoDB?
- Schema flexibility for different expense types
- Easy to index date/updatedAt for sorting
- Supports upsert operations for sync

## Part 10: Next Steps

- **Add more features**: Reports, export to CSV, multi-currency
- **Secure backend**: Add authentication, API keys
- **Enhance UI**: Animations, custom charts
- **Mobile optimization**: Biometric auth, push notifications
- **Backend persistence**: Store sync history, conflict resolution

---

**Questions?** Check the individual READMEs in `backend/` and `expense-tracker/` folders.
