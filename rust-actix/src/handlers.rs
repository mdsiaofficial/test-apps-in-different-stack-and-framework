use actix_web::{web, HttpResponse};
use serde_json::json;

use crate::db::Repo;
use crate::models::{CategoryBody, OrderBody, ProductBody, SearchQuery, UserBody};
use std::sync::Arc;

fn err(e: tokio_postgres::Error) -> HttpResponse {
    HttpResponse::InternalServerError().json(json!({"error": e.to_string()}))
}

pub async fn health() -> HttpResponse {
    HttpResponse::Ok().json(json!({"status": "ok"}))
}

// Users
pub async fn list_users(repo: web::Data<Arc<Repo>>) -> HttpResponse {
    match repo.list_users().await {
        Ok(v) => HttpResponse::Ok().json(v),
        Err(e) => err(e),
    }
}

pub async fn get_user(repo: web::Data<Arc<Repo>>, path: web::Path<i32>) -> HttpResponse {
    let id = path.into_inner();
    match repo.get_user(id).await {
        Ok(Some(u)) => HttpResponse::Ok().json(u),
        Ok(None) => HttpResponse::NotFound().json(json!({"error": "not found"})),
        Err(e) => err(e),
    }
}

pub async fn create_user(repo: web::Data<Arc<Repo>>, body: web::Json<UserBody>) -> HttpResponse {
    let b = body.into_inner();
    match repo.create_user(&b.name, &b.email).await {
        Ok(u) => HttpResponse::Created().json(u),
        Err(e) => err(e),
    }
}

pub async fn update_user(
    repo: web::Data<Arc<Repo>>,
    path: web::Path<i32>,
    body: web::Json<UserBody>,
) -> HttpResponse {
    let id = path.into_inner();
    let b = body.into_inner();
    match repo.update_user(id, &b.name, &b.email).await {
        Ok(Some(u)) => HttpResponse::Ok().json(u),
        Ok(None) => HttpResponse::NotFound().json(json!({"error": "not found"})),
        Err(e) => err(e),
    }
}

pub async fn delete_user(repo: web::Data<Arc<Repo>>, path: web::Path<i32>) -> HttpResponse {
    let id = path.into_inner();
    match repo.delete_user(id).await {
        Ok(_) => HttpResponse::Ok().json(json!({"deleted": true})),
        Err(e) => err(e),
    }
}

// Categories
pub async fn list_categories(repo: web::Data<Arc<Repo>>) -> HttpResponse {
    match repo.list_categories().await {
        Ok(v) => HttpResponse::Ok().json(v),
        Err(e) => err(e),
    }
}

pub async fn get_category(repo: web::Data<Arc<Repo>>, path: web::Path<i32>) -> HttpResponse {
    let id = path.into_inner();
    match repo.get_category(id).await {
        Ok(Some(c)) => HttpResponse::Ok().json(c),
        Ok(None) => HttpResponse::NotFound().json(json!({"error": "not found"})),
        Err(e) => err(e),
    }
}

pub async fn create_category(repo: web::Data<Arc<Repo>>, body: web::Json<CategoryBody>) -> HttpResponse {
    let b = body.into_inner();
    match repo.create_category(&b.name, &b.description).await {
        Ok(c) => HttpResponse::Created().json(c),
        Err(e) => err(e),
    }
}

// Products
pub async fn list_products(repo: web::Data<Arc<Repo>>) -> HttpResponse {
    match repo.list_products().await {
        Ok(v) => HttpResponse::Ok().json(v),
        Err(e) => err(e),
    }
}

pub async fn get_product(repo: web::Data<Arc<Repo>>, path: web::Path<i32>) -> HttpResponse {
    let id = path.into_inner();
    match repo.get_product(id).await {
        Ok(Some(p)) => HttpResponse::Ok().json(p),
        Ok(None) => HttpResponse::NotFound().json(json!({"error": "not found"})),
        Err(e) => err(e),
    }
}

pub async fn create_product(repo: web::Data<Arc<Repo>>, body: web::Json<ProductBody>) -> HttpResponse {
    let b = body.into_inner();
    match repo.create_product(&b.name, b.price, b.category_id).await {
        Ok(p) => HttpResponse::Created().json(p),
        Err(e) => err(e),
    }
}

pub async fn update_product(
    repo: web::Data<Arc<Repo>>,
    path: web::Path<i32>,
    body: web::Json<ProductBody>,
) -> HttpResponse {
    let id = path.into_inner();
    let b = body.into_inner();
    match repo.update_product(id, &b.name, b.price, b.category_id).await {
        Ok(Some(p)) => HttpResponse::Ok().json(p),
        Ok(None) => HttpResponse::NotFound().json(json!({"error": "not found"})),
        Err(e) => err(e),
    }
}

pub async fn delete_product(repo: web::Data<Arc<Repo>>, path: web::Path<i32>) -> HttpResponse {
    let id = path.into_inner();
    match repo.delete_product(id).await {
        Ok(_) => HttpResponse::Ok().json(json!({"deleted": true})),
        Err(e) => err(e),
    }
}

// Orders
pub async fn list_orders(repo: web::Data<Arc<Repo>>) -> HttpResponse {
    match repo.list_orders().await {
        Ok(v) => HttpResponse::Ok().json(v),
        Err(e) => err(e),
    }
}

pub async fn get_order(repo: web::Data<Arc<Repo>>, path: web::Path<i32>) -> HttpResponse {
    let id = path.into_inner();
    match repo.get_order(id).await {
        Ok(Some(o)) => HttpResponse::Ok().json(o),
        Ok(None) => HttpResponse::NotFound().json(json!({"error": "not found"})),
        Err(e) => err(e),
    }
}

pub async fn create_order(repo: web::Data<Arc<Repo>>, body: web::Json<OrderBody>) -> HttpResponse {
    let b = body.into_inner();
    match repo.create_order(b.user_id, &b.status, b.total).await {
        Ok(o) => HttpResponse::Created().json(o),
        Err(e) => err(e),
    }
}

pub async fn list_order_items(repo: web::Data<Arc<Repo>>, path: web::Path<i32>) -> HttpResponse {
    let id = path.into_inner();
    match repo.list_order_items(id).await {
        Ok(v) => HttpResponse::Ok().json(v),
        Err(e) => err(e),
    }
}

// Stats
pub async fn stats(repo: web::Data<Arc<Repo>>) -> HttpResponse {
    match repo.stats().await {
        Ok((u, p, o, rev)) => HttpResponse::Ok().json(json!({"users": u, "products": p, "orders": o, "revenue": rev})),
        Err(e) => err(e),
    }
}

// Search
pub async fn search(repo: web::Data<Arc<Repo>>, query: web::Query<SearchQuery>) -> HttpResponse {
    let term = query.q.clone().unwrap_or_default();
    match repo.search_products(&term).await {
        Ok(v) => HttpResponse::Ok().json(v),
        Err(e) => err(e),
    }
}

