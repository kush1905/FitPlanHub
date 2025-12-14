# FitPlanHub Backend

A production-ready backend for FitPlanHub - a fitness subscription platform connecting trainers and users.

## Features

- **Authentication**: JWT-based authentication with role-based access control
- **User Roles**: Trainer and User roles with different permissions
- **Plans**: Trainers can create, update, and delete fitness plans
- **Subscriptions**: Users can subscribe to plans
- **Following**: Users can follow/unfollow trainers
- **Personalized Feed**: Users get a feed of plans from followed trainers

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs for password hashing

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env .env.local
# Edit .env.local with your MongoDB URI and JWT secret
```

3. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Environment Variables

Create a `.env` file with:

```
MONGODB_URI=mongodb://localhost:27017/fitplanhub
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user

### Plans
- `GET /api/plans` - Get all plans (preview for non-subscribers)
- `GET /api/plans/:id` - Get plan details
- `POST /api/plans` - Create plan (Trainer only)
- `PUT /api/plans/:id` - Update plan (Trainer only, own plans)
- `DELETE /api/plans/:id` - Delete plan (Trainer only, own plans)
- `GET /api/trainer/plans` - Get trainer's plans (Trainer only)
- `POST /api/plans/:id/subscribe` - Subscribe to plan (User only)

### Users
- `POST /api/users/trainers/:id/follow` - Follow trainer (User only)
- `POST /api/users/trainers/:id/unfollow` - Unfollow trainer (User only)
- `GET /api/users/following` - Get following list (User only)

### Feed
- `GET /api/feed` - Get personalized feed (User only)

## Testing with Postman

1. Start the server
2. Use Postman to test endpoints
3. For protected routes, include JWT token in Authorization header:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Project Structure

```
server/
├── config/
│   └── db.js
├── models/
│   ├── User.js
│   └── Plan.js
├── controllers/
│   ├── authController.js
│   ├── planController.js
│   ├── userController.js
│   └── feedController.js
├── routes/
│   ├── authRoutes.js
│   ├── planRoutes.js
│   ├── userRoutes.js
│   └── feedRoutes.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── utils/
│   └── generateToken.js
├── app.js
└── server.js
```

