/**
 * Import Firebase Firestore data into Supabase PostgreSQL
 * 
 * Reads exported JSON files and inserts into Supabase tables.
 * 
 * Usage: node scripts/import-to-supabase.mjs
 * 
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables
 * (use service_role key for server-side import, NOT the publishable key)
 */

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "migration-data", "firebase");

// For import we need the service_role key (server-side only, never in browser)
const SUPABASE_URL = process.env.SUPABASE_URL || "https://aszzvfgtrwrhjgbzrcdt.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
  console.error("❌ SUPABASE_SERVICE_ROLE_KEY environment variable is required.");
  console.error("   Run: SUPABASE_SERVICE_ROLE_KEY=your_key node scripts/import-to-supabase.mjs");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const report = [];

async function importChats() {
  console.log("\nImporting chats...");
  try {
    const raw = readFileSync(join(DATA_DIR, "chats.json"), "utf-8");
    const docs = JSON.parse(raw);

    const rows = docs.map((doc) => ({
      legacy_firebase_id: doc._firebaseId,
      message: doc.message,
      sender_image: doc.sender?.image || "/AnonimUser.png",
      user_ip: doc.userIp || null,
      created_at: doc.timestamp,
    }));

    const { data, error } = await supabase.from("chats").insert(rows).select();

    if (error) throw error;

    console.log(`  ✅ chats: ${data.length}/${docs.length} imported`);
    report.push({
      table: "chats",
      legacyCount: docs.length,
      exportedCount: docs.length,
      importedCount: data.length,
      failedCount: docs.length - data.length,
      status: data.length === docs.length ? "SUCCESS" : "PARTIAL",
    });
  } catch (error) {
    console.error(`  ❌ chats: ${error.message}`);
    report.push({
      table: "chats",
      legacyCount: 14,
      exportedCount: 14,
      importedCount: 0,
      failedCount: 14,
      status: "FAILED",
      reason: error.message,
    });
  }
}

async function importRatings() {
  console.log("\nImporting ratings...");
  try {
    const raw = readFileSync(join(DATA_DIR, "ratings.json"), "utf-8");
    const docs = JSON.parse(raw);

    const rows = docs.map((doc) => ({
      legacy_firebase_id: doc._firebaseId,
      value: doc.value,
      created_at: doc.timestamp,
    }));

    const { data, error } = await supabase.from("ratings").insert(rows).select();

    if (error) throw error;

    console.log(`  ✅ ratings: ${data.length}/${docs.length} imported`);
    report.push({
      table: "ratings",
      legacyCount: docs.length,
      exportedCount: docs.length,
      importedCount: data.length,
      failedCount: docs.length - data.length,
      status: data.length === docs.length ? "SUCCESS" : "PARTIAL",
    });
  } catch (error) {
    console.error(`  ❌ ratings: ${error.message}`);
    report.push({
      table: "ratings",
      legacyCount: 41,
      exportedCount: 41,
      importedCount: 0,
      failedCount: 41,
      status: "FAILED",
      reason: error.message,
    });
  }
}

async function importBlacklistIps() {
  console.log("\nImporting blacklist_ips...");
  try {
    const raw = readFileSync(join(DATA_DIR, "blacklist_ips.json"), "utf-8");
    const docs = JSON.parse(raw);

    if (docs.length === 0) {
      console.log("  ℹ️  blacklist_ips: 0 documents (collection was empty)");
      report.push({
        table: "blacklist_ips",
        legacyCount: 0,
        exportedCount: 0,
        importedCount: 0,
        failedCount: 0,
        status: "SUCCESS",
        reason: "Collection was empty in Firebase",
      });
      return;
    }

    const rows = docs.map((doc) => ({
      ip_address: doc.ipAddress,
    }));

    const { data, error } = await supabase.from("blacklist_ips").insert(rows).select();

    if (error) throw error;

    console.log(`  ✅ blacklist_ips: ${data.length}/${docs.length} imported`);
    report.push({
      table: "blacklist_ips",
      legacyCount: docs.length,
      exportedCount: docs.length,
      importedCount: data.length,
      failedCount: docs.length - data.length,
      status: data.length === docs.length ? "SUCCESS" : "PARTIAL",
    });
  } catch (error) {
    console.error(`  ❌ blacklist_ips: ${error.message}`);
    report.push({
      table: "blacklist_ips",
      legacyCount: 0,
      exportedCount: 0,
      importedCount: 0,
      failedCount: 0,
      status: "FAILED",
      reason: error.message,
    });
  }
}

async function main() {
  console.log("=== Import Firebase Data to Supabase ===");
  console.log(`Supabase URL: ${SUPABASE_URL}`);
  console.log(`Data source: ${DATA_DIR}\n`);

  await importChats();
  await importRatings();
  await importBlacklistIps();

  console.log("\n=== Import Report ===");
  console.table(report);
}

main().catch(console.error);
