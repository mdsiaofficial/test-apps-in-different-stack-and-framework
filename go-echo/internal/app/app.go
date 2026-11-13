package app

import (
	"context"
	"fmt"
	"log"

	"github.com/labstack/echo/v4"
	"go-echo/internal/config"
	"go-echo/internal/database"
	"go-echo/internal/handler"
	"go-echo/internal/repository"
	"go-echo/internal/router"
)

func Run() error {
	cfg := config.Load()
	pool, err := database.NewPool(context.Background(), cfg.DatabaseURL)
	if err != nil {
		return err
	}
	defer pool.Close()

	repo := repository.New(pool)
	h := handler.New(repo)

	e := echo.New()
	router.Setup(e, h)

	log.Printf("server started on :%s", cfg.Port)
	if err := e.Start(":" + cfg.Port); err != nil {
		return fmt.Errorf("server: %w", err)
	}
	return nil
}
