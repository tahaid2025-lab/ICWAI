# Overview

ICWAI (I Can With AI) is an AI-powered creative studio application that combines Samsung-style painting assistant features with Apple Playground-like functionality and LEGO creation tools. The app provides three main creative modules: a Drawing Assistant for AI-generated artwork, a LEGO Creator for designing custom LEGO builds, and a Playground for interactive emoji-based art creation. Built as a full-stack web application, it features a React frontend with shadcn/ui components and an Express.js backend with AI image generation capabilities.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built with React and TypeScript using Vite as the build tool. The UI framework leverages shadcn/ui components with Radix UI primitives for consistent design patterns. The application uses Wouter for client-side routing and TanStack Query for server state management. The styling is handled through Tailwind CSS with custom CSS variables for theming support.

## Backend Architecture
The server runs on Express.js with TypeScript and follows a RESTful API design. It includes middleware for request logging, JSON parsing, and error handling. The application uses a modular approach with separate route handlers and service layers. The server includes Vite middleware integration for development mode with hot module replacement.

## Data Storage Solutions
The application is configured to use PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema includes a creations table that stores user-generated content with metadata in JSONB format. For development, the app includes an in-memory storage implementation that can be switched with the database implementation.

## Authentication and Authorization
Currently, the application does not implement user authentication or authorization mechanisms. All API endpoints are publicly accessible, and there is no user session management.

## AI Image Generation
The core AI functionality is powered by Google's Gemini 2.0 Flash model with image generation capabilities. The service handles prompt processing for different creation types including drawing assistance, LEGO designs, and playground artwork. Generated images are stored locally on the server filesystem and served as static assets.

## API Structure
The backend exposes RESTful endpoints under the `/api` prefix:
- `GET /api/creations` - Retrieve all user creations
- `GET /api/creations/:type` - Filter creations by type
- `POST /api/generate/drawing` - Generate AI artwork
- `POST /api/generate/lego` - Create LEGO designs
- `POST /api/generate/playground` - Generate playground art
- `DELETE /api/creations/:id` - Remove creations

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL database hosting with the `@neondatabase/serverless` driver
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect support

## AI Services
- **Google Gemini AI**: Uses the `@google/genai` package to access Gemini 2.0 Flash model for image generation
- **API Key Configuration**: Requires `GEMINI_API_KEY` environment variable for authentication

## UI Component Libraries
- **Radix UI**: Comprehensive collection of low-level UI primitives for accessibility and customization
- **shadcn/ui**: Pre-built component system built on top of Radix UI with Tailwind CSS styling
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Build tool and development server with React plugin support
- **TypeScript**: Type safety across the entire application stack
- **Tailwind CSS**: Utility-first CSS framework with custom design system

## State Management
- **TanStack Query**: Server state management with caching, background updates, and error handling
- **React Hook Form**: Form state management with validation support using Zod schemas

## Additional Services
- **Connect PG Simple**: PostgreSQL session store for Express sessions
- **Date-fns**: Date manipulation and formatting utilities
- **Class Variance Authority**: Utility for creating component variants with Tailwind CSS