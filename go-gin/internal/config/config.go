package config

import (
	"fmt"
	"os"
)

type Config struct {
	DatabaseURL string
	Port        string
}

func Load() *Config {
	db := os.Getenv("DATABASE_URL")
	if db == "" {
		db = "postgres://app:app@localhost:5432/appdb"
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8001"
	}
	return &Config{DatabaseURL: db, Port: port}
}

func (c *Config) Addr() string {
	return fmt.Sprintf(":%s", c.Port)
}
