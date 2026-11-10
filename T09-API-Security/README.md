# T09 – API Security | CampusEats

## 1. Project Overview

This project demonstrates API security using JWT (JSON Web Token) authentication and Role-Based Authorization in the CampusEats application.

The API allows authenticated users to view food items, while only authorized restaurant users can create and delete items.

## 2. Technologies Used

- Node.js
- Express.js
- JSON Web Token (JWT)
- bcryptjs
- dotenv
- REST API
- HTTP / JSON

## 3. Project Structure

```text
T09-API-Security/
│
├── config/
│   └── config.js
│
├── controllers/
│   └── authController.js
│
├── middleware/
│   ├── auth.js
│   └── authorize.js
│
├── models/
│   └── userModel.js
│
├── routes/
│   ├── authRoutes.js
│   └── itemRoutes.js
│
├── .env
├── .gitignore
├── README.md
└── server.js
```

## 4. Installation and Setup

Install the required dependencies from the parent project directory if they are not already installed:

```bash
npm install express jsonwebtoken bcryptjs dotenv
```

Create a `.env` file:

```env
PORT=3001
JWT_SECRET=your_strong_secret_key
```

Start the server:

```bash
node server.js
```

Server URL:

```text
http://localhost:3001
```

## 5. Demo User Credentials

| Email | Password | Role |
|---|---|---|
| asha@campus.edu | customer123 | customer |
| mealhub@campus.edu | resto123 | restaurant |

**Note:** These are demonstration credentials only.

## 6. API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/login` | Public | User login and JWT generation |
| GET | `/items` | Authenticated | Get all food items |
| GET | `/items/:id` | Authenticated | Get item by ID |
| POST | `/items` | Restaurant/Admin | Create a food item |
| DELETE | `/items/:id` | Restaurant/Admin | Delete a food item |

## 7. Security Implementation

### Password Hashing
Passwords are hashed using bcryptjs. During login, the submitted password is compared with the stored hash.

### JWT Authentication
After successful login, the server generates a JWT token containing the user ID and role.

### Authentication Middleware
The middleware verifies the Bearer token using `jwt.verify()` before allowing access to protected routes.

### Role-Based Authorization
The authorization middleware checks whether the authenticated user's role is permitted to perform the requested operation.

## 8. HTTP Status Codes

| Status Code | Meaning |
|---|---|
| 200 OK | Request successful |
| 201 Created | Resource successfully created |
| 204 No Content | Resource successfully deleted |
| 401 Unauthorized | Missing or invalid authentication token |
| 403 Forbidden | Authenticated user does not have permission |
| 404 Not Found | Requested item does not exist |
| 422 Unprocessable Entity | Invalid input data |

## 9. Testing Results

| Test Case | Expected Result | Actual Result |
|---|---|---|
| Access items without token | 401 Unauthorized | Passed |
| Customer login | 200 OK | Passed |
| Access items with valid token | 200 OK | Passed |
| Customer creates item | 403 Forbidden | Passed |
| Restaurant login | 200 OK | Passed |
| Restaurant creates item | 201 Created | Passed |
| Restaurant deletes item | 204 No Content | Passed |

## 10. Conclusion

This project demonstrates how to secure REST APIs using password hashing, JWT authentication, and role-based authorization.

It ensures that only authenticated users can access protected resources and that restricted operations are performed only by users with the required permissions.