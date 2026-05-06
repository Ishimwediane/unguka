# ⚙️ Unguka — Backend API

This directory contains the RESTful API for the **Unguka (Farmer Price Intelligence System)**. It is built using **NestJS** and **MongoDB** to serve as the core logic and data persistence layer for farmers, cooperatives, and NGOs.

## 🚀 Live Environment
- **Production API URL**: `https://unguka-2ygk.onrender.com/v1`
- **Interactive Documentation (Swagger)**: `https://unguka-2ygk.onrender.com/docs`

---

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/) (Node.js)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Auth**: JWT (JSON Web Tokens) with `bcrypt`
- **Documentation**: Swagger (OpenAPI 3.0)
- **ID System**: UUIDv7 (Sortable & unique)

---

## 💻 Frontend Integration Guide

### 1. Authentication Flow
All requests to protected routes must include the Bearer token in the header:
`Authorization: Bearer <your_jwt_token>`

#### **Sign Up**
`POST /v1/auth/signup`
```json
{
  "phone_e164": "+250780000000",
  "password": "securePassword123",
  "role": "farmer", // farmer, coop_manager, or ngo_user
  "full_name": "John Doe",
  "language": "rw", // rw, en, or fr
  "district": "Gasabo",
  "sector": "Bumbogo",
  "gps_lat": -1.9441, // Optional
  "gps_lng": 30.0619  // Optional
}
```

#### **Log In**
`POST /v1/auth/login`
```json
{
  "phone_e164": "+250780000000",
  "password": "securePassword123"
}
```
**Response:** Returns an `access_token` and the `user` object.

---

### 2. Farm Management (CRUD)

#### **Create a Farm**
`POST /v1/farms`
```json
{
  "name": "Bumbogo Maize Plot",
  "size_ha": 1.5,
  "district": "Gasabo",
  "sector": "Bumbogo",
  "gps_lat": -1.9441,
  "gps_lng": 30.0619
}
```

#### **Get My Farms**
`GET /v1/farms`
- **Farmer**: Returns only their own farms.
- **Admin**: Returns all farms in the system.

#### **Update a Farm**
`PATCH /v1/farms/:id`
```json
{
  "name": "Updated Farm Name",
  "size_ha": 2.0
}
```

#### **Delete a Farm (Soft Delete)**
`DELETE /v1/farms/:id`
*Note: This does not erase the record; it sets an `archived_at` timestamp.*

---

## 🧪 Testing instructions

### Swagger UI
Go to `https://unguka-2ygk.onrender.com/docs` to test every endpoint directly from your browser. 
1. Use `/auth/signup` to create a user.
2. Use `/auth/login` to get a token.
3. Click **Authorize** at the top and paste your token.
4. Try the `/farms` endpoints!

---

## 🚀 Local Development

1. `cd api`
2. `npm install`
3. Create `.env` (Copy from `.env.example`)
4. `npm run start:dev`

## 📜 API Conventions
- **Prefix**: `/v1`
- **Naming**: `snake_case` for all JSON keys.
- **Errors**: Standard NestJS error format:
```json
{
  "statusCode": 400,
  "message": ["phone_e164 must be a valid phone number"],
  "error": "Bad Request"
}
```
