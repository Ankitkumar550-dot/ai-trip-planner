# AI Trip Planner (MERN Stack)

This project has been migrated from Next.js + Convex to a traditional MERN stack (MongoDB, Express, React, Node.js).

## Project Structure

- **`backend/`**: Express.js server with MongoDB integration (Mongoose).
- **`frontend/`**: React application built with Vite and Tailwind CSS.
- **`legacy-nextjs/`**: Contains the original Next.js and Convex codebase for reference.

## Getting Started

### Prerequisites
- Node.js installed.
- MongoDB running locally or a MongoDB Atlas URI.

### Installation
From the root directory, run:
```bash
npm run install:all
```
This will install dependencies for the root, backend, and frontend.

### Development
To start both the backend and frontend concurrently:
```bash
npm run dev
```

### Environment Variables

#### Backend (`backend/.env`)
- `PORT`: Server port (default 5000)
- `MONGODB_URI`: Your MongoDB connection string
- `CLERK_SECRET_KEY`: Clerk secret key
- `OPENAI_API_KEY`: OpenAI or OpenRouter API key
- `ARCJET_KEY`: Arcjet security key

#### Frontend (`frontend/.env`)
- `VITE_BACKEND_URL`: URL of the backend API (e.g., http://localhost:5000)
- `VITE_CLERK_PUBLISHABLE_KEY`: Clerk publishable key

## Features
- AI-driven trip planning with interactive chat.
- Personalized itineraries with hotel and activity recommendations.
- User authentication via Clerk.
- Trip saving and history management with MongoDB.
- Premium UI with glassmorphism and smooth animations.
