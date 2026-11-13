package router

import (
	"github.com/gofiber/fiber/v2"
	"go-fiber/internal/handler"
)

func Setup(app *fiber.App, h *handler.Handler) {
	app.Get("/health", h.Health)
	api := app.Group("/api")
	api.Get("/users", h.ListUsers)
	api.Get("/users/:id", h.GetUser)
	api.Post("/users", h.CreateUser)
	api.Put("/users/:id", h.UpdateUser)
	api.Delete("/users/:id", h.DeleteUser)

	api.Get("/categories", h.ListCategories)
	api.Get("/categories/:id", h.GetCategory)
	api.Post("/categories", h.CreateCategory)

	api.Get("/products", h.ListProducts)
	api.Get("/products/:id", h.GetProduct)
	api.Post("/products", h.CreateProduct)
	api.Put("/products/:id", h.UpdateProduct)
	api.Delete("/products/:id", h.DeleteProduct)

	api.Get("/orders", h.ListOrders)
	api.Get("/orders/:id", h.GetOrder)
	api.Post("/orders", h.CreateOrder)
	api.Get("/orders/:id/items", h.ListOrderItems)

	api.Get("/stats/summary", h.StatsSummary)
	api.Get("/search", h.Search)
}
