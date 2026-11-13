package config

import "os"

type Config struct {
	DatabaseURL string
	Port        string
}

func Load() Config {
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		dbURL = "postgres://app:app@localhost:5432/appdb"
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8003"
	}
	return Config{DatabaseURL: dbURL, Port: port}
}
