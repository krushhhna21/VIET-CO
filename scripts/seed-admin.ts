import 'dotenv/config';
import bcrypt from 'bcrypt';
import { db } from '../server/db';
import { users } from '../shared/schema';
import { eq } from 'drizzle-orm';

/*
  Seed an initial admin user.
  Required env vars (set in Render dashboard or locally):
    ADMIN_USERNAME
    ADMIN_EMAIL
    ADMIN_PASSWORD
  Optional:
    ADMIN_FORCE=true  (upgrade existing user to admin & reset password)

  Run locally (PowerShell example):
    $env:ADMIN_USERNAME="admin"; $env:ADMIN_EMAIL="admin@example.com"; $env:ADMIN_PASSWORD="MySecret123"; npm run seed:admin
*/

async function main() {
  const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_FORCE } = process.env as Record<string,string|undefined>;
  if (!ADMIN_USERNAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.log('[seed-admin] Skipping: ADMIN_USERNAME/ADMIN_EMAIL/ADMIN_PASSWORD not all set.');
    return;
  }

  console.log('[seed-admin] Seeding admin user:', ADMIN_USERNAME);
  try {
    const existing = await db.select().from(users).where(eq(users.username, ADMIN_USERNAME));
    const force = (ADMIN_FORCE || '').toLowerCase() === 'true';
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);

    if (existing.length === 0) {
      await db.insert(users).values({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: hashed,
        role: 'admin'
      });
      console.log('[seed-admin] Admin user created.');
    } else if (force) {
      await db.update(users).set({ password: hashed, role: 'admin', email: ADMIN_EMAIL }).where(eq(users.username, ADMIN_USERNAME));
      console.log('[seed-admin] Existing user updated to admin (force).');
    } else {
      console.log('[seed-admin] User already exists. Use ADMIN_FORCE=true to update.');
    }
  } catch (err: any) {
    console.error('[seed-admin] Failed:', err.message || err);
  } finally {
    process.exit(0);
  }
}

main();
