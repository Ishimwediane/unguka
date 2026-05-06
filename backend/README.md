# ⚙️ Unguka — Backend API

This directory contains the RESTful API for the **Unguka (Farmer Price Intelligence System)**. It is built using **NestJS** and **MongoDB** to serve as the core logic and data persistence layer for farmers, cooperatives, and NGOs.

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas) (with Mongoose)
- **Auth**: JWT (JSON Web Tokens) with `bcrypt` password hashing
- **Documentation**: [Swagger (OpenAPI 3.0)](https://swagger.io/)
- **ID System**: UUIDv7 (for sortable, unique identifiers)

## 📁 Directory Structure (under `api/`)

- `src/auth/` — Signup, Login, and Password management
- `src/farms/` — Farm CRUD (Ownership-scoped)
- `src/users/` — User management (Admin only)
- `src/organizations/` — Cooperatives & NGOs (Admin only)
- `src/schemas/` — Mongoose database schemas
- `src/common/` — Guards, Decorators, and Shared logic

## 🚀 Getting Started

1. **Move into the API directory**:
   ```bash
   cd api
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file based on `.env.example`:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Secret key for token signing
   - `PORT`: Default is 3000

4. **Run Development Server**:
   ```bash
   npm run start:dev
   ```

## 🧪 Testing the API

### 1. Swagger UI (Recommended)
The easiest way to test the API is through the built-in Swagger documentation.
- **URL**: `http://localhost:3000/docs` (Local) or `https://your-app.render.com/docs` (Production)
- **Usage**:
  1. Go to `POST /v1/auth/signup` to create a test user.
  2. Go to `POST /v1/auth/login` to get an `access_token`.
  3. Click the **Authorize** button at the top and paste the token.
  4. You can now call protected routes like `GET /v1/farms`.

### 2. Authentication Flow
- **Signup**: Use `POST /v1/auth/signup`. You must provide `phone_e164`, `password`, and `role` (farmer, coop_manager, or ngo_user).
- **Login**: Use `POST /v1/auth/login`. Returns a JWT token valid for 7 days.

### 3. Farm CRUD Rules
- **Farmers**: Can only see, update, and delete farms that belong to their own `user_id`.
- **Admins**: Can see and manage all farms in the system.
- **Soft Delete**: Deleting a farm sets an `archived_at` timestamp rather than removing the record from the database.

## 📜 API Conventions

- **Prefix**: All routes are prefixed with `/v1`.
- **Auth**: Protected routes require `Authorization: Bearer <token>`.
- **Naming**: Use `snake_case` for all JSON keys in requests and responses.
- **Quantities**: Farm sizes are handled as `numeric` (hectares).
