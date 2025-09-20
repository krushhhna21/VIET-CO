import bcrypt from "bcrypt";
import { db } from "./server/db";
import { users } from "./shared/schema";
import { sql } from "drizzle-orm";

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash("VIET@CO1095", 10);
    const result = await db.execute(sql`
      INSERT INTO users (username, email, password, role)
      VALUES ('HOD@CO', 'hod.computer@viet.edu', ${hashedPassword}, 'admin')
      ON CONFLICT (username) DO UPDATE
      SET password = ${hashedPassword}
      RETURNING *;
    `);
    console.log('Admin user created:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();