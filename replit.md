# Overview

This is a full-stack web application for the Vishweshwarayya Institute of Engineering and Technology (VIET) Computer Department. The application serves as a comprehensive departmental website featuring news, events, study materials, media gallery, faculty information, and administrative capabilities. Built with modern web technologies, it provides both public-facing content and an admin dashboard for content management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, modern UI design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds
- **Component Structure**: Modular design with separate page components, reusable UI components, and section-based layouts

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for better maintainability
- **API Design**: RESTful API with structured route handling
- **Authentication**: JWT-based authentication with bcrypt for password hashing
- **File Structure**: Separation of concerns with dedicated route handlers, storage layer, and middleware

## Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon serverless hosting
- **Schema**: Well-defined tables for users, faculty, news, events, notes, media, and contacts
- **Migrations**: Drizzle Kit for database schema management and migrations

## Authentication & Authorization
- **Strategy**: JWT tokens stored in localStorage for client-side auth state
- **Roles**: Role-based access control (admin, faculty, user)
- **Password Security**: bcrypt hashing for secure password storage
- **Session Management**: Token-based authentication with logout functionality

## Content Management System
- **Admin Dashboard**: Full CRUD operations for all content types
- **Content Types**: News articles, events, study notes, media items, faculty profiles
- **Publishing Workflow**: Draft/published status for content approval
- **File Management**: Support for various file types (PDFs, images, videos)

## API Structure
- **Authentication**: `/api/auth/*` - Login, logout, user management
- **Content APIs**: 
  - `/api/news` - News articles management
  - `/api/events` - Events and workshops
  - `/api/notes` - Study materials and lecture notes
  - `/api/media` - Photo and video gallery
  - `/api/faculty` - Faculty profiles and information
  - `/api/contacts` - Contact form submissions

## Development & Deployment
- **Development Server**: Vite dev server with HMR for React frontend
- **Production Build**: esbuild for server bundling, Vite for client bundling
- **Environment**: Environment-based configuration with development/production modes
- **Code Quality**: TypeScript strict mode, path aliases for clean imports

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **WebSocket Support**: Real-time database connections via WebSocket constructor

## UI & Styling
- **Radix UI**: Comprehensive set of accessible, unstyled UI primitives
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: Pre-built component library built on Radix UI and Tailwind
- **Lucide React**: Modern icon library for consistent iconography

## Development Tools
- **Replit Integration**: Development environment integration with runtime error handling
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **Font Loading**: Google Fonts integration for typography

## Authentication & Security
- **jsonwebtoken**: JWT token generation and verification
- **bcrypt**: Password hashing and verification
- **Input Validation**: Zod schema validation for API endpoints

## File Handling
- **File Upload**: Support for various file types with size and type validation
- **Media Processing**: Image and video handling for gallery features
- **Document Management**: PDF and document file support for study materials

## State Management
- **TanStack Query**: Server state caching, background updates, optimistic updates
- **React Hook Form**: Form state management with validation
- **Hookform Resolvers**: Integration between React Hook Form and validation libraries