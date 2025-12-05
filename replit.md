# Minecraft Server Status Monitor

## Overview

A real-time monitoring dashboard that tracks the status and performance of Mojang's Minecraft-related services. The application provides live status updates, uptime metrics, response times, and historical data visualization for critical Minecraft infrastructure including authentication servers, session servers, APIs, and content delivery services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript
- Single-page application using Wouter for client-side routing
- Component-based architecture with shadcn/ui design system
- TanStack Query for server state management and data fetching
- Vite as the build tool and development server

**UI Component Strategy**:
- Utilizes Radix UI primitives wrapped with Tailwind CSS through shadcn/ui
- Custom gaming aesthetic using "Press Start 2P" font for headers and "Inter" for body text
- Responsive design with mobile-first breakpoints
- Dark/light theme support with CSS variables

**State Management**:
- TanStack Query handles all server state with 30-second polling intervals for status data
- Local React state for UI interactions (theme toggle, service filtering)
- No global state management library needed due to simple data flow

**Data Visualization**:
- Recharts library for historical uptime graphs and mini sparklines
- Real-time status indicators with animated live badges
- 24-hour historical data aggregated by hour for performance

### Backend Architecture

**Server Framework**: Express.js with TypeScript
- RESTful API endpoints for service status and historical data
- In-memory storage with option to use PostgreSQL via Drizzle ORM
- Background health checker service running on 30-second intervals

**API Endpoints**:
- `GET /api/status` - Current status of all monitored services with uptime calculations
- `GET /api/history` - Historical data aggregated by hour for the past 24 hours

**Health Monitoring Service**:
- Checks six Mojang services: minecraft.net, session.minecraft.net, account.mojang.com, sessionserver.mojang.com, api.mojang.com, textures.minecraft.net
- Records HTTP status codes, response times, and timestamps
- Categorizes services as "online", "degraded", or "down" based on response codes
- Runs continuously in background with configurable intervals

**Storage Pattern**:
- Abstracted storage interface (IStorage) allowing swappable implementations
- MemStorage for in-memory development/testing
- PostgreSQL schema defined via Drizzle ORM for production persistence
- Service status records include serviceName, serviceUrl, status, responseTime, uptime, and timestamp

### Database Schema

**Tables**:
- `users` - Basic user authentication (currently unused in monitoring functionality)
  - id, username, password
- `service_status` - Time-series data for service health checks
  - id, serviceName, serviceUrl, status, responseTime, uptime, checkedAt

**Design Rationale**:
- Time-series approach allows historical analysis and uptime calculations
- Indexed by timestamp for efficient queries on historical data
- Uptime calculated dynamically from status records over specified time windows

### Data Flow

1. Background health checker polls Mojang services every 30 seconds
2. Results stored in database with timestamps
3. Frontend polls `/api/status` and `/api/history` endpoints every 30-60 seconds
4. API aggregates data (calculates uptime percentages, groups by hour)
5. React components render live status cards and historical charts
6. TanStack Query manages cache invalidation and refetching

### Design System

**Tailwind Configuration**:
- Custom spacing units (2, 4, 6, 8) for consistent layout
- Rounded corners: lg=9px, md=6px, sm=3px
- CSS variables for theme colors allowing light/dark mode switching
- "New York" style from shadcn/ui with custom overrides

**Color System**:
- Status colors: green (online), yellow (degraded), red (down)
- Semantic color tokens: background, foreground, border, card, popover, primary, secondary, muted, accent, destructive
- Each with associated foreground and border variants

**Typography Scale**:
- Headers: Press Start 2P font (retro gaming aesthetic)
- Body/Data: Inter font (clean, readable)
- Responsive text sizing with mobile/desktop breakpoints

## External Dependencies

### Third-Party Services
- **Mojang Services**: Monitored endpoints (minecraft.net, session.minecraft.net, account.mojang.com, sessionserver.mojang.com, api.mojang.com, textures.minecraft.net)
- No authentication required - all endpoints are publicly accessible HTTP checks

### Database
- **Neon Serverless Postgres**: Production database via `@neondatabase/serverless`
- Connection managed through DATABASE_URL environment variable
- Drizzle ORM for type-safe queries and migrations

### UI Libraries
- **Radix UI**: Unstyled accessible component primitives (@radix-ui/react-*)
- **Recharts**: Charting library for historical data visualization
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Component library built on Radix + Tailwind

### Development Tools
- **Vite**: Frontend build tool with HMR
- **TypeScript**: Type safety across frontend and backend
- **Drizzle Kit**: Database migrations and schema management
- **ESBuild**: Backend bundling for production
- **Wouter**: Lightweight client-side routing

### Fonts
- **Google Fonts**: Press Start 2P (gaming aesthetic), Inter (modern sans-serif)
- Loaded via CDN in HTML head for performance

### Development Plugins (Replit-specific)
- `@replit/vite-plugin-runtime-error-modal`: Error overlay
- `@replit/vite-plugin-cartographer`: Development navigation
- `@replit/vite-plugin-dev-banner`: Environment indicator