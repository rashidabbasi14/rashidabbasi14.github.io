import { pgTable, serial, varchar, text, boolean, jsonb, integer, timestamp } from "drizzle-orm/pg-core";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: text("id").primaryKey(), // Clerk's userId
  username: varchar("username", { length: 100 }).unique().notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── Profile ─────────────────────────────────────────────────────────────────
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  tagline: varchar("tagline", { length: 255 }).notNull(),
  description: text("description").notNull(),
  aboutMe: text("about_me").notNull(),
  footerAboutMe: text("footer_about_me").notNull(),
  image: text("image").notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  social: jsonb("social").$type<{
    facebook?: string;
    x?: string;
    instagram?: string;
    upwork?: string;
    linkedin?: string;
    github?: string;
  }>().notNull(),
  isPrivate: boolean("is_private").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Education ───────────────────────────────────────────────────────────────
export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  degree: varchar("degree", { length: 255 }).notNull(),
  institution: varchar("institution", { length: 255 }).notNull(),
  year: varchar("year", { length: 20 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ─── Skill Categories ────────────────────────────────────────────────────────
export const skillCategories = pgTable("skill_categories", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  categoryId: integer("category_id").references(() => skillCategories.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  image: text("image").notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ─── Employment ──────────────────────────────────────────────────────────────
export const employment = pgTable("employment", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  duration: varchar("duration", { length: 100 }),
  description: text("description"),
  image: text("image"),
  isCurrent: boolean("is_current").default(false).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
});

// ─── Projects ────────────────────────────────────────────────────────────────
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description"),
  coverImage: text("cover_image"),
  images: text("images").array(),
  technologies: text("technologies").array(),
  githubUrl: text("github_url"),
  liveUrl: text("live_url"),
  priority: boolean("priority").default(false).notNull(),
  readme: text("readme"),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Certifications ──────────────────────────────────────────────────────────
export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  description: text("description"),
  image: text("image"),
  url: text("url"),
  tags: text("tags").array(),
  sortOrder: integer("sort_order").default(0).notNull(),
});
