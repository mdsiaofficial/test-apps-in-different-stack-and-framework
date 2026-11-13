use crate::models::{Category, Order, OrderItem, Product, User};
use tokio_postgres::Client;

pub struct Repo {
    pub client: Client,
}

impl Repo {
    pub fn new(client: Client) -> Self {
        Self { client }
    }

    // Users
    pub async fn list_users(&self) -> Result<Vec<User>, tokio_postgres::Error> {
        let rows = self
            .client
            .query("SELECT id,name,email,created_at::text FROM users ORDER BY id", &[])
            .await?;
        let mut out = Vec::new();
        for row in rows {
            out.push(User {
                id: row.get(0),
                name: row.get(1),
                email: row.get(2),
                created_at: row.get(3),
            });
        }
        Ok(out)
    }

    pub async fn get_user(&self, id: i32) -> Result<Option<User>, tokio_postgres::Error> {
        let row = self
            .client
            .query_opt(
                "SELECT id,name,email,created_at::text FROM users WHERE id=$1",
                &[&id],
            )
            .await?;
        Ok(row.map(|r| User {
            id: r.get(0),
            name: r.get(1),
            email: r.get(2),
            created_at: r.get(3),
        }))
    }

    pub async fn create_user(&self, name: &str, email: &str) -> Result<User, tokio_postgres::Error> {
        let row = self
            .client
            .query_one(
                "INSERT INTO users(name,email) VALUES($1,$2) RETURNING id,name,email,created_at::text",
                &[&name, &email],
            )
            .await?;
        Ok(User {
            id: row.get(0),
            name: row.get(1),
            email: row.get(2),
            created_at: row.get(3),
        })
    }

    pub async fn update_user(
        &self,
        id: i32,
        name: &str,
        email: &str,
    ) -> Result<Option<User>, tokio_postgres::Error> {
        let row = self
            .client
            .query_opt(
                "UPDATE users SET name=$1,email=$2 WHERE id=$3 RETURNING id,name,email,created_at::text",
                &[&name, &email, &id],
            )
            .await?;
        Ok(row.map(|r| User {
            id: r.get(0),
            name: r.get(1),
            email: r.get(2),
            created_at: r.get(3),
        }))
    }

    pub async fn delete_user(&self, id: i32) -> Result<(), tokio_postgres::Error> {
        self.client
            .execute("DELETE FROM users WHERE id=$1", &[&id])
            .await?;
        Ok(())
    }

    // Categories
    pub async fn list_categories(&self) -> Result<Vec<Category>, tokio_postgres::Error> {
        let rows = self
            .client
            .query("SELECT id,name,description FROM categories ORDER BY id", &[])
            .await?;
        let mut out = Vec::new();
        for row in rows {
            out.push(Category {
                id: row.get(0),
                name: row.get(1),
                description: row.get(2),
            });
        }
        Ok(out)
    }

    pub async fn get_category(&self, id: i32) -> Result<Option<Category>, tokio_postgres::Error> {
        let row = self
            .client
            .query_opt("SELECT id,name,description FROM categories WHERE id=$1", &[&id])
            .await?;
        Ok(row.map(|r| Category {
            id: r.get(0),
            name: r.get(1),
            description: r.get(2),
        }))
    }

    pub async fn create_category(
        &self,
        name: &str,
        description: &Option<String>,
    ) -> Result<Category, tokio_postgres::Error> {
        let row = self
            .client
            .query_one(
                "INSERT INTO categories(name,description) VALUES($1,$2) RETURNING id,name,description",
                &[&name, description],
            )
            .await?;
        Ok(Category {
            id: row.get(0),
            name: row.get(1),
            description: row.get(2),
        })
    }

    // Products
    pub async fn list_products(&self) -> Result<Vec<Product>, tokio_postgres::Error> {
        let rows = self
            .client
            .query(
                "SELECT id,name,price::float8,category_id,created_at::text FROM products ORDER BY id",
                &[],
            )
            .await?;
        let mut out = Vec::new();
        for row in rows {
            out.push(Product {
                id: row.get(0),
                name: row.get(1),
                price: row.get(2),
                category_id: row.get(3),
                created_at: row.get(4),
            });
        }
        Ok(out)
    }

    pub async fn get_product(&self, id: i32) -> Result<Option<Product>, tokio_postgres::Error> {
        let row = self
            .client
            .query_opt(
                "SELECT id,name,price::float8,category_id,created_at::text FROM products WHERE id=$1",
                &[&id],
            )
            .await?;
        Ok(row.map(|r| Product {
            id: r.get(0),
            name: r.get(1),
            price: r.get(2),
            category_id: r.get(3),
            created_at: r.get(4),
        }))
    }

    pub async fn create_product(
        &self,
        name: &str,
        price: f64,
        category_id: Option<i32>,
    ) -> Result<Product, tokio_postgres::Error> {
        let row = self
            .client
            .query_one(
                "INSERT INTO products(name,price,category_id) VALUES($1,$2::float8,$3) RETURNING id,name,price::float8,category_id,created_at::text",
                &[&name, &price, &category_id],
            )
            .await?;
        Ok(Product {
            id: row.get(0),
            name: row.get(1),
            price: row.get(2),
            category_id: row.get(3),
            created_at: row.get(4),
        })
    }

    pub async fn update_product(
        &self,
        id: i32,
        name: &str,
        price: f64,
        category_id: Option<i32>,
    ) -> Result<Option<Product>, tokio_postgres::Error> {
        let row = self
            .client
            .query_opt(
                "UPDATE products SET name=$1,price=$2::float8,category_id=$3 WHERE id=$4 RETURNING id,name,price::float8,category_id,created_at::text",
                &[&name, &price, &category_id, &id],
            )
            .await?;
        Ok(row.map(|r| Product {
            id: r.get(0),
            name: r.get(1),
            price: r.get(2),
            category_id: r.get(3),
            created_at: r.get(4),
        }))
    }

    pub async fn delete_product(&self, id: i32) -> Result<(), tokio_postgres::Error> {
        self.client
            .execute("DELETE FROM products WHERE id=$1", &[&id])
            .await?;
        Ok(())
    }

    // Orders
    pub async fn list_orders(&self) -> Result<Vec<Order>, tokio_postgres::Error> {
        let rows = self
            .client
            .query(
                "SELECT id,user_id,status,total::float8,created_at::text FROM orders ORDER BY id",
                &[],
            )
            .await?;
        let mut out = Vec::new();
        for row in rows {
            out.push(Order {
                id: row.get(0),
                user_id: row.get(1),
                status: row.get(2),
                total: row.get(3),
                created_at: row.get(4),
            });
        }
        Ok(out)
    }

    pub async fn get_order(&self, id: i32) -> Result<Option<Order>, tokio_postgres::Error> {
        let row = self
            .client
            .query_opt(
                "SELECT id,user_id,status,total::float8,created_at::text FROM orders WHERE id=$1",
                &[&id],
            )
            .await?;
        Ok(row.map(|r| Order {
            id: r.get(0),
            user_id: r.get(1),
            status: r.get(2),
            total: r.get(3),
            created_at: r.get(4),
        }))
    }

    pub async fn create_order(
        &self,
        user_id: Option<i32>,
        status: &str,
        total: f64,
    ) -> Result<Order, tokio_postgres::Error> {
        let row = self
            .client
            .query_one(
                "INSERT INTO orders(user_id,status,total) VALUES($1,$2,$3::float8) RETURNING id,user_id,status,total::float8,created_at::text",
                &[&user_id, &status, &total],
            )
            .await?;
        Ok(Order {
            id: row.get(0),
            user_id: row.get(1),
            status: row.get(2),
            total: row.get(3),
            created_at: row.get(4),
        })
    }

    pub async fn list_order_items(
        &self,
        order_id: i32,
    ) -> Result<Vec<OrderItem>, tokio_postgres::Error> {
        let rows = self
            .client
            .query(
                "SELECT id,order_id,product_id,quantity,price::float8 FROM order_items WHERE order_id=$1 ORDER BY id",
                &[&order_id],
            )
            .await?;
        let mut out = Vec::new();
        for row in rows {
            out.push(OrderItem {
                id: row.get(0),
                order_id: row.get(1),
                product_id: row.get(2),
                quantity: row.get(3),
                price: row.get(4),
            });
        }
        Ok(out)
    }

    pub async fn stats(&self) -> Result<(i64, i64, i64, f64), tokio_postgres::Error> {
        let row = self
            .client
            .query_one(
                "SELECT (SELECT COUNT(*) FROM users), (SELECT COUNT(*) FROM products), (SELECT COUNT(*) FROM orders), COALESCE((SELECT SUM(total)::float8 FROM orders),0)",
                &[],
            )
            .await?;
        Ok((row.get(0), row.get(1), row.get(2), row.get(3)))
    }

    pub async fn search_products(&self, term: &str) -> Result<Vec<Product>, tokio_postgres::Error> {
        let pattern = format!("%{}%", term);
        let rows = self
            .client
            .query(
                "SELECT id,name,price::float8,category_id,created_at::text FROM products WHERE name ILIKE $1 ORDER BY id",
                &[&pattern],
            )
            .await?;
        let mut out = Vec::new();
        for row in rows {
            out.push(Product {
                id: row.get(0),
                name: row.get(1),
                price: row.get(2),
                category_id: row.get(3),
                created_at: row.get(4),
            });
        }
        Ok(out)
    }
}