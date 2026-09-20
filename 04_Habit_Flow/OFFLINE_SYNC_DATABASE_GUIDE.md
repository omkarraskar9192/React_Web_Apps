# HabitFlow: Offline-First & Cloud Database Sync Guide (Option 2: MongoDB Atlas + Node.js)

This document provides a complete guide on how **HabitFlow** handles data storage, offline operation, user accounts, and MongoDB Atlas cloud synchronization.

---

## 1. Architecture Overview (Offline-First / Local-First)

HabitFlow uses an **Offline-First (Local-First)** architecture. This guarantees that:
1. **Zero Latency**: Every habit check, addition, or edit responds **instantly** (0ms delay) on your device.
2. **100% Offline Resilience**: If your internet is switched off, in airplane mode, or spotty, you can continue ticking habits, adding new routines, and writing reflections. Nothing breaks.
3. **Permanent Cloud Backup**: When logged in, all habits, streaks, and history are backed up to **MongoDB Atlas**. If you log out, clear your browser data, or install the app on a new phone, logging in immediately restores your complete habit records.

```mermaid
flowchart TD
    subgraph Client ["Client Device (Browser / Mobile)"]
        UI["User Taps / Adds Habit"] --> LocalMem["1. Save to Local Memory (localStorage & Redux)"]
        LocalMem --> InstantFeedback["⚡ Instant UI Update (0ms Lag)"]
        LocalMem --> NetCheck{"Internet Online?"}
        NetCheck -- "YES" --> DirectSync["Send to Node.js Backend"]
        NetCheck -- "NO" --> SyncQueue["Add to Offline Queue (habitflow_offline_queue)"]
        SyncQueue --> NetListener["Wait for 'online' event / heartbeat"]
        NetListener -- "Connection Restored" --> DirectSync
    end

    subgraph Backend ["Node.js Server & Cloud"]
        DirectSync --> ExpressAPI["Express REST API (/api/sync, /api/habits)"]
        ExpressAPI --> AuthCheck{"Authenticated User?"}
        AuthCheck -- "Yes" --> UserScope["Isolate by userId"]
        AuthCheck -- "Guest" --> GuestScope["Local/Guest Scope"]
        UserScope --> MongoAtlas[("MongoDB Atlas Cloud Database")]
        GuestScope --> MongoAtlas
    end

    MongoAtlas -.->|"Restore on Login / New Phone"| LocalMem
```

---

## 2. How On-Device Memory Works (Offline Operation)

- **Primary Source of Truth on Device**: Redux Store synchronized with browser `localStorage` (`habitflow_habits`, `habitflow-user`, `habitflow-reflection-*`).
- **Offline Mutation Queue** (`habitflow_offline_queue` in `localStorage`):
  - When you perform an action (e.g. `UPDATE_HABIT`, `ADD_HABIT`, `DELETE_HABIT`) while offline, HabitFlow saves the action and timestamp into this queue.
- **Auto-Sync Engine** (`src/services/syncEngine.js`):
  - Continuously monitors network connection using `window.addEventListener('online')` and `navigator.onLine`.
  - When connection is detected, it automatically flushes all pending mutations to the MongoDB backend sequentially.
  - The Topbar displays a live badge:
    - 🟡 **Offline Mode (Saved locally)** when internet is off.
    - 🟢 **Cloud Synced** when online and connected.

---

## 3. Account System & Cross-Device Restore

### Why Accounts Are Important:
If an app stores data *only* locally, clearing browser data or uninstalling the app permanently erases habits.

With HabitFlow's account system:
1. **Sign Up / Sign In**:
   - In the topbar or profile page, click **"Cloud Backup"** or **"Sign In / Create Account"**.
   - Provide an email and password.
   - Upon creating an account, all current on-device habits are automatically uploaded to your new cloud account.
2. **Logging in on a New Device or After Deleting the App**:
   - Open HabitFlow on any phone, tablet, or laptop.
   - Click **Sign In** and enter your credentials.
   - HabitFlow fetches your habits and streaks directly from MongoDB Atlas and populates your device storage.
3. **Security**:
   - Passwords are encrypted using `bcryptjs` with 10 salt rounds before being stored.
   - Sessions are authenticated using signed JSON Web Tokens (`jsonwebtoken`).

---

## 4. Setting Up MongoDB Atlas (Step-by-Step Free Cloud Database)

You can use a **100% Free** MongoDB Atlas cloud database. Follow these steps:

### Step 1: Create a Free MongoDB Atlas Account
1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and register for a free account.
2. Create a new Project (name it `HabitFlow`).

### Step 2: Deploy a Free M0 Cluster
1. Choose the **M0 Free** shared cluster (Free forever, 512 MB storage).
2. Select your preferred region (e.g. AWS / Mumbai, Frankfurt, or N. Virginia).
3. Click **Create Deployment**.

### Step 3: Create Database Credentials
1. When prompted for authentication, choose **Username and Password**.
2. Enter a username (e.g., `habitadmin`) and a strong password. **Save this password!**
3. Click **Create Database User**.

### Step 4: Configure Network IP Access
1. Under **Network Access** &rarr; **IP Access List**:
2. Click **Add IP Address**.
3. Choose **Allow Access from Anywhere** (`0.0.0.0/0`) so you can connect from your mobile device, laptop, or home network.
4. Click **Confirm**.

### Step 5: Copy the Connection String
1. Go to **Databases** &rarr; click **Connect**.
2. Choose **Drivers** (Node.js).
3. Copy the URI string, which looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
4. Replace `<password>` with the password you created in Step 3, and replace the database path with `/habitflow`:
   ```
   mongodb+srv://habitadmin:YOUR_PASSWORD@cluster0.abcde.mongodb.net/habitflow?retryWrites=true&w=majority
   ```

### Step 6: Connect HabitFlow to your Database
You have two easy ways to set this:
- **Option A (From App UI)**: Open HabitFlow &rarr; Go to **Profile** &rarr; Scroll to **MongoDB Database Synchronization** &rarr; Paste your URI into the input field &rarr; Click **Connect**.
- **Option B (In `.env` file)**: Open `server/.env` and update:
  ```env
  PORT=5000
  MONGODB_URI=mongodb+srv://habitadmin:YOUR_PASSWORD@cluster0.abcde.mongodb.net/habitflow?retryWrites=true&w=majority
  JWT_SECRET=your_super_secret_jwt_key_2026
  ```

---

## 5. How to Run the App & Server

### Run Both Frontend & Backend Concurrently (Recommended):
In the project root terminal:
```bash
npm run dev
```
This runs:
- **Vite React Frontend**: `http://localhost:5173`
- **Node.js Express Server**: `http://localhost:5000`

### Run Backend Server Alone:
```bash
npm run server
```

### Run Frontend Alone:
```bash
npm run client
```

### Build for Production:
```bash
npm run build
```

---

## 6. Backend API Reference

| Endpoint | Method | Purpose | Auth Required? |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Health check & MongoDB status | No |
| `/api/auth/register` | `POST` | Register account & seed offline habits | No |
| `/api/auth/login` | `POST` | Login & return user's cloud habits | No |
| `/api/auth/me` | `GET` | Get logged-in user profile | Yes (Bearer Token) |
| `/api/config/mongo` | `GET` | Check current MongoDB connection | No |
| `/api/config/mongo` | `POST` | Update MongoDB connection URI | No |
| `/api/habits` | `GET` | Get user's habits | Optional (User/Guest) |
| `/api/habits` | `POST` | Create a new habit | Optional (User/Guest) |
| `/api/habits/:id` | `PUT` | Update / toggle habit | Optional (User/Guest) |
| `/api/habits/:id` | `DELETE` | Delete a habit | Optional (User/Guest) |
| `/api/history` | `GET` | Get habit history records | Optional (User/Guest) |
| `/api/history` | `POST` | Save daily completion record | Optional (User/Guest) |
| `/api/sync` | `POST` | Bulk reconcile & flush offline queue | Optional (User/Guest) |

---

## 7. Summary of Protection
With this system in place:
1. **If the internet goes down**: The app continues to function seamlessly with zero disruptions; changes are stored in on-device storage and queued.
2. **When the internet comes back**: The sync engine automatically flushes the queue to MongoDB Atlas.
3. **If the user logs out or uninstalls the app**: Logging back in on any browser or mobile device pulls their habit list and streaks from MongoDB Atlas.

