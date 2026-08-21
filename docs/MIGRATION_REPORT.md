# MIGRATION REPORT — Firebase → Supabase

**Migration Date:** 2026-08-21
**Firebase Project:** `project-web-kelas-3ab0d`
**Supabase Project:** `aszzvfgtrwrhjgbzrcdt`

---

## Data Migration Summary

| Firebase Resource | Supabase Resource | Legacy Count | Exported | Imported | Failed | Status |
|-------------------|-------------------|-------------|----------|----------|--------|--------|
| Firestore `chats` | PostgreSQL `chats` | 14 | 14 | ⏳ Pending import | 0 | `EXPORTED` |
| Firestore `ratings` | PostgreSQL `ratings` | 41 | 41 | ⏳ Pending import | 0 | `EXPORTED` |
| Firestore `blacklist_ips` | PostgreSQL `blacklist_ips` | 0 | 0 | N/A | 0 | `SUCCESS` (empty) |
| Firebase Auth | Supabase Auth | 0 | N/A | N/A | N/A | `NOT_PRESENT` |
| Storage `GambarAman/` (8 files) | Storage `gallery` bucket | 8 | 0 | 0 | 8 | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| Storage `images/` (9 files) | Storage `uploads` bucket | 9 | 0 | 0 | 9 | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |

---

## Blocked Firebase Storage Files

All 17 Firebase Storage files are blocked due to quota exceeded on the Spark (free) plan.

### GambarAman/ (8 files — admin gallery)
| File | Status |
|------|--------|
| `IMG_20231002_171742.jpg` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `IMG_20231002_172443.jpg` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `IMG_20231019_222525.jpg` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `IMG_20231019_223031.jpg` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `IMG_20231019_233147.jpg-90938494-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `compressed-608-2023-10-19-22-08-03.png` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `compressed-825-2023-10-19-22-10-31.png` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `inbound8304864758869014385.jpg-bfc10589-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |

### images/ (9 files — user uploads)
| File | Status |
|------|--------|
| `IMG-20231230-WA0009.jpeg-d25ff91e-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `IMG_20231019_233147.jpg-90938494-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `inbound8304864758869014385.jpg-bfc10589-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `inbound9160475682082253359.jpg-136a2eca-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `inbound9160475682082253359.jpg-463591f7-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `inbound9160475682082253359.jpg-5538ea97-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `inbound9160475682082253359.jpg-5a103b46-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `inbound9160475682082253359.jpg-6b150ee7-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| `inbound9160475682082253359.jpg-9cffb3b0-...` | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |

---

## Code Migration Summary

| File | Change | Firebase Removed | Supabase Added |
|------|--------|-----------------|----------------|
| `src/firebase.js` | **DELETED** | ✅ All Firebase SDK | N/A |
| `src/lib/supabase.js` | **NEW** | N/A | ✅ createClient |
| `src/components/ChatAnonim.jsx` | **MIGRATED** | ✅ Firestore, Auth | ✅ supabase.from(), Realtime channel |
| `src/components/Rating.jsx` | **MIGRATED** | ✅ Firestore | ✅ supabase.from().insert() |
| `src/components/UploadImage.jsx` | **MIGRATED** | ✅ Storage | ✅ supabase.storage.from().upload() |
| `src/Pages/Gallery.jsx` | **MIGRATED** | ✅ Storage | ✅ supabase.storage.from().list() |
| `src/components/ButtonRequest.jsx` | **MIGRATED** | ✅ Storage | ✅ supabase.storage.from().list() |
| `package.json` | **MODIFIED** | ✅ `firebase` removed | ✅ `@supabase/supabase-js` added |
| `.gitignore` | **MODIFIED** | N/A | ✅ .env, migration-data, credentials |

---

## Build Verification

```
✓ npm run build — SUCCESS (23.74s, 1240 modules)
✓ grep "firebase" src/ — 0 references found
✓ grep secrets — 0 secrets found in tracked files
✓ .env.local — gitignored, not tracked
✓ migration-data/ — gitignored, not tracked
```

---

## Remaining Manual Steps

### 1. Supabase Dashboard — Run SQL Migrations

Execute the following SQL files in Supabase Dashboard → SQL Editor:

1. `supabase/migrations/001_initial_schema.sql` — Creates tables
2. `supabase/migrations/002_rls_policies.sql` — Enables RLS + policies + realtime

### 2. Supabase Dashboard — Create Storage Buckets

Create two **public** storage buckets:
- `gallery` — for admin-curated gallery images
- `uploads` — for user-uploaded images

Set both buckets to **public** (allow public read access).

### 3. Import Firestore Data

After tables are created, run:

```bash
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key node scripts/import-to-supabase.mjs
```

Get the `service_role` key from Supabase Dashboard → Settings → API → Service Role Key.

### 4. Upload Gallery Images

Since Firebase Storage files are blocked, you'll need to manually upload new gallery images to the `gallery` bucket in Supabase Dashboard → Storage.

### 5. New GitHub Repository

```bash
git remote add origin git@github.com:AldoAdryano/Web-Kelas-XI-I-Supabase.git
git add -A
git commit -m "Migrate from Firebase to Supabase"
git push -u origin main
```

### 6. Vercel Deployment

Create a **new** Vercel project (do NOT connect to the legacy project):

1. Import `AldoAdryano/Web-Kelas-XI-I-Supabase` repository
2. Set environment variables:
   - `VITE_SUPABASE_URL` = `https://aszzvfgtrwrhjgbzrcdt.supabase.co`
   - `VITE_SUPABASE_PUBLISHABLE_KEY` = `sb_publishable_rWUjCX6Zxw-Lgq37ckEOwg_JuO6yyK4`
3. Deploy

---

## Data Successfully Recovered

| Data | Count | Source |
|------|-------|--------|
| Chat messages | 14 | Firestore `chats` |
| Ratings | 41 | Firestore `ratings` |
| Blocked IPs | 0 | Firestore `blacklist_ips` (was empty) |

## Data NOT Recovered

| Data | Count | Reason |
|------|-------|--------|
| Gallery images | 8 | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| User-uploaded images | 9 | `BLOCKED_BY_FIREBASE_STORAGE_BILLING` |
| Firebase Auth users | 0 | `NOT_PRESENT` (auth was never used) |
