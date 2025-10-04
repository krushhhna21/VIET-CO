# VIET College Website - Setup Guide

## 🚀 Quick Start

### 1. Environment Setup
Copy the `.env.example` file to `.env` and fill in your actual values:

```bash
cp .env.example .env
```

### 2. Required Environment Variables

```env
# Database Configuration - Get this from Neon.tech
DATABASE_URL="postgresql://username:password@hostname/database?sslmode=require"

# JWT Secret - Generate a secure random string
JWT_SECRET="your-super-secure-jwt-secret-key-minimum-32-characters"

# Node Environment
NODE_ENV="development"

# Port (optional)
PORT=3000
```

### 3. Database Setup

1. Create a database on [Neon.tech](https://neon.tech)
2. Copy the connection string to your `.env` file
3. Push the database schema:

```bash
npm run db:push
```

### 4. Create Admin User

```bash
npm run tsx scripts/create-admin.ts
```

This creates an admin user:
- **Username**: `HOD@CO`
- **Password**: `VIET@CO1095`
- **Email**: `hod.computer@viet.edu`

### 5. Start Development Server

```bash
npm run dev
```

### 6. Access Admin Dashboard

1. Go to http://localhost:3000
2. Click "Admin Login"
3. Use the credentials above
4. Navigate to "Hero Slides" tab to manage homepage slides

## 🛠️ Features

- ✅ **Hero Slides Management**: Create and manage homepage carousel
- ✅ **News Management**: Add, edit, and publish news articles
- ✅ **Events Management**: Schedule and manage events
- ✅ **Notes Management**: Upload and organize study materials
- ✅ **Media Gallery**: Manage images and videos
- ✅ **Contact Forms**: View and respond to messages

## 🔧 Troubleshooting

### "Invalid token format" Error
- Clear browser localStorage: Go to DevTools > Application > Storage > Clear All
- Re-login with fresh credentials

### Database Connection Issues
- Verify DATABASE_URL in .env file
- Ensure Neon database is active and accessible
- Check network connectivity

### Build Issues
- Run `npm install` to ensure all dependencies are installed
- Clear node_modules: `rm -rf node_modules && npm install`

## 📦 Deployment

The project is configured for deployment on platforms like Railway, Vercel, or any Node.js hosting service.

### Build for Production
```bash
npm run build
npm start
```

## 🔐 Security Notes

- Change the default admin password after first login
- Use strong JWT secrets in production
- Enable HTTPS in production environments
- Regularly update dependencies