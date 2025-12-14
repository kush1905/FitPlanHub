# FitPlanHub Frontend

A modern, responsive React frontend for FitPlanHub - a fitness planning web application.

## Features

- 🔐 JWT-based authentication
- 🎨 Modern UI with Tailwind CSS
- 📱 Fully responsive design
- 🛡️ Protected routes
- 🔄 Global state management with Context API
- ⚡ Fast builds with Vite

## Tech Stack

- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Context API

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file in the `client/` directory:
```
VITE_API_URL=http://localhost:5001/api
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── api/
│   └── axios.js          # Axios instance with interceptors
├── components/
│   ├── Navbar.jsx        # Navigation component
│   ├── ProtectedRoute.jsx # Route protection
│   └── Loader.jsx        # Loading component
├── context/
│   └── AuthContext.jsx   # Authentication context
├── pages/
│   ├── Home.jsx         # Landing page
│   ├── Login.jsx        # Login page
│   ├── Register.jsx     # Registration page
│   └── Dashboard.jsx    # User dashboard
├── utils/
│   └── formatters.js    # Utility functions
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## API Integration

The frontend is configured to communicate with the backend API at `http://localhost:5001/api`. Make sure the backend server is running before starting the frontend.

## Authentication Flow

1. User registers/logs in
2. JWT token is stored in localStorage
3. Token is automatically attached to all API requests via Axios interceptors
4. Protected routes check authentication status
5. Unauthorized users are redirected to login

