# MediaShelf: Cataloging Social App

A modern web application for tracking and sharing your media consumption - books, movies, games, and more. This platform allows users to catalog their media collection, track progress, rate items, follow other users, and see activity in a social feed.

## Features

- **User Authentication**: Secure sign-up and login functionality
- **Media Catalog**: Track books, movies, games, and other media types
- **Progress Tracking**: Record your progress through different media
- **Rating System**: Rate and review your media collection
- **Social Features**: Follow other users and see their activity
- **Activity Feed**: View a personalized feed of activity from people you follow
- **Search**: Find media and users across the platform
- **Responsive UI**: Modern, responsive interface built with Next.js and Tailwind CSS

## Tech Stack

- **Frontend**:
  - [Next.js 15](https://nextjs.org/) with App Router
  - [React 19](https://react.dev/)
  - [Tailwind CSS](https://tailwindcss.com/) for styling
  - [shadcn/ui](https://ui.shadcn.com/) (via Radix UI components)
  - [Lucide React](https://lucide.dev/) for icons
  - [React Hook Form](https://react-hook-form.com/) with Zod for form validation

- **Backend**:
  - [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/forms-and-mutations) for API functionality
  - [Better Auth](https://better-auth.dev/) for authentication
  - [Drizzle ORM](https://orm.drizzle.team/) for database interactions
  - [Neon PostgreSQL](https://neon.tech/) as the database provider
  - [Redis](https://redis.io/) via [ioredis](https://github.com/redis/ioredis) for:
    - Social activity feed storage and distribution
    - Follow/follower relationship caching
    - User activity tracking
    - Real-time feed updates with fan-out architecture
    - Performance optimization with TTL-based expiry

## Getting Started

### Prerequisites

- Node.js 19+ 
- npm or yarn
- Redis (for local development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/catalog-app.git
   cd catalog-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure environment variables:
   - Create a `.env` file in the root directory with required variables (see `.env.example` for reference)
   - Set your Redis connection string in the `UPSTASH_REDIS_REST_URL` environment variable

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Database Schema

The application uses a PostgreSQL database with the following main tables:
- `user` - User accounts and profiles
- `media` - Media items (books, movies, games)
- `user_media` - User collection items with status, rating, notes
- `follows` - User follow relationships
- `session` - Authentication sessions

## Redis Data Model

The application leverages Redis for high-performance social features:
- Sorted sets for time-ordered activity feeds
- Sets for storing follower/following relationships
- Hash maps for activity data with TTL expiration
- Pipelining for efficient multi-key operations
- Fan-out architecture for distributing activities to follower feeds
