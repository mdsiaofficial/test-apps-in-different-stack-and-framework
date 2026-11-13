mod config;
mod db;
mod handlers;
mod models;
mod routes;

use actix_web::{App, HttpServer};
use config::Config;
use db::Repo;
use routes::routes;
use std::sync::Arc;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let cfg = Config::load();
    let (client, connection) =
        tokio_postgres::connect(&cfg.database_url, tokio_postgres::NoTls)
            .await
            .expect("db connect failed");
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("database connection error: {e}");
        }
    });

    let repo = Arc::new(Repo::new(client));
    let port = cfg.port.clone();
    println!("rust-actix listening on http://0.0.0.0:{}", port);

    HttpServer::new(move || {
        App::new().configure(|sc| routes(sc, repo.clone()))
    })
    .bind(format!("0.0.0.0:{}", port))?
    .run()
    .await
}