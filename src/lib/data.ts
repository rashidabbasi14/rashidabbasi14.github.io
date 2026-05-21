import { db } from "@/db";
import {
  profiles,
  education,
  skillCategories,
  skills,
  employment,
  projects,
  certifications,
  users,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";

// ─── User Lookup ──────────────────────────────────────────────────────────────

export async function getUserByUsername(username: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);
  return user ?? null;
}

export async function getUserById(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  return user ?? null;
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export async function getProfile(userId: string) {
  const [profile] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
  return profile ?? null;
}

// ─── Education ────────────────────────────────────────────────────────────────

export async function getEducation(userId: string) {
  return db
    .select()
    .from(education)
    .where(eq(education.userId, userId))
    .orderBy(education.sortOrder);
}

// ─── Skill Categories & Skills ────────────────────────────────────────────────

export async function getSkillCategories(userId: string) {
  const categories = await db
    .select()
    .from(skillCategories)
    .where(eq(skillCategories.userId, userId))
    .orderBy(skillCategories.sortOrder);

  // Attach skills to each category
  const result = [];
  for (const cat of categories) {
    const items = await db
      .select()
      .from(skills)
      .where(
        and(eq(skills.categoryId, cat.id), eq(skills.userId, userId))
      )
      .orderBy(skills.sortOrder);
    result.push({ ...cat, items });
  }
  return result;
}

// ─── Employment ───────────────────────────────────────────────────────────────

export async function getEmployment(userId: string) {
  return db
    .select()
    .from(employment)
    .where(eq(employment.userId, userId))
    .orderBy(employment.sortOrder);
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getProjects(userId: string) {
  return db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(projects.sortOrder);
}

export async function getProjectById(id: number, userId: string) {
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, userId)))
    .limit(1);
  return project ?? null;
}

// ─── Certifications ───────────────────────────────────────────────────────────

export async function getCertifications(userId: string) {
  return db
    .select()
    .from(certifications)
    .where(eq(certifications.userId, userId))
    .orderBy(certifications.sortOrder);
}
