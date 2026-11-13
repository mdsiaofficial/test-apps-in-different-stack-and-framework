package router

import (
	"github.com/labstack/echo/v4"
	"go-echo/internal/handler"
)

func Setup(e *echo.Echo, h *handler.Handler) {
	e.GET("/health", h.Health)
	g := e.Group("/api")
	g.GET("/users", h.ListUsers)
	g.GET("/users/:id", h.GetUser)
	g.POST("/users", h.CreateUser)
	g.PUT("/users/:id", h.UpdateUser)
	g.DELETE("/users/:id", h.DeleteUser)

	g.GET("/categories", h.ListCategories)
	g.GET("/categories/:id", h.GetCategory)
	g.POST("/categories", h.CreateCategory)

	g.GET("/products", h.ListProducts)
	g.GET("/products/:id", h.GetProduct)
	g.POST("/products", h.CreateProduct)
	g.PUT("/products/:id", h.UpdateProduct)
	g.DELETE("/products/:id", h.DeleteProduct)

	g.GET("/orders", h.ListOrders)
	g.GET("/orders/:id", h.GetOrder)
	g.POST("/orders", h.CreateOrder)
	g.GET("/orders/:id/items", h.ListOrderItems)

	g.GET("/stats/summary", h.StatsSummary)
	g.GET("/search", h.Search)
}
