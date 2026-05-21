/**
 * Data Migration Script
 *
 * Reads existing JS data files and inserts them into NEON PostgreSQL via Drizzle ORM.
 *
 * Usage:
 *   npx tsx scripts/migrate-data.ts
 *
 * Prerequisites:
 *   - DATABASE_URL must be set in .env.local or environment
 *   - Database schema must be pushed first: npx drizzle-kit push
 */

import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(__dirname, "..", ".env.local") });

import { db } from "../src/db";
import {
  profiles,
  education,
  skillCategories,
  skills,
  employment,
  projects,
  certifications,
} from "../src/db/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// ─── Helper: Load JS data files ──────────────────────────────────────────────
// The existing data is in `const myData = { ... }` format (not module exports).
// We read the raw JS files and extract the object literals.

function extractObjectFromJS(filePath: string): string {
  const content = fs.readFileSync(filePath, "utf-8");
  // Match array: = [ ... ];
  const arrayMatch = content.match(/=\s*(\[[\s\S]*?\])\s*;?\s*$/m);
  if (arrayMatch) return arrayMatch[1];
  // Match object: = { ... };  (greedy, finds last `}` before optional semicolon)
  const objMatch = content.match(/=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if (objMatch) return objMatch[1];
  throw new Error(`Could not extract data from ${filePath}`);
}

// ─── Profile Data ────────────────────────────────────────────────────────────
interface MyData {
  name: string;
  title: string;
  tagline: string;
  description: string;
  aboutMe: string;
  footerAboutMe: string;
  image: string;
  email: string;
  phone: string;
  location: string;
  education: Array<{ degree: string; institution: string; year: string }>;
  skills: Array<{
    name: string;
    items: Array<{ name: string; image: string }>;
  }>;
  social: {
    facebook?: string;
    x?: string;
    instagram?: string;
    upwork?: string;
    linkedin?: string;
    github?: string;
  };
}

// ─── Employment Data ─────────────────────────────────────────────────────────
interface EmploymentItem {
  title: string;
  company: string;
  duration: string;
  description: string;
  image: string;
}

// ─── Certifications Data ─────────────────────────────────────────────────────
interface CertificationItem {
  name: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
  url: string;
}

// ─── Project Data ────────────────────────────────────────────────────────────
interface ProjectItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription?: string;
  coverImage: string;
  technologies: string[];
  projectLink: string;
  liveLink: string;
}

async function main() {
  console.log("🚀 Starting data migration...\n");

  const dataDir = path.join(__dirname, "..", "js", "data");

  // ── 1. Profile ──────────────────────────────────────────────────────────
  console.log("📋 Migrating profile...");
  try {
    const myDataPath = path.join(dataDir, "my-data.js");
    const myDataRaw = extractObjectFromJS(myDataPath);
    // Use Function constructor to safely evaluate the object
    const myData = new Function(`"use strict"; return (${myDataRaw})`)() as MyData;

    // Upsert profile
    const existingProfile = await db.select().from(profiles).limit(1);
    const profileData = {
      name: myData.name,
      title: myData.title,
      tagline: myData.tagline,
      description: myData.description,
      aboutMe: myData.aboutMe,
      footerAboutMe: myData.footerAboutMe,
      image: myData.image,
      email: myData.email,
      phone: myData.phone || null,
      location: myData.location || null,
      social: myData.social,
    };

    if (existingProfile.length > 0) {
      await db.update(profiles).set(profileData).where(eq(profiles.id, existingProfile[0].id));
      console.log("   ✅ Profile updated");
    } else {
      await db.insert(profiles).values(profileData);
      console.log("   ✅ Profile created");
    }

    // ── 2. Education ──────────────────────────────────────────────────────
    console.log("📋 Migrating education...");
    await db.delete(education); // Clear existing
    for (const [i, edu] of myData.education.entries()) {
      await db.insert(education).values({
        degree: edu.degree,
        institution: edu.institution,
        year: edu.year,
        sortOrder: i,
      });
    }
    console.log(`   ✅ ${myData.education.length} education records migrated`);

    // ── 3. Skills ─────────────────────────────────────────────────────────
    console.log("📋 Migrating skills...");
    await db.delete(skills);
    await db.delete(skillCategories);
    for (const [i, cat] of myData.skills.entries()) {
      const [insertedCat] = await db
        .insert(skillCategories)
        .values({ name: cat.name, sortOrder: i })
        .returning();
      for (const [j, item] of cat.items.entries()) {
        await db.insert(skills).values({
          categoryId: insertedCat.id,
          name: item.name,
          image: item.image,
          sortOrder: j,
        });
      }
    }
    console.log(`   ✅ ${myData.skills.length} skill categories migrated`);
  } catch (error) {
    console.error("   ❌ Failed to migrate profile/skills/education:", error);
  }

  // ── 4. Employment ──────────────────────────────────────────────────────
  console.log("📋 Migrating employment...");
  try {
    const empPath = path.join(dataDir, "employment-data.js");
    const empRaw = extractObjectFromJS(empPath);
    const empData = new Function(`"use strict"; return (${empRaw})`)() as EmploymentItem[];

    await db.delete(employment);
    for (const [i, emp] of empData.entries()) {
      await db.insert(employment).values({
        title: emp.title,
        company: emp.company,
        duration: emp.duration || null,
        description: emp.description || null,
        image: emp.image || null,
        isCurrent: i === 0, // First item is current role
        sortOrder: i,
      });
    }
    console.log(`   ✅ ${empData.length} employment records migrated`);
  } catch (error) {
    console.error("   ❌ Failed to migrate employment:", error);
  }

  // ── 5. Certifications ──────────────────────────────────────────────────
  console.log("📋 Migrating certifications...");
  try {
    const certPath = path.join(dataDir, "certifications-data.js");
    const certRaw = extractObjectFromJS(certPath);
    const certData = new Function(`"use strict"; return (${certRaw})`)() as CertificationItem[];

    await db.delete(certifications);
    for (const [i, cert] of certData.entries()) {
      await db.insert(certifications).values({
        title: cert.name,
        subtitle: cert.subtitle || null,
        description: cert.description || null,
        image: cert.image || null,
        url: cert.url || null,
        tags: cert.tags || null,
        sortOrder: i,
      });
    }
    console.log(`   ✅ ${certData.length} certifications migrated`);
  } catch (error) {
    console.error("   ❌ Failed to migrate certifications:", error);
  }

  // ── 6. Projects ────────────────────────────────────────────────────────
  console.log("📋 Migrating projects...");
  try {
    const projectsDir = path.join(dataDir, "projects");
    const indexRaw = fs.readFileSync(path.join(projectsDir, "index.js"), "utf-8");
    const fileMatch = indexRaw.match(/const projectFiles = (\[[\s\S]*?\]);/);
    if (!fileMatch) throw new Error("Could not parse project index");

    const projectFiles = new Function(`"use strict"; return (${fileMatch[1]})`)() as string[];

    await db.delete(projects);
    for (const [i, fileName] of projectFiles.entries()) {
      try {
        const filePath = path.join(projectsDir, `${fileName}.js`);
        const content = fs.readFileSync(filePath, "utf-8");
        const objMatch = content.match(/=\s*(\{[\s\S]*\});?$/);
        if (!objMatch) {
          console.warn(`   ⚠️  Could not parse project: ${fileName}`);
          continue;
        }
        const projectData = new Function(`"use strict"; return (${objMatch[1]})`)() as ProjectItem;

        await db.insert(projects).values({
          title: projectData.title,
          subtitle: projectData.subtitle || null,
          description: projectData.longDescription || projectData.description || null,
          coverImage: projectData.coverImage || null,
          technologies: projectData.technologies || null,
          githubUrl: projectData.projectLink || null,
          liveUrl: projectData.liveLink || null,
          priority: i < 6, // First 6 projects are priority
          sortOrder: i,
        });
        console.log(`   ✅ ${projectData.title}`);
      } catch (err) {
        console.error(`   ❌ Failed to migrate project ${fileName}:`, err);
      }
    }
    console.log(`   ✅ ${projectFiles.length} projects migrated`);
  } catch (error) {
    console.error("   ❌ Failed to migrate projects:", error);
  }

  console.log("\n🎉 Migration complete!");
  process.exit(0);
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exit(1);
});
