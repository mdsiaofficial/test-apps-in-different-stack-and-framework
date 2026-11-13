mod config;
mod db;
mod handlers;
mod models;
mod routes;

use axum::extract::State;
use config::Config;
use db::Repo;
use routes::router;
use std::sync::Arc;
use tokio::net::TcpListener;
use tower_http::trace::TraceLayer;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let cfg = Config::load();
    let (client, connection) =
        tokio_postgres::connect(&cfg.database_url, tokio_postgres::NoTls).await?;
    tokio::spawn(async move {
        if let Err(e) = connection.await {
            eprintln!("database connection error: {e}");
        }
    });

    let repo = Arc::new(Repo::new(client));
    let app = router(repo).layer(TraceLayer::new_for_http());

    let addr = format!("0.0.0.0:{}", cfg.port);
    let listener = TcpListener::bind(&addr).await?;
    println!("rust-axum listening on http://{}", addr);
    axum::serve(listener, app).await?;
    Ok(())
}
