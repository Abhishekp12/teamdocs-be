# TeamDocs Backend API

A RESTful backend for task management and document uploads, built with Node.js, Express.js, and MongoDB. The project includes JWT authentication, role-based access control (RBAC), task CRUD operations, request validation, pagination, and document upload functionality.

## Features

- User registration and login using bcrypt password hashing.
- JWT-based authentication with Bearer tokens.
- Role-based task access for Admin, Manager, and Employee.
- Task creation, retrieval, updating, and deletion.
- Task ownership checks to prevent unauthorized access.
- Request validation using Express Validator.
- Centralized error handling with consistent JSON responses.
- Pagination for task listing, including total counts.
- Document uploads using Multer, with file size and type restrictions.
- MongoDB integration using Mongoose.
- Security middleware using Helmet, CORS, and rate limiting.
- HTTP response compression and cookie parsing.

## Tech Stack

- **Runtime:** Node.js
- **Backend:** Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **File Uploads:** Multer
- **Security:** Helmet, CORS, express-rate-limit
- **API Testing:** Postman

## Project Structure

```text
teamdocs-be/
├── src/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── task.controller.js
│   │   └── document.controller.js
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── rate-limit.middleware.js
│   │   ├── task-access.middleware.js
│   │   ├── upload.middleware.js
│   │   └── validate.middleware.js
│   ├── models/
│   │   ├── user.js
│   │   ├── task.js
│   │   └── document.js
│   ├── repositories/
│   │   ├── task.repository.js
│   │   └── document.repository.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── task.routes.js
│   │   └── document.routes.js
│   ├── services/
│   │   ├── user.service.js
│   │   ├── task.service.js
│   │   └── document.service.js
│   ├── validators/
│   │   └── task.validator.js
│   ├── app.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── package-lock.json
```

## Getting Started

### Prerequisites

- Node.js and npm
- MongoDB, either locally or through MongoDB Atlas
- Postman for API testing

### 1. Clone the repository

```bash
git clone https://github.com/Abhishekp12/teamdocs-be.git
cd teamdocs-be
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```dotenv
PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_strong_random_secret
JWT_EXPIRES_IN=24h
CLIENT_URL=http://localhost:5173
```

Replace the placeholder values with your own configuration.

**Security:** Never commit `.env` or share database credentials, JWT secrets, passwords, or access tokens. Configure environment variables separately in your deployment provider.

### 4. Start the development server

```bash
npm run dev
```

### 5. Start the production server locally

```bash
npm start
```

The local API base URL is:

```text
http://localhost:5000/api/v1
```

## API Endpoints

### Health Check

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| GET | `/health` | Check API availability | Not required |

### Authentication

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/auth/register` | Register a new user | Not required |
| POST | `/auth/login` | Log in and receive an access token | Not required |

### Tasks

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/tasks` | Create a task | Required |
| GET | `/tasks` | List permitted tasks with pagination | Required |
| GET | `/tasks/:id` | Retrieve a task | Required |
| PATCH | `/tasks/:id` | Update a task | Required |
| DELETE | `/tasks/:id` | Delete a task | Required |

### Documents

| Method | Endpoint | Description | Authentication |
|---|---|---|---|
| POST | `/tasks/:taskId/documents` | Upload a document to an accessible task | Required |
| GET | `/tasks/:taskId/documents` | List documents attached to an accessible task | Required |

The document endpoints currently cover upload and listing. Download and delete document endpoints are planned extensions.

## Authentication

After logging in, use
