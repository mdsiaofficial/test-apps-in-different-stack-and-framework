use actix_web::web;
use std::sync::Arc;

use crate::db::Repo;
use crate::handlers;

pub fn routes(cfg: &mut web::ServiceConfig, repo: Arc<Repo>) {
    cfg.app_data(web::Data::new(repo))
        .route("/health", web::get().to(handlers::health))
        .route("/api/users", web::get().to(handlers::list_users))
        .route("/api/users", web::post().to(handlers::create_user))
        .route("/api/users/{id}", web::get().to(handlers::get_user))
        .route("/api/users/{id}", web::put().to(handlers::update_user))
        .route("/api/users/{id}", web::delete().to(handlers::delete_user))
        .route("/api/categories", web::get().to(handlers::list_categories))
        .route("/api/categories", web::post().to(handlers::create_category))
        .route("/api/categories/{id}", web::get().to(handlers::get_category))
        .route("/api/products", web::get().to(handlers::list_products))
        .route("/api/products", web::post().to(handlers::create_product))
        .route("/api/products/{id}", web::get().to(handlers::get_product))
        .route("/api/products/{id}", web::put().to(handlers::update_product))
        .route("/api/products/{id}", web::delete().to(handlers::delete_product))
        .route("/api/orders", web::get().to(handlers::list_orders))
        .route("/api/orders", web::post().to(handlers::create_order))
        .route("/api/orders/{id}", web::get().to(handlers::get_order))
        .route("/api/orders/{id}/items", web::get().to(handlers::list_order_items))
        .route("/api/stats/summary", web::get().to(handlers::stats))
        .route("/api/search", web::get().to(handlers::search));
}