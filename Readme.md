# PROTCTUS - Stealth Cybersecurity Landing Page

## Project Overview
World-class 3D cinematic website for PROTCTUS, a stealth cybersecurity product. Features immersive scroll-driven storytelling with matte realism, Three.js 3D animations, and GSAP ScrollTrigger transitions.

## Recent Changes (November 10, 2025)
- Created full cinematic 3D landing experience with Four sections: Initialization, The Core, The Network, The Shield
- Implemented PostgreSQL database with waitlist table for early access signups
- Added email collection functionality with backend API endpoint
- Built WaitlistModal component for collecting user emails
- Integrated ambient audio controller with low-frequency hum
- Added loading sequence, scroll indicator, and progress bar
- Configured matte black design (#0C0C0C) with ultra-thin Outfit typography

## Architecture
**Frontend:**
- React SPA with Three.js for 3D rendering
- GSAP ScrollTrigger for scroll-driven animations
- Cinematic particle systems, rotating sphere, neural grid, and shield dome
- Mouse parallax camera movement
- Tailwind CSS with custom matte realism theme

**Backend:**
- Express.js server
- PostgreSQL database (Neon-backed)
- Drizzle ORM for database operations
- REST API endpoint: POST /api/waitlist

**Database Schema:**
- `waitlist` table: id (varchar/UUID), email (text/unique), createdAt (timestamp)

## Key Features
- Sequential loading experience with initialization steps
- Four scroll-driven cinematic sections with unique 3D scenes
- Email waitlist collection with form validation
- Ambient audio controller (toggleable)
- Scroll progress indicator
- Mouse parallax 3D camera movement
- Fully responsive design
- Matte materials with soft ambient lighting

## Tech Stack
- Frontend: React, Three.js, GSAP, TanStack Query, Wouter, Tailwind CSS
- Backend: Express.js, PostgreSQL, Drizzle ORM
- Typography: Outfit (ultra-thin), Space Grotesk (mono)
- Color Scheme: Deep black (#0C0C0C), dark grays, neutral whites

## Development Commands
- `npm run dev` - Start development server
- `npm run db:push` - Push database schema changes
- Server runs on port 5000

## Design Principles
- Matte realism over flashy effects
- No glow, no neon, no glossy surfaces
- Ultra-thin geometric uppercase typography
- Calm precision with depth and soft shadows
- Sequential text animations like system logs
