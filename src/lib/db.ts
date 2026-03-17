import { Pool } from 'pg';

let pool: Pool;

export function getPool() {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    
    if (!connectionString || connectionString.includes("postgres://")) {
        // Only initialize if we have a real looking URL
        pool = new Pool({
            connectionString: connectionString,
            ssl: {
                rejectUnauthorized: false // Required for Aiven/Supabase external connections
            }
        });
    }
  }
  return pool;
}

export async function query(text: string, params?: any[]) {
  const p = getPool();
  if (!p) throw new Error("Database connection string not configured.");
  return p.query(text, params);
}
