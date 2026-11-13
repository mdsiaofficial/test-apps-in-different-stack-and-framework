package main

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"

	"go-gin/internal/config"
	"go-gin/internal/handler"
	"go-gin/internal/repository"
	"go-gin/internal/router"
)

func main() {
	cfg := config.Load()
	pool, err := pgxpool.New(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()
	if err := pool.Ping(context.Background()); err != nil {
		log.Fatal(err)
	}
	repo := repository.New(pool)
	h := handler.New(repo)
	r := router.New(h)
	log.Printf("listening on %s", cfg.Addr())
	if err := r.Run(cfg.Addr()); err != nil {
		log.Fatal(err)
	}
}
