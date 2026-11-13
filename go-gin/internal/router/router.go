package router

import (
	"github.com/gin-gonic/gin"

	"go-gin/internal/handler"
)

func New(h *handler.Handler) *gin.Engine {
	r := gin.Default()
	r.GET("/health", h.Health)
	api := r.Group("/api")
	{
		api.GET("/users", h.ListUsers)
		api.GET("/users/:id", h.GetUser)
		api.POST("/users", h.CreateUser)
		api.PUT("/users/:id", h.UpdateUser)
		api.DELETE("/users/:id", h.DeleteUser)

		api.GET("/categories", h.ListCategories)
		api.GET("/categories/:id", h.GetCategory)
		api.POST("/categories", h.CreateCategory)

		api.GET("/products", h.ListProducts)
		api.GET("/products/:id", h.GetProduct)
		api.POST("/products", h.CreateProduct)
		api.PUT("/products/:id", h.UpdateProduct)
		api.DELETE("/products/:id", h.DeleteProduct)

		api.GET("/orders", h.ListOrders)
		api.GET("/orders/:id", h.GetOrder)
		api.POST("/orders", h.CreateOrder)
		api.GET("/orders/:id/items", h.ListOrderItems)

		api.GET("/stats/summary", h.Stats)
		api.GET("/search", h.Search)
	}
	return r
}
