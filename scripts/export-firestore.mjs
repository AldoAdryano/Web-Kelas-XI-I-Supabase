/**
 * Firebase Firestore Export Script (READ-ONLY)
 * 
 * Exports all documents from chats, ratings, and blacklist_ips collections
 * using the public Firebase Client SDK config.
 * 
 * Usage: node scripts/export-firestore.mjs
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, orderBy } from "firebase/firestore";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, "..", "migration-data", "firebase");

// Same config from src/firebase.js — public, committed to source
const firebaseConfig = {
  apiKey: "AIzaSyDONEXFmMpls4cTT_LiiPesKhF0-bovQMc",
  authDomain: "project-web-kelas-3ab0d.firebaseapp.com",
  projectId: "project-web-kelas-3ab0d",
  storageBucket: "project-web-kelas-3ab0d.appspot.com",
  messagingSenderId: "273105413459",
  appId: "1:273105413459:web:f009fbd6f7800e9c8bada6",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const report = [];

async function exportCollection(name, queryFn) {
  console.log(`\nExporting collection: ${name}...`);
  try {
    const q = queryFn ? queryFn(collection(db, name)) : collection(db, name);
    const snapshot = await getDocs(q);
    
    const docs = snapshot.docs.map((doc) => ({
      _firebaseId: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamps to ISO strings for JSON
      ...(doc.data().timestamp && {
        timestamp: doc.data().timestamp.toDate
          ? doc.data().timestamp.toDate().toISOString()
          : doc.data().timestamp,
      }),
    }));

    const outputPath = join(OUTPUT_DIR, `${name}.json`);
    writeFileSync(outputPath, JSON.stringify(docs, null, 2), "utf-8");

    console.log(`  ✅ ${name}: ${docs.length} documents exported → ${outputPath}`);
    report.push({
      collection: name,
      documentCount: docs.length,
      status: "SUCCESS",
      reason: null,
      outputFile: `migration-data/firebase/${name}.json`,
    });

    return docs;
  } catch (error) {
    console.error(`  ❌ ${name}: FAILED — ${error.message}`);
    report.push({
      collection: name,
      documentCount: 0,
      status: "FAILED",
      reason: error.message,
      outputFile: null,
    });
    return [];
  }
}

async function main() {
  console.log("=== Firebase Firestore Export (READ-ONLY) ===");
  console.log(`Project: ${firebaseConfig.projectId}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  mkdirSync(OUTPUT_DIR, { recursive: true });

  // Export chats ordered by timestamp
  await exportCollection("chats", (col) => query(col, orderBy("timestamp")));

  // Export ratings
  await exportCollection("ratings");

  // Export blacklist_ips
  await exportCollection("blacklist_ips");

  // Write report
  const reportPath = join(OUTPUT_DIR, "export-report.json");
  writeFileSync(reportPath, JSON.stringify(report, null, 2), "utf-8");
  console.log(`\n=== Export Report ===`);
  console.table(report);
  console.log(`Report saved: ${reportPath}`);
}

main().catch(console.error).finally(() => process.exit(0));
