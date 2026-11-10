# T09 – API Security
## Step-by-Step Implementation and Testing Guide

**Project:** CampusEats – Catalogue API  
**Port:** 3001  
**Technologies:** Node.js, Express.js, JWT, bcryptjs, dotenv

---

# 1. Introduction

The objective of this practical is to secure REST APIs using:

1. Password Hashing using bcryptjs.
2. JWT (JSON Web Token) Authentication.
3. Authentication Middleware.
4. Role-Based Authorization.
5. Protected REST API Endpoints.

In this implementation, two types of users are available:

- Customer
- Restaurant

Customers can view food items, whereas restaurants can view, create and delete food items.

# 2. Project Structure

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

# 3. Start the Server

Navigate to the project directory:

```bash
cd ~/catalogue/T09-API-Security
```

Start the server:

```bash
node server.js
```

Expected output:

```text
◇ injected env (2) from .env
Secured Catalogue running on http://localhost:3001
```

The API server is now running on port 3001.

**Important:** Keep this terminal open. Use another terminal for API testing.

# 4. Test Authentication Without a Token

First, try accessing the protected API without providing an authentication token.

Command:

```bash
curl -i http://localhost:3001/items
```

Expected response:

```http
HTTP/1.1 401 Unauthorized
Content-Type: application/json
```

```json
{
  "error": "Missing or invalid token"
}
```

### Explanation

The `/items` endpoint is protected by JWT authentication middleware.

Since no token is provided, the middleware rejects the request.

**HTTP 401 Unauthorized:** Authentication is missing or invalid.

# 5. Customer Login – Generate JWT Token

Now authenticate as a customer.

Demo credentials:

```text
Email: asha@campus.edu
Password: customer123
Role: customer
```

Command:

```bash
curl -i -X POST http://localhost:3001/login \
-H "Content-Type: application/json" \
-d '{"email":"asha@campus.edu","password":"customer123"}'
```

Expected response:

```http
HTTP/1.1 200 OK
```

```json
{
  "token": "JWT_TOKEN"
}
```

### Explanation

1. The client sends email and password.
2. The server searches for the user.
3. bcryptjs compares the entered password with the stored password hash.
4. If credentials are valid, the server generates a JWT.
5. The JWT contains the user ID and role.

Example JWT payload:

```json
{
  "sub": 1,
  "role": "customer"
}
```

The token is valid for one hour.

# 6. Access Protected API Using JWT

After successful login, generate and store the customer token in a shell variable.

Command:

```bash
TOKEN=$(curl -s -X POST http://localhost:3001/login \
-H "Content-Type: application/json" \
-d '{"email":"asha@campus.edu","password":"customer123"}' \
| node -pe "JSON.parse(require('fs').readFileSync(0, 'utf8')).token")
```

Now access the protected endpoint:

```bash
curl -i http://localhost:3001/items \
-H "Authorization: Bearer $TOKEN"
```

Expected response:

```http
HTTP/1.1 200 OK
```

```json
[
  {
    "id": 1,
    "name": "Veg Thali",
    "price": 90,
    "veg": true
  },
  {
    "id": 2,
    "name": "Paneer Roll",
    "price": 70,
    "veg": true
  },
  {
    "id": 3,
    "name": "Chicken Burger",
    "price": 120,
    "veg": false
  },
  {
    "id": 4,
    "name": "Masala Dosa",
    "price": 60,
    "veg": true
  }
]
```

### Explanation

The client sends the JWT token in the Authorization header.

```text
Authorization: Bearer <JWT_TOKEN>
```

The authentication middleware verifies the token.

If the token is valid, the request is allowed to continue.

# 7. Test Role-Based Authorization – Customer

Now check whether a customer can create a food item.

Command:

```bash
curl -i -X POST http://localhost:3001/items \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{"name":"Cheese Pizza","price":150,"veg":true}'
```

Expected response:

```http
HTTP/1.1 403 Forbidden
```

```json
{
  "error": "Forbidden: You do not have permission"
}
```

### Explanation

The customer is authenticated, but the customer role does not have permission to create food items.

The authorization middleware allows only:

- restaurant
- admin

Therefore, the request is rejected.

**HTTP 403 Forbidden:** The user is authenticated but does not have sufficient permission.

# 8. Restaurant Login

Now authenticate using restaurant credentials.

Demo credentials:

```text
Email: mealhub@campus.edu
Password: resto123
Role: restaurant
```

Generate a restaurant token:

```bash
TOKEN=$(curl -s -X POST http://localhost:3001/login \
-H "Content-Type: application/json" \
-d '{"email":"mealhub@campus.edu","password":"resto123"}' \
| node -pe "JSON.parse(require('fs').readFileSync(0, 'utf8')).token")
```

Check the token:

```bash
echo "$TOKEN"
```

A JWT token will be displayed.

Example decoded payload:

```json
{
  "sub": 2,
  "role": "restaurant"
}
```

# 9. Create a Food Item – Restaurant

Now try creating a food item using the restaurant token.

Command:

```bash
curl -i -X POST http://localhost:3001/items \
-H "Content-Type: application/json" \
-H "Authorization: Bearer $TOKEN" \
-d '{"name":"Cheese Pizza","price":150,"veg":true}'
```

Expected response:

```http
HTTP/1.1 201 Created
```

```json
{
  "id": 5,
  "name": "Cheese Pizza",
  "price": 150,
  "veg": true
}
```

### Explanation

1. The restaurant sends a POST request.
2. The JWT authentication middleware verifies the token.
3. The authorization middleware checks the user's role.
4. Since the role is restaurant, permission is granted.
5. The new food item is created.

**HTTP 201 Created:** A new resource has been successfully created.

# 10. Delete a Food Item – Restaurant

Now delete the newly created food item.

Command:

```bash
curl -i -X DELETE http://localhost:3001/items/5 \
-H "Authorization: Bearer $TOKEN"
```

Expected response:

```http
HTTP/1.1 204 No Content
```

### Explanation

1. The restaurant sends a DELETE request.
2. The authentication middleware verifies the JWT.
3. The authorization middleware checks the restaurant role.
4. The server finds the item using its ID.
5. The item is deleted successfully.

**HTTP 204 No Content:** The request was successful, but the response does not contain a body.

# 11. Final Authentication Verification

Finally, try accessing the items endpoint without a token again.

Command:

```bash
curl -i http://localhost:3001/items
```

Expected response:

```http
HTTP/1.1 401 Unauthorized
```

```json
{
  "error": "Missing or invalid token"
}
```

This confirms that the protected API does not allow unauthenticated access.

# 12. Final Testing Results

| Test Case | Expected Status | Actual Status | Result |
|---|---|---|---|
| Access items without token | 401 | 401 | PASS |
| Customer login | 200 | 200 | PASS |
| Customer accesses items | 200 | 200 | PASS |
| Customer creates item | 403 | 403 | PASS |
| Restaurant login | 200 | 200 | PASS |
| Restaurant creates item | 201 | 201 | PASS |
| Restaurant deletes item | 204 | 204 | PASS |
| Access items without token again | 401 | 401 | PASS |

# 13. Important Security Concepts

### Authentication
Authentication verifies the identity of a user.

Example: Login using email and password.

### Authorization
Authorization determines what an authenticated user is allowed to do.

Example: Only restaurant users can create food items.

### JWT
JSON Web Token is used to securely transmit identity and role claims between the client and server.

### bcryptjs
Used for password hashing and password verification.

### Middleware
Middleware functions execute during the request-response cycle.

In this project:
- `auth.js` verifies JWT tokens.
- `authorize.js` checks user roles.

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created |
| 204 | No Content |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Unprocessable Entity |

# 14. Conclusion

In this practical, REST APIs were secured using JWT authentication and role-based authorization.

Password hashing was implemented using bcryptjs. JWT tokens were generated during login and verified through authentication middleware.

Role-based authorization was used to restrict create and delete operations to restaurant and admin users.

All the API test cases were successfully executed using curl commands.

The implementation demonstrates how authentication and authorization improve the security of REST APIs.
