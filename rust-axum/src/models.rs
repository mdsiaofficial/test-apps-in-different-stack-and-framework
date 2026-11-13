use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct User {
    pub id: i32,
    pub name: String,
    pub email: String,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Category {
    pub id: i32,
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Product {
    pub id: i32,
    pub name: String,
    pub price: f64,
    pub category_id: Option<i32>,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Order {
    pub id: i32,
    pub user_id: Option<i32>,
    pub status: String,
    pub total: f64,
    pub created_at: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct OrderItem {
    pub id: i32,
    pub order_id: i32,
    pub product_id: Option<i32>,
    pub quantity: i32,
    pub price: f64,
}

// Request bodies

#[derive(Debug, Deserialize)]
pub struct UserBody {
    pub name: String,
    pub email: String,
}

#[derive(Debug, Deserialize)]
pub struct CategoryBody {
    pub name: String,
    pub description: Option<String>,
}

#[derive(Debug, Deserialize)]
pub struct ProductBody {
    pub name: String,
    pub price: f64,
    pub category_id: Option<i32>,
}

#[derive(Debug, Deserialize)]
pub struct OrderBody {
    pub user_id: Option<i32>,
    pub status: String,
    pub total: f64,
}

#[derive(Debug, Deserialize)]
pub struct SearchQuery {
    pub q: Option<String>,
}
