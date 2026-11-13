package main

import (
	"context"
	"log"

	"github.com/gofiber/fiber/v2"
	"go-fiber/internal/config"
	"go-fiber/internal/database"
	"go-fiber/internal/handler"
	"go-fiber/internal/repository"
	"go-fiber/internal/router"
)

func main() {
	cfg := config.Load()
	pool, err := database.NewPool(context.Background(), cfg.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer pool.Close()

	repo := repository.New(pool)
	h := handler.New(repo)

	app := fiber.New()
	router.Setup(app, h)

	log.Printf("server started on :%s", cfg.Port)
	if err := app.Listen(":" + cfg.Port); err != nil {
		log.Fatal(err)
	}
}
