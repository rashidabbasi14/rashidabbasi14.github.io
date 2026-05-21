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
import { eq, and, count } from "drizzle-orm";

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

// ─── Landing Page Stats ───────────────────────────────────────────────────────

export interface LandingStats {
  totalUsers: number;
  totalPublic: number;
  totalPrivate: number;
  totalProjects: number;
  totalSkills: number;
  totalCertifications: number;
}

export async function getLandingStats(): Promise<LandingStats> {
  const [userResult] = await db.select({ value: count() }).from(users);
  const [publicResult] = await db
    .select({ value: count() })
    .from(profiles)
    .where(eq(profiles.isPrivate, false));
  const [privateResult] = await db
    .select({ value: count() })
    .from(profiles)
    .where(eq(profiles.isPrivate, true));
  const [projectResult] = await db.select({ value: count() }).from(projects);
  const [skillResult] = await db.select({ value: count() }).from(skills);
  const [certResult] = await db.select({ value: count() }).from(certifications);

  return {
    totalUsers: userResult?.value ?? 0,
    totalPublic: publicResult?.value ?? 0,
    totalPrivate: privateResult?.value ?? 0,
    totalProjects: projectResult?.value ?? 0,
    totalSkills: skillResult?.value ?? 0,
    totalCertifications: certResult?.value ?? 0,
  };
}

// ─── Featured Portfolios ──────────────────────────────────────────────────────

export interface PortfolioThumbnail {
  username: string;
  name: string;
  title: string;
  tagline: string;
  image: string;
  projectCount: number;
}

export async function getPortfolios(): Promise<PortfolioThumbnail[]> {
  const rows = await db
    .select({
      username: users.username,
      name: profiles.name,
      title: profiles.title,
      tagline: profiles.tagline,
      image: profiles.image,
      userId: users.id,
    })
    .from(users)
    .innerJoin(profiles, eq(users.id, profiles.userId))
    .where(eq(profiles.isPrivate, false))
    .orderBy(users.createdAt);

  // Attach project counts
  const result: PortfolioThumbnail[] = [];
  for (const row of rows) {
    const [countResult] = await db
      .select({ value: count() })
      .from(projects)
      .where(eq(projects.userId, row.userId));
    result.push({
      username: row.username,
      name: row.name,
      title: row.title,
      tagline: row.tagline,
      image: row.image,
      projectCount: countResult?.value ?? 0,
    });
  }

  return result;
}
