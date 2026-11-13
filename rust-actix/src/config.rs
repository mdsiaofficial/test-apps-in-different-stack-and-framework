use std::env;

pub struct Config {
    pub database_url: String,
    pub port: String,
}

impl Config {
    pub fn load() -> Self {
        let database_url = env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgres://app:app@localhost:5432/appdb".to_string());
        let port = env::var("PORT").unwrap_or_else(|_| "8005".to_string());
        Self { database_url, port }
    }
}