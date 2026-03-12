# ShopSphere

A full-stack e-commerce platform with real-time inventory, Stripe payments, and an admin dashboard. Built with React, Node.js, MongoDB, and Socket.io.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS v4, Framer Motion, Zustand
- **Backend**: Node.js, Express, MongoDB, Socket.io, Stripe API

## Features
- Real-time inventory updates
- Secure checkout with Stripe (INR support)
- Admin dashboard for product management
- JWT Authentication

## Setup
1. Clone the repo
2. Install dependencies:
   - `cd backend && npm install`
   - `cd frontend && npm install`
3. Configure `.env` in `backend/`
4. Seed products: `cd backend && npm run seed`
5. Run dev servers:
   - `cd backend && npm run dev`
   - `cd frontend && npm run dev`
