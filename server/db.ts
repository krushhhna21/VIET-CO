import dotenv from 'dotenv';
dotenv.config();

// Use the standard 'pg' driver + drizzle node-postgres adapter for a regular Postgres
// instance (Render provisioned DB). The previous Neon serverless driver caused runtime
// failures because it's intended for the Neon HTTP/WebSocket protocol, not a plain
// Postgres TCP connection.
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });

// Basic connection smoke test (non-blocking). This helps surface auth / network issues
// early in logs instead of only during the first query inside a request handler.
pool
  .query('SELECT 1')
  .then(() => {
    console.log('[db] Connection test succeeded');
  })
  .catch((err) => {
    console.error('[db] Connection test failed:', err.message);
  });

pool.on('error', (err) => {
  console.error('[db] Unexpected client error:', err);
});