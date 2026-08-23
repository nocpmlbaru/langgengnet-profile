import { Pool } from 'pg';

const globalForDb = globalThis as unknown as { langgengnetMobilePool?: Pool };

export function getMobilePool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not configured');
  if (!globalForDb.langgengnetMobilePool) {
    globalForDb.langgengnetMobilePool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 3,
      idleTimeoutMillis: 10_000,
      connectionTimeoutMillis: 8_000,
      ssl: { rejectUnauthorized: false },
    });
  }
  return globalForDb.langgengnetMobilePool;
}
