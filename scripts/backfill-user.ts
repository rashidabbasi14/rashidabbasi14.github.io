/**
 * Backfill Script: Insert user record and associate existing data
 *
 * This script:
 * 1. Inserts the admin user into the `users` table
 * 2. Backfills all existing data with the user's userId
 * 3. Makes user_id columns NOT NULL (after backfill)
 *
 * Usage:
 *   npx tsx scripts/backfill-user.ts
 *
 * Prerequisites:
 *   - DATABASE_URL must be set in .env.local or environment
 *   - Migration must have been run (user_id columns exist, nullable)
 */

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "..", ".env.local") });

import { db } from "../src/db";
import {
  users,
  profiles,
  education,
  skillCategories,
  skills,
  employment,
  projects,
  certifications,
} from "../src/db/schema";
import { eq, isNull, sql } from "drizzle-orm";

const CLERK_USER_ID = "user_3E0aL1OBFGGNooYtGzEAs387N05";
const USERNAME = "rashidabbasi";
const EMAIL = "rashidabbasi17@gmail.com";

async function main() {
  console.log("🚀 Starting user backfill...\n");

  // ── 1. Insert user record ──────────────────────────────────────────────
  console.log("📋 Inserting user record...");
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, CLERK_USER_ID))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("   ⏭️  User already exists, skipping insert");
    } else {
      await db.insert(users).values({
        id: CLERK_USER_ID,
        username: USERNAME,
        email: EMAIL,
      });
      console.log("   ✅ User inserted:", USERNAME);
    }
  } catch (error) {
    console.error("   ❌ Failed to insert user:", error);
    process.exit(1);
  }

  // ── 2. Backfill profiles ──────────────────────────────────────────────
  console.log("\n📋 Backfilling profiles...");
  try {
    const result = await db
      .update(profiles)
      .set({ userId: CLERK_USER_ID })
      .where(isNull(profiles.userId));
    console.log(`   ✅ Profiles backfilled`);
  } catch (error) {
    console.error("   ❌ Failed to backfill profiles:", error);
  }

  // ── 3. Backfill education ─────────────────────────────────────────────
  console.log("📋 Backfilling education...");
  try {
    await db
      .update(education)
      .set({ userId: CLERK_USER_ID })
      .where(isNull(education.userId));
    console.log(`   ✅ Education backfilled`);
  } catch (error) {
    console.error("   ❌ Failed to backfill education:", error);
  }

  // ── 4. Backfill skill_categories ──────────────────────────────────────
  console.log("📋 Backfilling skill categories...");
  try {
    await db
      .update(skillCategories)
      .set({ userId: CLERK_USER_ID })
      .where(isNull(skillCategories.userId));
    console.log(`   ✅ Skill categories backfilled`);
  } catch (error) {
    console.error("   ❌ Failed to backfill skill categories:", error);
  }

  // ── 5. Backfill skills ────────────────────────────────────────────────
  console.log("📋 Backfilling skills...");
  try {
    await db
      .update(skills)
      .set({ userId: CLERK_USER_ID })
      .where(isNull(skills.userId));
    console.log(`   ✅ Skills backfilled`);
  } catch (error) {
    console.error("   ❌ Failed to backfill skills:", error);
  }

  // ── 6. Backfill employment ────────────────────────────────────────────
  console.log("📋 Backfilling employment...");
  try {
    await db
      .update(employment)
      .set({ userId: CLERK_USER_ID })
      .where(isNull(employment.userId));
    console.log(`   ✅ Employment backfilled`);
  } catch (error) {
    console.error("   ❌ Failed to backfill employment:", error);
  }

  // ── 7. Backfill projects ──────────────────────────────────────────────
  console.log("📋 Backfilling projects...");
  try {
    await db
      .update(projects)
      .set({ userId: CLERK_USER_ID })
      .where(isNull(projects.userId));
    console.log(`   ✅ Projects backfilled`);
  } catch (error) {
    console.error("   ❌ Failed to backfill projects:", error);
  }

  // ── 8. Backfill certifications ────────────────────────────────────────
  console.log("📋 Backfilling certifications...");
  try {
    await db
      .update(certifications)
      .set({ userId: CLERK_USER_ID })
      .where(isNull(certifications.userId));
    console.log(`   ✅ Certifications backfilled`);
  } catch (error) {
    console.error("   ❌ Failed to backfill certifications:", error);
  }

  // ── 9. Verify backfill ────────────────────────────────────────────────
  console.log("\n📋 Verifying backfill...");
  const tables = [
    { name: "profiles", table: profiles },
    { name: "education", table: education },
    { name: "skill_categories", table: skillCategories },
    { name: "skills", table: skills },
    { name: "employment", table: employment },
    { name: "projects", table: projects },
    { name: "certifications", table: certifications },
  ];

  let allClean = true;
  for (const { name, table } of tables) {
    const nullRows = await db.select().from(table).where(isNull(table.userId));
    if (nullRows.length > 0) {
      console.error(`   ❌ ${name}: ${nullRows.length} rows still have NULL user_id`);
      allClean = false;
    } else {
      console.log(`   ✅ ${name}: All rows have user_id set`);
    }
  }

  if (!allClean) {
    console.error("\n❌ Some tables still have NULL user_id values. Please investigate.");
    process.exit(1);
  }

  // ── 10. Make user_id NOT NULL ──────────────────────────────────────────
  console.log("\n📋 Making user_id columns NOT NULL...");
  const alterStatements = [
    `ALTER TABLE "profiles" ALTER COLUMN "user_id" SET NOT NULL;`,
    `ALTER TABLE "education" ALTER COLUMN "user_id" SET NOT NULL;`,
    `ALTER TABLE "skill_categories" ALTER COLUMN "user_id" SET NOT NULL;`,
    `ALTER TABLE "skills" ALTER COLUMN "user_id" SET NOT NULL;`,
    `ALTER TABLE "employment" ALTER COLUMN "user_id" SET NOT NULL;`,
    `ALTER TABLE "projects" ALTER COLUMN "user_id" SET NOT NULL;`,
    `ALTER TABLE "certifications" ALTER COLUMN "user_id" SET NOT NULL;`,
  ];

  for (const sql of alterStatements) {
    try {
      await db.execute(sql);
      console.log(`   ✅ ${sql.trim()}`);
    } catch (error) {
      console.error(`   ❌ Failed: ${sql.trim()}`, error);
    }
  }

  console.log("\n🎉 Backfill complete! All data is now associated with user:", USERNAME);
  process.exit(0);
}

main().catch((error) => {
  console.error("Backfill failed:", error);
  process.exit(1);
});
