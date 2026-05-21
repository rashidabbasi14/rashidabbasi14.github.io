-- Create users table (new)
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"username" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

-- Add user_id column to existing tables (nullable initially for backfill)
ALTER TABLE "profiles" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "education" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "skill_categories" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "skills" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "employment" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "projects" ADD COLUMN IF NOT EXISTS "user_id" text;
ALTER TABLE "certifications" ADD COLUMN IF NOT EXISTS "user_id" text;

-- Add foreign key constraints
ALTER TABLE "certifications" ADD CONSTRAINT "certifications_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
ALTER TABLE "education" ADD CONSTRAINT "education_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
ALTER TABLE "employment" ADD CONSTRAINT "employment_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
ALTER TABLE "skill_categories" ADD CONSTRAINT "skill_categories_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
ALTER TABLE "skills" ADD CONSTRAINT "skills_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade;
