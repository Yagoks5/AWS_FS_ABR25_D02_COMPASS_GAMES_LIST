# 🎮 COMPASS Games List

A comprehensive game tracking application that allows users to manage their video game collection, categorize games, track progress, and organize gaming platforms.

## 📝 Description

COMPASS Games List is a full-stack web application designed for gamers who want to maintain an organized digital catalog of their video game collection. The application helps users track their gaming progress, categorize games, and manage their gaming platforms - providing insights into their gaming habits and collection.

## ✨ Features & Functionalities

### User Management

- User registration and authentication
- Secure login with JWT authentication
- User profile management

### Game Management

- Add, edit, and delete games
- Track game status (Playing, Done, Abandoned)
- Mark games as favorites
- Record acquisition and completion dates
- Add game descriptions and cover images

### Categories Management

- Create custom game categories
- Organize games by category
- Filter games by category

### Platform Management

- Track gaming platforms (consoles, PC, etc.)
- Record platform details (company, acquisition year)
- Organize games by platform

### Dashboard

- View game statistics and insights
- Track gaming progress across platforms
- See recent activity

## 🛠️ Technologies Used

### Backend

- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **TypeScript** - Strongly typed programming language
- **Prisma** - Next-generation ORM for Node.js and TypeScript
- **SQLite** - Lightweight database
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

### Frontend

- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router v7** - Routing
- **React Query (TanStack Query)** - Data fetching and state management
- **Vite** - Next-generation frontend tooling
- **React Toastify** - Toast notifications
- **React Icons** - Icon library
- **Axios** - HTTP client

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following content:

   ```
   PORT=3000
   JWT_SECRET=your_jwt_secret_key
   ```

4. Generate Prisma client:

   ```bash
   npx prisma generate
   ```

5. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

6. Start the development server:

   ```bash
   npm run dev
   ```

   The backend API will be available at `http://localhost:3000`.

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:

   ```
   VITE_API_URL=http://localhost:3000
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

   The frontend application will be available at `http://localhost:5173`.

## 📊 Database Schema

The application uses the following data models:

- **User**: Stores user account information
- **Game**: Tracks individual games with status, dates, and relationships
- **Category**: Organizes games into custom categories
- **Platform**: Tracks gaming platforms with details

## 🔄 API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Log in a user

### User

- `GET /user` - Get current user profile
- `PUT /user` - Update user profile

### Games

- `GET /games` - Get all games for current user
- `POST /games` - Add a new game
- `PUT /games/:id` - Update a game
- `DELETE /games/:id` - Delete a game

### Categories

- `GET /categories` - Get all categories for current user
- `POST /categories` - Add a new category
- `PUT /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

### Platforms

- `GET /platforms` - Get all platforms for current user
- `POST /platforms` - Add a new platform
- `PUT /platforms/:id` - Update a platform
- `DELETE /platforms/:id` - Delete a platform

### Dashboard

- `GET /dashboard` - Get dashboard statistics

## 🧪 Running Tests

_Currently in development_

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

COMPASS UOL - AWS Full Stack Development Program
