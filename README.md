# Game Store App

A full-stack game storefront built with a React + Redux frontend and an Express + MongoDB backend. This app allows users to browse games, manage a shopping cart, place orders, write reviews, and view a personal library. It also includes admin pages for managing games, orders, and users.

## 🚀 Tech Stack

- Frontend: React, Redux, React Router, Vite
- Backend: Node.js, Express, MongoDB, Mongoose
- Authentication: JWT
- Styling: CSS

## ✨ Features

- User signup, login, and profile management
- Browse games, search, and view detailed game pages
- Add games to cart and complete checkout
- Order history and purchase library
- Review games after purchase
- Admin dashboard for game, order, and user management
- Image upload support for game assets
- Seed script for demo data setup

## 📁 Repository Structure

- `backend/`
  - `controllers/` — request handlers for auth, games, cart, orders, reviews, and users
  - `middleware/` — authentication and upload middleware
  - `models/` — Mongoose schemas for Game, Order, and User
  - `routes/` — Express API routes
  - `server.js` — backend entry point
  - `seed.js` — demo data seeder
- `frontend/`
  - `src/` — React application source files
  - `redux/` — store, actions, reducers, and constants
  - `pages/` — app pages including admin screens
  - `components/` — reusable UI components

## 🛠 Prerequisites

- Node.js 18 or newer
- npm
- MongoDB running locally or accessible remotely

## ⚙️ Setup

### Backend

```bash
cd "Game Store App/backend"
npm install
```

Create a `.env` file in `backend/` with:

```env
MONGO_URI=mongodb://localhost:27017/gamestore
PORT=5000
JWT_SECRET=your_jwt_secret
```

If you use a remote MongoDB instance, replace `MONGO_URI` accordingly.

### Frontend

```bash
cd "Game Store App/frontend"
npm install
```

## ▶️ Running the App

### Start backend

```bash
cd "Game Store App/backend"
npm run dev
```

### Start frontend

```bash
cd "Game Store App/frontend"
npm run dev
```

The frontend defaults to `http://localhost:5173` and the backend defaults to `http://localhost:5000`.

## 🌱 Seed Demo Data

Populate the database with demo users and games:

```bash
cd "Game Store App/backend"
npm run seed
```

### Demo credentials

- Admin
  - Email: `admin@gamestore.com`
  - Password: `admin123`
- Demo User
  - Email: `user@gamestore.com`
  - Password: `user123`

## 📦 NPM Scripts

### Backend

- `npm start` — Run backend server
- `npm run dev` — Run backend server with nodemon
- `npm run seed` — Seed the database

### Frontend

- `npm run dev` — Start Vite development server
- `npm run build` — Build production assets
- `npm run preview` — Preview built frontend

## 🔗 API Endpoints

Common backend routes include:

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

## 💡 Notes

- Start MongoDB before launching the backend.
- Use seeded admin credentials to access admin pages.
- Add or update environment values in `backend/.env` if ports or database settings change.

## 📄 License

This repository does not include a license. Add one if you plan to share it publicly.
