# Bookstore API (Node.js + Express)

Simple Express API with in-memory data for books, categories, authors, users, orders, and admin endpoints.

## Setup

1. Install dependencies:

```
npm install
```

2. Create `.env` from example:

```
cp .env.example .env
```

3. Start the server:

```
npm run dev
```

Server will run on `http://localhost:5000` by default.

## Authentication

- JWT-based auth. Get a token via `POST /api/users/login`.
- Default admin user: `admin@example.com` / `admin123`.

## Routes

- GET `/api/books` — List all books
- GET `/api/books/:id` — Get single book
- POST `/api/books` — Create book (admin)
- PUT `/api/books/:id` — Update book (admin)
- DELETE `/api/books/:id` — Delete book (admin)
- GET `/api/books/:id/reviews` — Get book reviews
- POST `/api/books/:id/reviews` — Create review (auth)

- GET `/api/categories` — List all categories
- GET `/api/categories/:id/books` — Books by category

- GET `/api/authors` — List all authors
- GET `/api/authors/:id/books` — Books by author

- POST `/api/users/login` — User login
- POST `/api/users` — Register user
- GET `/api/users/profile` — Get user profile (auth)
- PUT `/api/users/profile` — Update profile (auth)

- POST `/api/orders` — Create new order (auth)
- GET `/api/orders/:id` — Get order by ID (auth or admin)
- GET `/api/orders/myorders` — Get logged in user's orders (auth)

- GET `/api/admin/orders` — All orders (admin)
- PUT `/api/admin/orders/:id/deliver` — Mark as delivered (admin)
- GET `/api/admin/users` — All users (admin)

Note: This implementation uses in-memory storage for simplicity. Use a database for production. 
