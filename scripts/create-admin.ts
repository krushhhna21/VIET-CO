import dotenv from 'dotenv';
dotenv.config();

import { storage } from '../server/storage';
import bcrypt from 'bcrypt';

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('VIET@CO1095', 10);
    const user = await storage.createUser({
      username: 'HOD@CO',
      email: 'hod.computer@viet.edu',
      password: hashedPassword,
      role: 'admin'
    });
    
    console.log('Admin user created:', user);
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
}

createAdmin();