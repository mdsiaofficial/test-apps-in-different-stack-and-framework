use axum::{
    routing::get,
    Router,
};

use std::sync::Arc;

use crate::db::Repo;
use crate::handlers;

pub fn router(repo: Arc<Repo>) -> Router {
    Router::new()
        .route("/health", get(handlers::health))
        .route("/api/users", get(handlers::list_users).post(handlers::create_user))
        .route(
            "/api/users/{id}",
            get(handlers::get_user)
                .put(handlers::update_user)
                .delete(handlers::delete_user),
        )
        .route(
            "/api/categories",
            get(handlers::list_categories).post(handlers::create_category),
        )
        .route("/api/categories/{id}", get(handlers::get_category))
        .route(
            "/api/products",
            get(handlers::list_products).post(handlers::create_product),
        )
        .route(
            "/api/products/{id}",
            get(handlers::get_product)
                .put(handlers::update_product)
                .delete(handlers::delete_product),
        )
        .route("/api/orders", get(handlers::list_orders).post(handlers::create_order))
        .route("/api/orders/{id}", get(handlers::get_order))
        .route("/api/orders/{id}/items", get(handlers::list_order_items))
        .route("/api/stats/summary", get(handlers::stats))
        .route("/api/search", get(handlers::search))
        .with_state(repo)
}
