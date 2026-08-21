/**
 * Firebase Storage Export Script (READ-ONLY)
 * 
 * Attempts to list and download all files from GambarAman/ and images/ paths.
 * If Firebase Storage returns permission errors, creates a blocked report.
 * 
 * Usage: node scripts/export-storage.mjs
 */

import { initializeApp } from "firebase/app";
import { getStorage, ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { writeFileSync, mkdirSync, createWriteStream } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import https from "https";
import http from "http";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "migration-data", "firebase");
const STORAGE_DIR = join(OUTPUT_DIR, "storage");

const firebaseConfig = {
  apiKey: "AIzaSyDONEXFmMpls4cTT_LiiPesKhF0-bovQMc",
  authDomain: "project-web-kelas-3ab0d.firebaseapp.com",
  projectId: "project-web-kelas-3ab0d",
  storageBucket: "project-web-kelas-3ab0d.appspot.com",
  messagingSenderId: "273105413459",
  appId: "1:273105413459:web:f009fbd6f7800e9c8bada6",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const proto = url.startsWith("https") ? https : http;
    const file = createWriteStream(destPath);
    proto.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(true);
        });
      } else {
        file.close();
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on("error", reject);
  });
}

async function exportStoragePath(storagePath, localDir) {
  console.log(`\nExporting storage path: ${storagePath}...`);
  const results = [];
  
  try {
    const storageRef = ref(storage, storagePath);
    const list = await listAll(storageRef);
    
    console.log(`  Found ${list.items.length} files`);
    mkdirSync(localDir, { recursive: true });

    for (const item of list.items) {
      const entry = {
        bucket: firebaseConfig.storageBucket,
        path: item.fullPath,
        name: item.name,
        downloadUrl: null,
        localFile: null,
        status: "PENDING",
        error: null,
      };

      try {
        const url = await getDownloadURL(item);
        entry.downloadUrl = url;

        let metadata = {};
        try {
          metadata = await getMetadata(item);
          entry.contentType = metadata.contentType;
          entry.size = metadata.size;
          entry.timeCreated = metadata.timeCreated;
          entry.updated = metadata.updated;
        } catch (e) {
          // metadata fetch failed, continue
        }

        // Download the file
        const localPath = join(localDir, item.name);
        await downloadFile(url, localPath);
        entry.localFile = localPath;
        entry.status = "SUCCESS";
        console.log(`  ✅ ${item.name} (${metadata.size ? (metadata.size / 1024).toFixed(1) + 'KB' : 'unknown size'})`);
      } catch (error) {
        entry.status = error.message.includes("402") || error.message.includes("403")
          ? "BLOCKED_BY_FIREBASE_STORAGE_BILLING"
          : "FAILED";
        entry.error = error.message;
        console.error(`  ❌ ${item.name}: ${error.message}`);
      }

      results.push(entry);
    }

    // Also check for subdirectories
    if (list.prefixes.length > 0) {
      console.log(`  Found ${list.prefixes.length} subdirectories (not recursing)`);
    }

  } catch (error) {
    console.error(`  ❌ Cannot list ${storagePath}: ${error.message}`);
    results.push({
      bucket: firebaseConfig.storageBucket,
      path: storagePath,
      name: null,
      downloadUrl: null,
      localFile: null,
      status: error.message.includes("402") || error.message.includes("403")
        ? "BLOCKED_BY_FIREBASE_STORAGE_BILLING"
        : "FIREBASE_PERMISSION_DENIED",
      error: error.message,
    });
  }

  return results;
}

async function main() {
  console.log("=== Firebase Storage Export (READ-ONLY) ===");
  console.log(`Bucket: ${firebaseConfig.storageBucket}`);
  console.log(`Output: ${STORAGE_DIR}\n`);

  mkdirSync(STORAGE_DIR, { recursive: true });

  const gambarAmanResults = await exportStoragePath(
    "GambarAman/",
    join(STORAGE_DIR, "GambarAman")
  );

  const imagesResults = await exportStoragePath(
    "images/",
    join(STORAGE_DIR, "images")
  );

  const allResults = [...gambarAmanResults, ...imagesResults];

  // Write full report
  const reportPath = join(OUTPUT_DIR, "storage-report.json");
  writeFileSync(reportPath, JSON.stringify(allResults, null, 2), "utf-8");

  // Write blocked report if any
  const blocked = allResults.filter(
    (r) => r.status === "BLOCKED_BY_FIREBASE_STORAGE_BILLING" || r.status === "FIREBASE_PERMISSION_DENIED"
  );
  if (blocked.length > 0) {
    const blockedPath = join(OUTPUT_DIR, "storage-blocked.json");
    writeFileSync(blockedPath, JSON.stringify(blocked, null, 2), "utf-8");
    console.log(`\n⚠️  ${blocked.length} files blocked — see ${blockedPath}`);
  }

  // Summary
  const success = allResults.filter((r) => r.status === "SUCCESS").length;
  const failed = allResults.filter((r) => r.status !== "SUCCESS").length;
  console.log(`\n=== Storage Export Summary ===`);
  console.log(`Total files found: ${allResults.length}`);
  console.log(`Successfully downloaded: ${success}`);
  console.log(`Failed/blocked: ${failed}`);
  console.log(`Report saved: ${reportPath}`);
}

main().catch(console.error).finally(() => process.exit(0));
