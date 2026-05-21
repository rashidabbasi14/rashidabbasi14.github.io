import { db } from "@/db";
import { profiles, education, skillCategories, skills, employment, projects, certifications } from "@/db/schema";
import { eq, asc, desc } from "drizzle-orm";

// ─── Profile ─────────────────────────────────────────────────────────────────
export async function getProfile() {
  const result = await db.select().from(profiles).limit(1);
  return result[0] || null;
}

// ─── Education ───────────────────────────────────────────────────────────────
export async function getEducation() {
  return db.select().from(education).orderBy(asc(education.sortOrder));
}

// ─── Skills ──────────────────────────────────────────────────────────────────
export async function getSkillCategories() {
  const categories = await db
    .select()
    .from(skillCategories)
    .orderBy(asc(skillCategories.sortOrder));

  const result = [];
  for (const cat of categories) {
    const items = await db
      .select()
      .from(skills)
      .where(eq(skills.categoryId, cat.id))
      .orderBy(asc(skills.sortOrder));
    result.push({ ...cat, items });
  }
  return result;
}

// ─── Employment ──────────────────────────────────────────────────────────────
export async function getEmployment() {
  return db
    .select()
    .from(employment)
    .orderBy(desc(employment.isCurrent), asc(employment.sortOrder));
}

// ─── Projects ────────────────────────────────────────────────────────────────
export async function getProjects() {
  return db
    .select()
    .from(projects)
    .orderBy(desc(projects.priority), asc(projects.sortOrder));
}

export async function getProjectById(id: number) {
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0] || null;
}

// ─── Certifications ──────────────────────────────────────────────────────────
export async function getCertifications() {
  return db
    .select()
    .from(certifications)
    .orderBy(asc(certifications.sortOrder));
}
