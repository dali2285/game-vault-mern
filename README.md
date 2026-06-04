# Game Store App

A full-stack game store application built with a React + Redux frontend and an Express + MongoDB backend.

## 📌 Project Overview

This project is a games marketplace where users can browse games, add items to a cart, place orders, leave reviews, and manage profiles. It also includes admin pages for managing games, users, and orders.

## 🚀 Tech Stack

- Frontend: React, Redux, React Router, Vite
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT-based auth
- Styling: CSS

## ✨ Features

- User registration and login
- Product listing and game detail pages
- Shopping cart workflow
- Checkout and order history
- Review submission for games
- User profile management
- Admin dashboard with game, order, and user management
- Seed data for demo users and games

## 🧭 Repository Structure

- `backend/` - Express API server
  - `controllers/` - request handlers
  - `middleware/` - auth middleware
  - `models/` - Mongoose schemas
  - `routes/` - API route definitions
  - `server.js` - backend entry point
  - `seed.js` - database seeder

- `frontend/` - React application
  - `src/` - React app sources
  - `redux/` - Redux store, actions, reducers
  - `pages/` - page components
  - `components/` - shared UI components

## 🛠️ Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or accessible remotely

## 🔧 Setup Instructions

### 1. Backend Setup

```bash
cd "Game Store App/backend"
npm install
```

Create a `.env` file in `backend/` with these variables:

```env
MONGO_URI=mongodb://localhost:27017/gamestore
PORT=5000
```

If you use a remote MongoDB instance, replace `MONGO_URI` with your connection string.

### 2. Frontend Setup

```bash
cd "Game Store App/frontend"
npm install
```

## ▶️ Run the Application

### Start the backend server

```bash
cd "Game Store App/backend"
npm run dev
```

The backend will run on `http://localhost:5000` by default.

### Start the frontend app

```bash
cd "Game Store App/frontend"
npm run dev
```

The frontend will run on `http://localhost:5173` by default.

## 🌱 Seed the Database

To populate demo data (games, admin user, demo user), run:

```bash
cd "Game Store App/backend"
npm run seed
```

### Demo credentials

- Admin
  - Email: `admin@gamestore.com`
  - Password: `admin123`
- Demo user
  - Email: `user@gamestore.com`
  - Password: `user123`

## 📌 Backend Scripts

- `npm start` - Run the backend server
- `npm run dev` - Run the backend server with nodemon
- `npm run seed` - Seed the MongoDB database with demo data

## 📌 Frontend Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build production frontend assets
- `npm run preview` - Preview the built frontend

## 🔗 API Overview

The backend exposes the following routes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/games`
- `GET /api/games/:id`
- `POST /api/cart`
- `GET /api/cart`
- `POST /api/orders`
- `GET /api/orders`
- `POST /api/reviews`
- `GET /api/users`

> The app uses `http://localhost:5173` as the allowed frontend origin in CORS.

## 💡 Notes

- Ensure MongoDB is running before starting the backend.
- Use the seeded admin account to access admin pages.
- Update the `.env` file if you want to change the port or database connection.

## 📄 License

This project does not include a license file. Add one if you want to open source the code.
