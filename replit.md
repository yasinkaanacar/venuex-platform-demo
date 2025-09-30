# Overview

VenueX is a B2B SaaS platform that connects in-store retail data with digital advertising platforms. The system provides a comprehensive overview dashboard for stakeholders to monitor cross-platform performance metrics, data integration health, and receive AI-powered enrichment suggestions. Built as a modern web application with React frontend and Express.js backend, it focuses on delivering actionable insights for CMOs, Digital Performance Managers, and CRM/BI Managers.

# User Preferences

Preferred communication style: Simple, everyday language.

# Version History

## V1 State (September 1, 2025)
**Dashboard Layout and Features:**
- **Filter Bar**: Simplified to Platform and Date Range filters only, displayed in horizontal flex layout with soft gray borders (gray-200/gray-700)
- **Platform Filter**: Google set as default, no "All Platforms" option
- **Sidebar**: VenueX logo sized at 183px, aligned at 80px height with header
- **KPI Cards**: 4 tiles with hover tooltips showing detailed module-specific metrics
- **Data Health & Flow**: Alert-style banner with blue background/border styling, no shadow
- **Tables**: Top Performing Locations and Campaigns with sortable headers, visual separation borders
- **Data Enrichment**: Single button per row layout - "Apply Fix" for some rows, "More Information" for others
- **UI Theme**: Soft border colors throughout, responsive design maintained

## V2 State (September 3, 2025)
**Architecture Migration - Frontend Mock Data:**
- **Data Layer**: Migrated from database-backed to frontend mock data service
- **Query Client**: Updated to use mock data functions instead of backend API calls
- **Backend Simplification**: Removed database connections, simplified API routes to compatibility stubs
- **React Query Integration**: Maintained full React Query functionality with simulated network delays
- **Platform Independence**: Each component maintains independent platform state for consistent UX
- **Mock Data Service**: Comprehensive service with realistic analytics data, KPIs, locations, campaigns, and enrichment suggestions

## V3 State (September 30, 2025)
**Location-Match Enhancements:**
- **Data Ratios**: Exact location counts maintained - 18 VenueX locations, 15 Platform locations (12 matched, 3 available for linking)
- **Step 3 Improvements**: Fixed manually linked locations display using correct data structure (unmatchedVenueXLocations with linkedPlatformPage)
- **Terminology Update**: All "Meta" and "Apple" references replaced with generic "Platform" terminology
- **Unmatched Platform Locations**: Added 3 platform locations without VenueX counterparts (Demo Test Location A, B, C)
- **Platform Location Management**: 
  - New accordion section in Step 3 shows unmatched platform locations with individual delete buttons
  - Unmatched platform locations available in Step 2 dropdowns for manual linking
  - When linked in Step 2, they are automatically removed from the unmatched platform locations list
  - Can be deleted from Step 3 if they remain unlinked

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript in strict mode
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Components**: Radix UI primitives wrapped with custom shadcn/ui components

## Backend Architecture
- **Framework**: Express.js with TypeScript running on Node.js
- **Module System**: ES modules throughout the entire application
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with tsx for development server

## Data Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL with Neon Database serverless
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Data Models**: Shared TypeScript schemas between frontend and backend
- **Storage Pattern**: Repository pattern with in-memory implementation for development

## Component Architecture
- **Design System**: shadcn/ui with consistent theming via CSS custom properties
- **Component Structure**: Atomic design with reusable UI components
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Charts**: Recharts library for data visualization
- **Loading States**: Skeleton components for improved perceived performance

## Development Workflow
- **Code Sharing**: Shared directory for types, schemas, and utilities
- **Type Safety**: Strict TypeScript configuration with path mapping
- **Development Tools**: Replit-specific plugins for enhanced development experience
- **Build Process**: Separate build processes for client (Vite) and server (esbuild)

# External Dependencies

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations and schema management

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Radix UI**: Headless UI components for accessibility
- **Lucide React**: Icon library for consistent iconography

## Data and State Management
- **TanStack Query**: Server state management and caching
- **React Hook Form**: Form handling with validation
- **Zod**: Runtime type validation and schema validation

## Charts and Visualization
- **Recharts**: React charting library built on D3
- **Date-fns**: Date manipulation and formatting utilities

## Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Static type checking
- **ESLint**: Code linting and formatting
- **Replit Plugins**: Development environment enhancements

## Runtime Environment
- **Node.js**: Server runtime with ES modules support
- **Express.js**: Web application framework
- **tsx**: TypeScript execution for development