package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
	"go-echo/internal/models"
)

type Repo struct {
	Pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *Repo {
	return &Repo{Pool: pool}
}

// Users
func (r *Repo) ListUsers(ctx context.Context) ([]models.User, error) {
	rows, err := r.Pool.Query(ctx, "SELECT id, name, email, created_at FROM users ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.User
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, u)
	}
	if out == nil {
		out = []models.User{}
	}
	return out, rows.Err()
}

func (r *Repo) GetUser(ctx context.Context, id int) (models.User, error) {
	var u models.User
	err := r.Pool.QueryRow(ctx, "SELECT id, name, email, created_at FROM users WHERE id=$1", id).Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt)
	return u, err
}

func (r *Repo) CreateUser(ctx context.Context, name, email string) (models.User, error) {
	var u models.User
	err := r.Pool.QueryRow(ctx, "INSERT INTO users (name, email) VALUES ($1,$2) RETURNING id, name, email, created_at", name, email).Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt)
	return u, err
}

func (r *Repo) UpdateUser(ctx context.Context, id int, name, email string) (models.User, error) {
	var u models.User
	err := r.Pool.QueryRow(ctx, "UPDATE users SET name=$1, email=$2 WHERE id=$3 RETURNING id, name, email, created_at", name, email, id).Scan(&u.ID, &u.Name, &u.Email, &u.CreatedAt)
	return u, err
}

func (r *Repo) DeleteUser(ctx context.Context, id int) error {
	_, err := r.Pool.Exec(ctx, "DELETE FROM users WHERE id=$1", id)
	return err
}

// Categories
func (r *Repo) ListCategories(ctx context.Context) ([]models.Category, error) {
	rows, err := r.Pool.Query(ctx, "SELECT id, name, COALESCE(description,'') FROM categories ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.Category
	for rows.Next() {
		var c models.Category
		if err := rows.Scan(&c.ID, &c.Name, &c.Description); err != nil {
			return nil, err
		}
		out = append(out, c)
	}
	if out == nil {
		out = []models.Category{}
	}
	return out, rows.Err()
}

func (r *Repo) GetCategory(ctx context.Context, id int) (models.Category, error) {
	var c models.Category
	err := r.Pool.QueryRow(ctx, "SELECT id, name, COALESCE(description,'') FROM categories WHERE id=$1", id).Scan(&c.ID, &c.Name, &c.Description)
	return c, err
}

func (r *Repo) CreateCategory(ctx context.Context, name, description string) (models.Category, error) {
	var c models.Category
	err := r.Pool.QueryRow(ctx, "INSERT INTO categories (name, description) VALUES ($1,$2) RETURNING id, name, COALESCE(description,'')", name, description).Scan(&c.ID, &c.Name, &c.Description)
	return c, err
}

// Products
func (r *Repo) ListProducts(ctx context.Context) ([]models.Product, error) {
	rows, err := r.Pool.Query(ctx, "SELECT id, name, price, category_id, created_at FROM products ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.CategoryID, &p.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	if out == nil {
		out = []models.Product{}
	}
	return out, rows.Err()
}

func (r *Repo) GetProduct(ctx context.Context, id int) (models.Product, error) {
	var p models.Product
	err := r.Pool.QueryRow(ctx, "SELECT id, name, price, category_id, created_at FROM products WHERE id=$1", id).Scan(&p.ID, &p.Name, &p.Price, &p.CategoryID, &p.CreatedAt)
	return p, err
}

func (r *Repo) CreateProduct(ctx context.Context, name string, price float64, categoryID *int) (models.Product, error) {
	var p models.Product
	err := r.Pool.QueryRow(ctx, "INSERT INTO products (name, price, category_id) VALUES ($1,$2,$3) RETURNING id, name, price, category_id, created_at", name, price, categoryID).Scan(&p.ID, &p.Name, &p.Price, &p.CategoryID, &p.CreatedAt)
	return p, err
}

func (r *Repo) UpdateProduct(ctx context.Context, id int, name string, price float64, categoryID *int) (models.Product, error) {
	var p models.Product
	err := r.Pool.QueryRow(ctx, "UPDATE products SET name=$1, price=$2, category_id=$3 WHERE id=$4 RETURNING id, name, price, category_id, created_at", name, price, categoryID, id).Scan(&p.ID, &p.Name, &p.Price, &p.CategoryID, &p.CreatedAt)
	return p, err
}

func (r *Repo) DeleteProduct(ctx context.Context, id int) error {
	_, err := r.Pool.Exec(ctx, "DELETE FROM products WHERE id=$1", id)
	return err
}

func (r *Repo) SearchProducts(ctx context.Context, q string) ([]models.Product, error) {
	rows, err := r.Pool.Query(ctx, "SELECT id, name, price, category_id, created_at FROM products WHERE name ILIKE $1 ORDER BY id", "%"+q+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.Product
	for rows.Next() {
		var p models.Product
		if err := rows.Scan(&p.ID, &p.Name, &p.Price, &p.CategoryID, &p.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, p)
	}
	if out == nil {
		out = []models.Product{}
	}
	return out, rows.Err()
}

// Orders
func (r *Repo) ListOrders(ctx context.Context) ([]models.Order, error) {
	rows, err := r.Pool.Query(ctx, "SELECT id, user_id, status, total, created_at FROM orders ORDER BY id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.Order
	for rows.Next() {
		var o models.Order
		if err := rows.Scan(&o.ID, &o.UserID, &o.Status, &o.Total, &o.CreatedAt); err != nil {
			return nil, err
		}
		out = append(out, o)
	}
	if out == nil {
		out = []models.Order{}
	}
	return out, rows.Err()
}

func (r *Repo) GetOrder(ctx context.Context, id int) (models.Order, error) {
	var o models.Order
	err := r.Pool.QueryRow(ctx, "SELECT id, user_id, status, total, created_at FROM orders WHERE id=$1", id).Scan(&o.ID, &o.UserID, &o.Status, &o.Total, &o.CreatedAt)
	return o, err
}

func (r *Repo) CreateOrder(ctx context.Context, userID *int, status string, total float64) (models.Order, error) {
	var o models.Order
	err := r.Pool.QueryRow(ctx, "INSERT INTO orders (user_id, status, total) VALUES ($1,$2,$3) RETURNING id, user_id, status, total, created_at", userID, status, total).Scan(&o.ID, &o.UserID, &o.Status, &o.Total, &o.CreatedAt)
	return o, err
}

func (r *Repo) ListOrderItems(ctx context.Context, orderID int) ([]models.OrderItem, error) {
	rows, err := r.Pool.Query(ctx, "SELECT id, order_id, product_id, quantity, price FROM order_items WHERE order_id=$1 ORDER BY id", orderID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var out []models.OrderItem
	for rows.Next() {
		var oi models.OrderItem
		if err := rows.Scan(&oi.ID, &oi.OrderID, &oi.ProductID, &oi.Quantity, &oi.Price); err != nil {
			return nil, err
		}
		out = append(out, oi)
	}
	if out == nil {
		out = []models.OrderItem{}
	}
	return out, rows.Err()
}

// Stats
func (r *Repo) Stats(ctx context.Context) (models.StatsSummary, error) {
	var s models.StatsSummary
	err := r.Pool.QueryRow(ctx, "SELECT (SELECT COUNT(*) FROM users), (SELECT COUNT(*) FROM products), (SELECT COUNT(*) FROM orders), COALESCE((SELECT SUM(total) FROM orders),0)").Scan(&s.Users, &s.Products, &s.Orders, &s.Revenue)
	if err != nil {
		return s, err
	}
	return s, nil
}
