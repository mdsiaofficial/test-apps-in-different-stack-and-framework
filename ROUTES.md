# Shared API Contract (identical across all apps)

Base URL: http://localhost:<port>

## Endpoints (20)

1. GET    /health
   -> { "status": "ok" }

2. GET    /api/users
   -> list users

3. GET    /api/users/:id
   -> single user or 404

4. POST   /api/users
   body: { "name": string, "email": string }
   -> created user

5. PUT    /api/users/:id
   body: { "name": string, "email": string }
   -> updated user

6. DELETE /api/users/:id
   -> { "deleted": true }

7. GET    /api/categories
   -> list categories

8. GET    /api/categories/:id
   -> single category

9. POST   /api/categories
   body: { "name": string, "description": string }
   -> created category

10. GET   /api/products
    -> list products

11. GET   /api/products/:id
    -> single product

12. POST  /api/products
    body: { "name": string, "price": number, "category_id": number }
    -> created product

13. PUT   /api/products/:id
    body: { "name": string, "price": number, "category_id": number }
    -> updated product

14. DELETE /api/products/:id
    -> { "deleted": true }

15. GET   /api/orders
    -> list orders

16. GET   /api/orders/:id
    -> single order

17. POST  /api/orders
    body: { "user_id": number, "status": string, "total": number }
    -> created order

18. GET   /api/orders/:id/items
    -> list order_items for order

19. GET   /api/stats/summary
    -> { "users": n, "products": n, "orders": n, "revenue": number }

20. GET   /api/search?q=term
    -> products matching name (ILIKE)

## Database
Env: DATABASE_URL=postgres://app:app@localhost:5432/appdb
Tables: users, categories, products, orders, order_items
