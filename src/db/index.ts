import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle, NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function createDb(): NeonHttpDatabase<typeof schema> & { $client: NeonQueryFunction<false, false> } {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
      "Please create a .env.local file with DATABASE_URL pointing to your NEON PostgreSQL database."
    );
  }
  const sql = neon(connectionString);
  return drizzle(sql, { schema });
}

let _db: ReturnType<typeof createDb> | null = null;

// Use a Proxy to lazily initialize the database connection on first access
export const db = new Proxy({} as ReturnType<typeof createDb>, {
  get(_target, prop) {
    if (!_db) {
      _db = createDb();
    }
    return (_db as any)[prop];
  },
});
