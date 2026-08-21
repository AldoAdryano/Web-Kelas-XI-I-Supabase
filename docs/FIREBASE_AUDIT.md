# FIREBASE AUDIT — Web Kelas XI-I

**Audit Date:** 2026-08-21
**Auditor:** Automated (Phase 1)
**Firebase Project ID:** `project-web-kelas-3ab0d`
**Firebase App ID:** `1:273105413459:web:f009fbd6f7800e9c8bada6`
**Legacy Production URL:** `https://web-kelas-xi-i.vercel.app/`

---

## 1. PROJECT STRUCTURE

```
Web-Kelas-XI-I-Supabase/
├── index.html                          # Entry HTML (SEO meta, OG tags)
├── package.json                        # React 18.2, Firebase 10.3.1, Vite 4.4.5
├── vite.config.js                      # Basic Vite + React plugin
├── tailwind.config.js                  # TailwindCSS 3.3.3
├── postcss.config.js                   # PostCSS + Autoprefixer
├── .eslintrc.cjs                       # ESLint for React
├── .gitignore                          # Standard (no .env, no migration-data)
├── public/
│   ├── AnonimUser.png                  # Default anonymous avatar
│   ├── Background.jpeg                 # Hero background image
│   ├── LogoMAN.png, LogoXI-I.png       # School/class logos
│   ├── Rating/1-5.png                  # Rating face icons
│   ├── *.svg                           # UI icons (arrows, lines, circles)
│   └── ... (30 static assets)
├── src/
│   ├── main.jsx                        # React root render
│   ├── App.jsx                         # Main app (Home, Gallery, Tabs, Chat, Footer)
│   ├── firebase.js                     # ★ FIREBASE CONFIG & INITIALIZATION
│   ├── index.css                       # Complete stylesheet (glassmorphism, gradients)
│   ├── Pages/
│   │   ├── Home.jsx                    # Landing page (no Firebase)
│   │   ├── Gallery.jsx                 # ★ FIREBASE STORAGE (GambarAman/)
│   │   ├── Tabs.jsx                    # Tab container (no Firebase)
│   │   ├── Schedule.jsx                # Class schedule (hardcoded, no Firebase)
│   │   ├── StrukturKelas.jsx           # Class structure (hardcoded, no Firebase)
│   │   └── Footer.jsx                  # Footer with Rating component
│   └── components/
│       ├── ChatAnonim.jsx              # ★ FIREBASE FIRESTORE + AUTH (chats, blacklist_ips)
│       ├── Rating.jsx                  # ★ FIREBASE FIRESTORE (ratings)
│       ├── UploadImage.jsx             # ★ FIREBASE STORAGE (images/)
│       ├── ButtonSend.jsx              # Modal wrapper for UploadImage (no direct Firebase)
│       ├── ButtonRequest.jsx           # ★ FIREBASE STORAGE (images/ + metadata)
│       ├── BoxTextAnonim.jsx           # Modal wrapper for ChatAnonim (no direct Firebase)
│       ├── Navbar.jsx                  # Navigation (no Firebase)
│       ├── BottomNav.jsx               # Unused bottom nav (no Firebase)
│       ├── BorderStruktur.jsx          # Structure card (no Firebase)
│       ├── BoxClassIg.jsx              # Instagram link box (no Firebase)
│       ├── BoxOldWeb.jsx               # TikTok link box (no Firebase)
│       ├── BoxGallery.jsx              # Gallery box (no Firebase, appears unused)
│       └── Mapel/                      # Day-of-week schedules (all hardcoded, no Firebase)
│           ├── Senin.jsx
│           ├── Selasa.jsx
│           ├── Rabu.jsx
│           ├── Kamis.jsx
│           ├── Jumat.jsx
│           └── Sabtu.jsx
└── dist/                               # Previous build output
```

---

## 2. EVERY FIREBASE-DEPENDENT FILE

| File | Firebase Services Used | Imports |
|------|----------------------|---------|
| `src/firebase.js` | App, Auth, Firestore, Storage | `initializeApp`, `getStorage`, `getFirestore`, `getAuth`, `GoogleAuthProvider` |
| `src/components/ChatAnonim.jsx` | Firestore (read/write/realtime), Auth (currentUser) | `addDoc`, `collection`, `query`, `orderBy`, `onSnapshot`, `getDocs`, `db`, `auth` |
| `src/components/Rating.jsx` | Firestore (write) | `getFirestore`, `collection`, `addDoc` |
| `src/components/UploadImage.jsx` | Storage (read/write) | `storage`, `ref`, `uploadBytes`, `listAll`, `getDownloadURL` |
| `src/Pages/Gallery.jsx` | Storage (read) | `getStorage`, `ref`, `listAll`, `getDownloadURL` |
| `src/components/ButtonRequest.jsx` | Storage (read + metadata) | `getStorage`, `ref`, `listAll`, `getDownloadURL`, `getMetadata` |

**Files with NO Firebase dependency (safe):**
`main.jsx`, `App.jsx`, `index.css`, `Home.jsx`, `Tabs.jsx`, `Schedule.jsx`, `StrukturKelas.jsx`, `Footer.jsx`, `Navbar.jsx`, `BottomNav.jsx`, `BorderStruktur.jsx`, `BoxClassIg.jsx`, `BoxOldWeb.jsx`, `BoxGallery.jsx`, `ButtonSend.jsx`, `BoxTextAnonim.jsx`, all `Mapel/*.jsx`

---

## 3. FIRESTORE COLLECTIONS

### 3.1 Collection: `chats`

**Referenced in:** `src/components/ChatAnonim.jsx` (line 14)

**Document Schema (inferred from addDoc call at line 157-164):**

| Field | Type | Description |
|-------|------|-------------|
| `message` | string | Chat message text (max 60 chars, trimmed) |
| `sender` | map/object | `{ image: string }` — sender avatar URL |
| `sender.image` | string | Firebase Auth `photoURL` or `/AnonimUser.png` |
| `timestamp` | timestamp | `new Date()` — JavaScript Date object |
| `userIp` | string | User's network IP from `ipapi.co/json` → `response.data.network` |

**Document IDs:** Auto-generated by `addDoc()` — **not meaningful**.

**Query patterns:**
- `query(collection(db, "chats"), orderBy("timestamp"))` — ascending timestamp order
- `onSnapshot()` — realtime listener for all messages

**Firebase UID references:** `auth.currentUser?.photoURL` is used for avatar, but **no UID is stored** in the document. The sender identity is purely the avatar image URL.

### 3.2 Collection: `ratings`

**Referenced in:** `src/components/Rating.jsx` (line 45)

**Document Schema (inferred from addDoc call at line 45-48):**

| Field | Type | Description |
|-------|------|-------------|
| `value` | number | Rating value 0.0–10.0 (step 0.1) |
| `timestamp` | timestamp | `new Date()` — JavaScript Date object |

**Document IDs:** Auto-generated by `addDoc()` — **not meaningful**.

**Query patterns:** Write-only from the frontend. No reads observed in code.

**Rate limiting:** Client-side via localStorage (`ratingsToday`), max 2 per day per browser.

### 3.3 Collection: `blacklist_ips`

**Referenced in:** `src/components/ChatAnonim.jsx` (line 20)

**Document Schema (inferred from read at line 21):**

| Field | Type | Description |
|-------|------|-------------|
| `ipAddress` | string | Network IP address/subnet to block |

**Document IDs:** Unknown — likely auto-generated or manually created in Firebase Console.

**Query patterns:**
- `getDocs(collection(db, "blacklist_ips"))` — full collection read, then `.map(doc => doc.data().ipAddress)`

**Access pattern:** Read-only from frontend. Managed exclusively through Firebase Console by admins.

**README confirms:** Collection is documented as a "secret feature" — admin adds IPs obtained from the `chats` collection's `userIp` field.

---

## 4. FIREBASE AUTH

### 4.1 Providers Configured

| Provider | Configured | Actually Used in Code |
|----------|-----------|----------------------|
| Google (`GoogleAuthProvider`) | ✅ Exported in `firebase.js` | ⚠️ **Provider is exported but `signInWithPopup`/`signInWithRedirect` is NEVER called in any component** |

### 4.2 Auth Usage Analysis

The `auth` object is imported in `ChatAnonim.jsx` (line 3), and used **only** at line 136:

```javascript
const senderImageURL = auth.currentUser?.photoURL || "/AnonimUser.png";
```

This means:
- **No login UI exists** in the current application
- **No sign-in flow is implemented** — `signInWithPopup` is never called
- **No sign-out flow exists**
- `auth.currentUser` will **always be null** in production (no user ever signs in)
- The avatar will **always** fall back to `/AnonimUser.png`
- The `GoogleAuthProvider` export is **dead code**

### 4.3 Auth Migration Implication

Since no authentication is actually used in the live application, there are **no Firebase Auth users to migrate**. The Google Auth infrastructure was set up but never wired to the UI.

---

## 5. FIREBASE STORAGE

### 5.1 Storage Bucket

**Bucket:** `project-web-kelas-3ab0d.appspot.com` (default bucket)

### 5.2 Storage Paths Used

| Path | Used By | Operation | Description |
|------|---------|-----------|-------------|
| `GambarAman/` | `Gallery.jsx` (line 27) | READ (`listAll`, `getDownloadURL`) | "Safe images" — curated gallery carousel. Admin-uploaded via Firebase Console. |
| `images/` | `UploadImage.jsx` (line 18, 70) | READ + WRITE (`listAll`, `getDownloadURL`, `uploadBytes`) | User-uploaded images with UUID suffix |
| `images/` | `ButtonRequest.jsx` (line 28) | READ (`listAll`, `getDownloadURL`, `getMetadata`) | Image request viewer — shows all uploaded images with timestamps (blurred) |

### 5.3 Upload Pattern

```javascript
// UploadImage.jsx line 70
const imageRef = ref(storage, `images/${imageUpload.name}-${uuidv4()}`);
uploadBytes(imageRef, imageUpload);
```

- File naming: `{originalFilename}-{uuid4}`
- Max size: 10MB (client-side check)
- Max uploads per day: 20 (client-side localStorage check)
- No server-side validation

### 5.4 Gallery Image Source

`Gallery.jsx` reads from `GambarAman/` — these are **admin-curated** images uploaded directly through Firebase Console. They are NOT the same as user-uploaded `images/`.

`ButtonRequest.jsx` reads from `images/` — these are the **user-uploaded** images, shown blurred as a "request" queue.

---

## 6. REALTIME SUBSCRIPTIONS

| Component | Firestore Path | Method | Description |
|-----------|---------------|--------|-------------|
| `ChatAnonim.jsx` (line 32) | `chats` (ordered by `timestamp`) | `onSnapshot()` | Live chat message updates. Unsubscribes on component unmount (line 47). |

**This is the only realtime subscription in the entire application.**

---

## 7. EVERY UPLOAD / DOWNLOAD FEATURE

| Feature | Component | Direction | Path |
|---------|-----------|-----------|------|
| Gallery carousel | `Gallery.jsx` | Download | `GambarAman/` |
| Image upload | `UploadImage.jsx` | Upload + Download | `images/` |
| Image request viewer | `ButtonRequest.jsx` | Download + Metadata | `images/` |
| Chat messages | `ChatAnonim.jsx` | Upload (addDoc) + Download (onSnapshot) | Firestore `chats` |
| Ratings | `Rating.jsx` | Upload (addDoc) | Firestore `ratings` |

---

## 8. FIREBASE CONFIGURATION VALUES

All config values are **hardcoded** in `src/firebase.js` (lines 12-18):

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDONEXFmMpls4cTT_LiiPesKhF0-bovQMc",
  authDomain: "project-web-kelas-3ab0d.firebaseapp.com",
  projectId: "project-web-kelas-3ab0d",
  storageBucket: "project-web-kelas-3ab0d.appspot.com",
  messagingSenderId: "273105413459",
  appId: "1:273105413459:web:f009fbd6f7800e9c8bada6",
};
```

**No `.env` file exists.** No `VITE_` environment variables are used. All Firebase config is committed to source code.

---

## 9. HARDCODED URLS

| URL | Location | Type |
|-----|----------|------|
| `project-web-kelas-3ab0d.firebaseapp.com` | `src/firebase.js:14` | Firebase Auth Domain |
| `project-web-kelas-3ab0d.appspot.com` | `src/firebase.js:16` | Firebase Storage Bucket |
| `https://ipapi.co/json` | `src/components/ChatAnonim.jsx:73` | External IP detection API |
| `https://xi-i.vercel.app/` | `index.html:18,22,26` | OG meta URL (old Vercel domain) |
| `https://xii.vercel.app/Welcome.png` | `index.html:30` | Twitter card image (typo?) |
| `https://xitkj3.vercel.app/` | `README.md:21` | Earlier version URL |
| Instagram & TikTok URLs | `BoxClassIg.jsx`, `BoxOldWeb.jsx`, `Footer.jsx` | Social media links |

---

## 10. LOCAL DATA STORAGE

### In localStorage (client-side only):

| Key | Used By | Purpose |
|-----|---------|---------|
| `userIp` | ChatAnonim.jsx | Cached IP address |
| `ipExpiration` | ChatAnonim.jsx | IP cache TTL (1 hour) |
| `messageCountDate` | ChatAnonim.jsx | Date string for daily limit reset |
| `{ipAddress}` | ChatAnonim.jsx | Message count per IP per day (max 20) |
| `lastRating` | Rating.jsx | Last rating value |
| `ratingsToday` | Rating.jsx | Daily rating count (max 2) |
| `uploadedImagesCount` | UploadImage.jsx | Daily upload count (max 20) |
| `lastUploadDate` | UploadImage.jsx | Last upload date for daily reset |

### In repository:
- All `public/` assets are static and committed to the repo
- Schedule data is hardcoded in `Mapel/*.jsx` components
- Class structure is hardcoded in `StrukturKelas.jsx`
- Student names and piket groups are hardcoded in `Schedule.jsx`
- **No JSON data files** exist in the repo

---

## 11. FIREBASE UID REFERENCES IN FIRESTORE

**None.** No Firestore document stores a Firebase UID. The `auth.currentUser?.photoURL` is used to get the avatar URL but this value is stored as a plain image URL string (`sender.image`), not as a UID reference.

---

## 12. FEATURES AFFECTED BY FIREBASE FAILURE

| Feature | Impact of Firebase Failure |
|---------|---------------------------|
| Chat (anonymous text) | Complete failure — no messages load, no messages can be sent |
| Gallery carousel | Empty — no images rendered |
| Image upload | Broken — upload button does nothing |
| Image request viewer | Empty — no images shown |
| Rating | Broken — slider submits but data is lost |
| IP blacklist | Non-functional — all IPs allowed (fails open) |
| Home page | ✅ Works (no Firebase) |
| Navigation | ✅ Works (no Firebase) |
| Class structure | ✅ Works (hardcoded) |
| Schedule | ✅ Works (hardcoded) |
| Footer | ✅ Works (except Rating sub-component) |

---

## 13. DATA SALVAGEABLE FROM LIVE PRODUCTION

The live site at `https://web-kelas-xi-i.vercel.app/` may expose:
- **Gallery images** from `GambarAman/` via direct Firebase Storage download URLs (if Storage rules allow public read)
- **Chat message history** if Firestore security rules allow public read
- **User-uploaded images** from `images/` if Storage rules allow public read

These can potentially be scraped from the live site or queried directly using the exposed Firebase API key, since the Firebase config is public.

---

## 14. FIREBASE → SUPABASE MAPPING TABLE

| Firebase Resource | Firebase Path/Config | Supabase Equivalent | Notes |
|-------------------|---------------------|---------------------|-------|
| **Firebase App** | `project-web-kelas-3ab0d` | Supabase Project | New project required |
| **Firestore `chats`** | `collection("chats")` | PostgreSQL `chats` table | Fields: `id`, `message`, `sender_image`, `timestamp`, `user_ip` |
| **Firestore `ratings`** | `collection("ratings")` | PostgreSQL `ratings` table | Fields: `id`, `value`, `timestamp` |
| **Firestore `blacklist_ips`** | `collection("blacklist_ips")` | PostgreSQL `blacklist_ips` table | Fields: `id`, `ip_address`. Requires RLS: no public write. |
| **Firebase Auth** | Google OAuth (configured, unused) | Supabase Auth | Google OAuth provider. Currently unused — implement properly this time. |
| **Firebase Storage `GambarAman/`** | Gallery images (admin-curated) | Supabase Storage `gallery` bucket | Public-read bucket for curated images |
| **Firebase Storage `images/`** | User-uploaded images | Supabase Storage `uploads` bucket | Authenticated/anon upload with size/rate limits |
| **Firestore Realtime (`onSnapshot`)** | `chats` ordered by timestamp | Supabase Realtime | `supabase.channel().on('postgres_changes', ...)` |
| **`auth.currentUser?.photoURL`** | User avatar | `supabase.auth.getUser()` → `user_metadata.avatar_url` | Only used for chat avatar |
| **Firebase Config** | Hardcoded in `firebase.js` | `VITE_SUPABASE_URL` + `VITE_SUPABASE_PUBLISHABLE_KEY` | Move to `.env.local` |
| **`ipapi.co/json`** | External IP API | Keep as-is or move IP logic server-side | Not a Firebase resource |

---

## 15. SUPABASE SQL SCHEMA (Proposed)

```sql
-- chats table
CREATE TABLE chats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_firebase_id TEXT,                     -- Preserve original doc ID if migrated
  message TEXT NOT NULL CHECK (char_length(message) <= 60),
  sender_image TEXT NOT NULL DEFAULT '/AnonimUser.png',
  user_ip TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chats_created_at ON chats (created_at ASC);

-- ratings table
CREATE TABLE ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  legacy_firebase_id TEXT,
  value NUMERIC(3,1) NOT NULL CHECK (value >= 0 AND value <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ratings_created_at ON ratings (created_at ASC);

-- blacklist_ips table
CREATE TABLE blacklist_ips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blacklist_ips_address ON blacklist_ips (ip_address);
```

---

## 16. STORAGE BUCKETS (Proposed)

| Bucket Name | Public? | Purpose | Max File Size | Allowed Types |
|-------------|---------|---------|---------------|---------------|
| `gallery` | Public read | Admin-curated gallery (replaces `GambarAman/`) | 10MB | image/* |
| `uploads` | Public read, authenticated write | User uploads (replaces `images/`) | 10MB | image/* |

---

## 17. RLS POLICIES (Proposed)

### `chats`
- `SELECT`: Allow `anon` and `authenticated` (public read for chat history)
- `INSERT`: Allow `anon` and `authenticated` (anonymous chat)
- `UPDATE`: Deny all
- `DELETE`: Deny all (or admin-only via Edge Function)

### `ratings`
- `SELECT`: Allow `anon` and `authenticated` (if needed for display)
- `INSERT`: Allow `anon` and `authenticated`
- `UPDATE`: Deny all
- `DELETE`: Deny all

### `blacklist_ips`
- `SELECT`: Allow `anon` and `authenticated` (needed for IP check in chat)
- `INSERT`: Deny browser — admin only via Supabase Dashboard or Edge Function
- `UPDATE`: Deny browser
- `DELETE`: Deny browser

> **Security Note:** The current blacklist implementation reads the entire blacklist from the client. This exposes the blocklist to any user. A more secure approach would use a Supabase Edge Function to check the IP server-side, but that changes the existing architecture. The initial migration should preserve the current behavior, with a follow-up improvement.

---

## 18. DEPENDENCIES SUMMARY

### Runtime (production):
| Package | Version | Firebase? | Migration Action |
|---------|---------|-----------|-----------------|
| `firebase` | ^10.3.1 | ✅ YES | **REMOVE** → Replace with `@supabase/supabase-js` |
| `react` | ^18.2.0 | No | Keep |
| `react-dom` | ^18.2.0 | No | Keep |
| `@emotion/react` | ^11.11.1 | No | Keep |
| `@emotion/styled` | ^11.11.0 | No | Keep |
| `@mui/icons-material` | ^5.14.6 | No | Keep |
| `@mui/material` | ^5.14.6 | No | Keep |
| `@mui/styled-engine-sc` | ^5.14.6 | No | Keep |
| `@react-spring/web` | ^9.7.3 | No | Keep |
| `aos` | ^2.3.4 | No | Keep |
| `axios` | ^1.5.0 | No | Keep (used for ipapi.co) |
| `react-slick` | ^0.29.0 | No | Keep |
| `react-swipeable-views` | ^0.14.0 | No | Keep |
| `slick-carousel` | ^1.8.1 | No | Keep |
| `styled-components` | ^5.3.11 | No | Keep |
| `sweetalert2` | ^11.7.32 | No | Keep |
| `swiper` | ^10.2.0 | No | Keep |
| `uuid` | ^9.0.0 | No | Keep |

### Dev:
All dev dependencies are Firebase-independent. No changes needed.

---

## 19. KEY FINDINGS & RISKS

1. **Auth is a no-op.** Google Auth was configured but never implemented in the UI. No users exist. The migration should properly implement Google OAuth for the first time.

2. **All rate limiting is client-side only.** Message limits (20/day), rating limits (2/day), and upload limits (20/day) are enforced via localStorage — trivially bypassable. The Supabase migration should ideally add server-side rate limiting.

3. **IP detection is client-side.** The `ipapi.co` API is called from the browser. This IP is stored in Firestore documents and used for blacklisting. This is somewhat unreliable and can be spoofed. The migration should preserve this behavior initially.

4. **Blacklist is exposed to clients.** The entire `blacklist_ips` collection is read by every chat user. Any user can discover which IPs are blocked. This is a pre-existing design issue.

5. **No `.env` file.** All Firebase config is hardcoded. The Supabase migration must introduce proper environment variables.

6. **Firebase Storage may be inaccessible.** If the project is on Firebase Spark (free) plan with exceeded quotas, Storage reads may fail. The `GambarAman/` gallery images and `images/` user uploads may be unrecoverable without billing access.

7. **No tests exist.** There are no test files in the project.

8. **`dist/` is committed.** The build output directory should be gitignored.

9. **`BottomNav.jsx` is unused.** It is not imported anywhere.

10. **`BoxGallery.jsx` is unused.** It is not imported by any other component.

---

## 20. DATA RECOVERY STRATEGY

### Firestore Data
Since the Firebase API key is public and in the source code, we can attempt to read Firestore collections using the Firebase Client SDK with the existing config. If Firestore security rules allow public reads (which they likely do given the app reads without auth), we can export all documents from `chats`, `ratings`, and `blacklist_ips`.

### Firebase Storage
Storage access depends on the current Firebase Security Rules and project billing status:
- If rules allow public read → we can download all files from `GambarAman/` and `images/`
- If the project is on Spark plan and has exceeded storage download limits → `BLOCKED_BY_FIREBASE_STORAGE_BILLING`
- If rules require auth → we need the owner's Firebase credentials

### Firebase Auth
No users to export (auth was never used in the live app).

---

*This audit is complete. No code modifications have been made. Ready for Phase 2+ upon owner approval.*
