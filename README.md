# MindX Todo Web Application

A modern, scalable Todo application built with Node.js, Express, and MongoDB. This application demonstrates best practices for REST API development with authentication, CRUD operations, and Docker containerization.

## Features

- ✅ **Todo Management**: Create, read, update, and delete todos
- 🔐 **Authentication**: JWT-based user authentication
- 📦 **RESTful API**: Clean and intuitive REST endpoints
- 🗄️ **MongoDB Integration**: Persistent data storage with Mongoose ODM
- 🐳 **Docker Support**: Easy deployment with Docker containerization
- 📝 **Request Logging**: HTTP request tracking with Morgan
- 🔄 **Hot Reload**: Development with Nodemon for automatic restart
- 📋 **Status Tracking**: Mark todos as completed/incomplete
- ⏱️ **Timestamps**: Automatic creation and update timestamps

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.x
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Development Tools**: Nodemon, Morgan
- **Containerization**: Docker

## Project Structure

```
mindx-webapp-haitt01/
├── config/
│   └── db.js                 # MongoDB connection configuration
├── controllers/
│   └── todo.controller.js    # Todo business logic and handlers
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   └── Todo.model.js         # Mongoose Todo schema
├── routes/
│   ├── auth.route.js         # Authentication endpoints
│   └── todo.route.js         # Todo CRUD endpoints
├── appsettings.json          # Application configuration
├── Dockerfile                # Docker container definition
├── package.json              # Project dependencies
├── server.js                 # Express server entry point
└── README.md                 # Project documentation
```

## Installation

### Prerequisites

- Node.js 18 or higher
- MongoDB database (local or cloud)
- npm or yarn package manager

### Setup Instructions

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd mindx-webapp-haitt01
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:

   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   JWT_SECRET=your_secret_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the development server**

   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

## API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User

- **Endpoint**: `POST /auth/register`
- **Body**: `{ email, password }`
- **Response**: User object with JWT token

#### Login User

- **Endpoint**: `POST /auth/login`
- **Body**: `{ email, password }`
- **Response**: User object with JWT token

### Todo Endpoints

All todo endpoints require JWT authentication via `Authorization: Bearer <token>` header.

#### Create Todo

- **Endpoint**: `POST /todos`
- **Body**:
  ```json
  {
    "title": "Todo title",
    "description": "Todo description (optional)",
    "completed": false
  }
  ```
- **Response**: Created todo object with ID and timestamps

#### Get All Todos

- **Endpoint**: `GET /todos`
- **Query Parameters**:
  - `completed`: Filter by completion status (true/false)
- **Response**: Array of todo objects

#### Get Todo by ID

- **Endpoint**: `GET /todos/:id`
- **Response**: Single todo object

#### Update Todo

- **Endpoint**: `PUT /todos/:id`
- **Body**: Partial or complete todo object
  ```json
  {
    "title": "Updated title",
    "completed": true
  }
  ```
- **Response**: Updated todo object

#### Delete Todo

- **Endpoint**: `DELETE /todos/:id`
- **Response**: Success message

#### Delete All Todos

- **Endpoint**: `DELETE /todos`
- **Response**: Success message

## Running with Docker

### Build Docker Image

```bash
docker build -t mindx-todo-app:1.0.0 .
```

### Run Docker Container

```bash
docker run -p 3000:3000 \
  -e MONGO_URI=<your_mongodb_uri> \
  -e JWT_SECRET=<your_secret_key> \
  mindx-todo-app:1.0.0
```

## Development

### Run with Nodemon (Auto-reload)

```bash
npm start
```

### Scripts

- `npm start` - Start the development server with auto-reload
- `npm test` - Run tests (currently not configured)

## Database Schema

### Todo Model

```javascript
{
  title: String (required),
  description: String (optional),
  completed: Boolean (default: false),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

## Error Handling

The application implements comprehensive error handling:

- **400 Bad Request**: Missing or invalid request data
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server-side errors

All errors return a JSON response with status and message fields.

## Security

- JWT tokens for secure authentication
- Password hashing (implement bcrypt in production)
- CORS support (can be configured)
- Input validation
- Environment variable protection for sensitive data

## Environment Variables

| Variable     | Description                | Example                                          |
| ------------ | -------------------------- | ------------------------------------------------ |
| `MONGO_URI`  | MongoDB connection string  | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `JWT_SECRET` | Secret key for JWT signing | `super_secret_key_123`                           |
| `PORT`       | Server port                | `3000`                                           |
| `NODE_ENV`   | Environment mode           | `development` or `production`                    |

## Testing

To test the API endpoints:

### Using cURL

```bash
# Create a todo
curl -X POST http://localhost:3000/api/todos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"My First Todo","description":"Test description"}'

# Get all todos
curl -X GET http://localhost:3000/api/todos \
  -H "Authorization: Bearer <token>"
```

### Using Postman

1. Import the API endpoints into Postman
2. Set the Authorization header with your JWT token
3. Test each endpoint

## Contributing

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## Version History

### v1.0.0 (Initial Release)

- Core todo CRUD operations
- JWT authentication
- MongoDB integration
- Docker support
- Comprehensive REST API

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Author

MindX Week 1 - Interview Challenge

## Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Last Updated**: December 2024
