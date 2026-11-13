use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;

use crate::db::Repo;
use crate::models::{
    Category, CategoryBody, Order, OrderBody, OrderItem, Product, ProductBody, SearchQuery, User,
    UserBody,
};

pub type AppState = std::sync::Arc<Repo>;

fn json_response(status: StatusCode, body: serde_json::Value) -> Response {
    (status, Json(body)).into_response()
}

pub async fn health() -> Response {
    json_response(StatusCode::OK, json!({"status": "ok"}))
}

// Users
pub async fn list_users(State(repo): State<AppState>) -> Response {
    match repo.list_users().await {
        Ok(v) => json_response(StatusCode::OK, json!(v)),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn get_user(State(repo): State<AppState>, Path(id): Path<i32>) -> Response {
    match repo.get_user(id).await {
        Ok(Some(u)) => json_response(StatusCode::OK, json!(u)),
        Ok(None) => json_response(StatusCode::NOT_FOUND, json!({"error": "not found"})),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn create_user(State(repo): State<AppState>, Json(b): Json<UserBody>) -> Response {
    match repo.create_user(&b.name, &b.email).await {
        Ok(u) => json_response(StatusCode::CREATED, json!(u)),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn update_user(
    State(repo): State<AppState>,
    Path(id): Path<i32>,
    Json(b): Json<UserBody>,
) -> Response {
    match repo.update_user(id, &b.name, &b.email).await {
        Ok(Some(u)) => json_response(StatusCode::OK, json!(u)),
        Ok(None) => json_response(StatusCode::NOT_FOUND, json!({"error": "not found"})),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn delete_user(State(repo): State<AppState>, Path(id): Path<i32>) -> Response {
    match repo.delete_user(id).await {
        Ok(_) => json_response(StatusCode::OK, json!({"deleted": true})),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

// Categories
pub async fn list_categories(State(repo): State<AppState>) -> Response {
    match repo.list_categories().await {
        Ok(v) => json_response(StatusCode::OK, json!(v)),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn get_category(State(repo): State<AppState>, Path(id): Path<i32>) -> Response {
    match repo.get_category(id).await {
        Ok(Some(c)) => json_response(StatusCode::OK, json!(c)),
        Ok(None) => json_response(StatusCode::NOT_FOUND, json!({"error": "not found"})),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn create_category(
    State(repo): State<AppState>,
    Json(b): Json<CategoryBody>,
) -> Response {
    match repo.create_category(&b.name, &b.description).await {
        Ok(c) => json_response(StatusCode::CREATED, json!(c)),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

// Products
pub async fn list_products(State(repo): State<AppState>) -> Response {
    match repo.list_products().await {
        Ok(v) => json_response(StatusCode::OK, json!(v)),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn get_product(State(repo): State<AppState>, Path(id): Path<i32>) -> Response {
    match repo.get_product(id).await {
        Ok(Some(p)) => json_response(StatusCode::OK, json!(p)),
        Ok(None) => json_response(StatusCode::NOT_FOUND, json!({"error": "not found"})),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),

    }
}
pub async fn create_product(
    State(repo): State<AppState>,
    Json(b): Json<ProductBody>,
) -> Response {
    match repo.create_product(&b.name, b.price, b.category_id).await {
        Ok(p) => json_response(StatusCode::CREATED, json!(p)),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn update_product(
    State(repo): State<AppState>,
    Path(id): Path<i32>,
    Json(b): Json<ProductBody>,
) -> Response {
    match repo.update_product(id, &b.name, b.price, b.category_id).await {
        Ok(Some(p)) => json_response(StatusCode::OK, json!(p)),
        Ok(None) => json_response(StatusCode::NOT_FOUND, json!({"error": "not found"})),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn delete_product(State(repo): State<AppState>, Path(id): Path<i32>) -> Response {
    match repo.delete_product(id).await {
        Ok(_) => json_response(StatusCode::OK, json!({"deleted": true})),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

// Orders
pub async fn list_orders(State(repo): State<AppState>) -> Response {
    match repo.list_orders().await {
        Ok(v) => json_response(StatusCode::OK, json!(v)),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn get_order(State(repo): State<AppState>, Path(id): Path<i32>) -> Response {
    match repo.get_order(id).await {
        Ok(Some(o)) => json_response(StatusCode::OK, json!(o)),
        Ok(None) => json_response(StatusCode::NOT_FOUND, json!({"error": "not found"})),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn create_order(State(repo): State<AppState>, Json(b): Json<OrderBody>) -> Response {
    match repo.create_order(b.user_id, &b.status, b.total).await {
        Ok(o) => json_response(StatusCode::CREATED, json!(o)),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

pub async fn list_order_items(State(repo): State<AppState>, Path(id): Path<i32>) -> Response {
    match repo.list_order_items(id).await {
        Ok(v) => json_response(StatusCode::OK, json!(v)),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

// Stats
pub async fn stats(State(repo): State<AppState>) -> Response {
    match repo.stats().await {
        Ok((u, p, o, rev)) => json_response(
            StatusCode::OK,
            json!({"users": u, "products": p, "orders": o, "revenue": rev}),
        ),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}

// Search
pub async fn search(State(repo): State<AppState>, Query(q): Query<SearchQuery>) -> Response {
    let term = q.q.unwrap_or_default();
    match repo.search_products(&term).await {
        Ok(v) => json_response(StatusCode::OK, json!(v)),
        Err(e) => json_response(StatusCode::INTERNAL_SERVER_ERROR, json!({"error": e.to_string()})),
    }
}