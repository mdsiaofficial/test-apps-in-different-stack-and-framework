package handler

import (
	"net/http"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"go-fiber/internal/repository"
)

type Handler struct {
	Repo *repository.Repo
}

func New(r *repository.Repo) *Handler {
	return &Handler{Repo: r}
}

func parseID(c *fiber.Ctx) (int, error) {
	return strconv.Atoi(c.Params("id"))
}

type userReq struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

type categoryReq struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type productReq struct {
	Name       string  `json:"name"`
	Price      float64 `json:"price"`
	CategoryID *int    `json:"category_id"`
}

type orderReq struct {
	UserID *int    `json:"user_id"`
	Status string  `json:"status"`
	Total  float64 `json:"total"`
}

func (h *Handler) Health(c *fiber.Ctx) error {
	return c.Status(http.StatusOK).JSON(map[string]string{"status": "ok"})
}

// Users
func (h *Handler) ListUsers(c *fiber.Ctx) error {
	users, err := h.Repo.ListUsers(c.Context())
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(users)
}

func (h *Handler) GetUser(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": "invalid id"})
	}
	u, err := h.Repo.GetUser(c.Context(), id)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(map[string]string{"error": "not found"})
	}
	return c.JSON(u)
}

func (h *Handler) CreateUser(c *fiber.Ctx) error {
	var req userReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": err.Error()})
	}
	u, err := h.Repo.CreateUser(c.Context(), req.Name, req.Email)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.Status(http.StatusCreated).JSON(u)
}

func (h *Handler) UpdateUser(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": "invalid id"})
	}
	var req userReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": err.Error()})
	}
	u, err := h.Repo.UpdateUser(c.Context(), id, req.Name, req.Email)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(u)
}

func (h *Handler) DeleteUser(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": "invalid id"})
	}
	if err := h.Repo.DeleteUser(c.Context(), id); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(map[string]bool{"deleted": true})
}

// Categories
func (h *Handler) ListCategories(c *fiber.Ctx) error {
	cats, err := h.Repo.ListCategories(c.Context())
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(cats)
}

func (h *Handler) GetCategory(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": "invalid id"})
	}
	cat, err := h.Repo.GetCategory(c.Context(), id)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(map[string]string{"error": "not found"})
	}
	return c.JSON(cat)
}

func (h *Handler) CreateCategory(c *fiber.Ctx) error {
	var req categoryReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": err.Error()})
	}
	cat, err := h.Repo.CreateCategory(c.Context(), req.Name, req.Description)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.Status(http.StatusCreated).JSON(cat)
}

// Products
func (h *Handler) ListProducts(c *fiber.Ctx) error {
	prods, err := h.Repo.ListProducts(c.Context())
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(prods)
}

func (h *Handler) GetProduct(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": "invalid id"})
	}
	p, err := h.Repo.GetProduct(c.Context(), id)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(map[string]string{"error": "not found"})
	}
	return c.JSON(p)
}

func (h *Handler) CreateProduct(c *fiber.Ctx) error {
	var req productReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": err.Error()})
	}
	p, err := h.Repo.CreateProduct(c.Context(), req.Name, req.Price, req.CategoryID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.Status(http.StatusCreated).JSON(p)
}

func (h *Handler) UpdateProduct(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": "invalid id"})
	}
	var req productReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": err.Error()})
	}
	p, err := h.Repo.UpdateProduct(c.Context(), id, req.Name, req.Price, req.CategoryID)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(p)
}

func (h *Handler) DeleteProduct(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": "invalid id"})
	}
	if err := h.Repo.DeleteProduct(c.Context(), id); err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(map[string]bool{"deleted": true})
}

// Orders
func (h *Handler) ListOrders(c *fiber.Ctx) error {
	orders, err := h.Repo.ListOrders(c.Context())
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(orders)
}

func (h *Handler) GetOrder(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": "invalid id"})
	}
	o, err := h.Repo.GetOrder(c.Context(), id)
	if err != nil {
		return c.Status(http.StatusNotFound).JSON(map[string]string{"error": "not found"})
	}
	return c.JSON(o)
}

func (h *Handler) CreateOrder(c *fiber.Ctx) error {
	var req orderReq
	if err := c.BodyParser(&req); err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": err.Error()})
	}
	o, err := h.Repo.CreateOrder(c.Context(), req.UserID, req.Status, req.Total)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.Status(http.StatusCreated).JSON(o)
}

func (h *Handler) ListOrderItems(c *fiber.Ctx) error {
	id, err := parseID(c)
	if err != nil {
		return c.Status(http.StatusBadRequest).JSON(map[string]string{"error": "invalid id"})
	}
	items, err := h.Repo.ListOrderItems(c.Context(), id)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(items)
}

// Stats
func (h *Handler) StatsSummary(c *fiber.Ctx) error {
	s, err := h.Repo.Stats(c.Context())
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(s)
}

// Search
func (h *Handler) Search(c *fiber.Ctx) error {
	q := c.Query("q")
	prods, err := h.Repo.SearchProducts(c.Context(), q)
	if err != nil {
		return c.Status(http.StatusInternalServerError).JSON(map[string]string{"error": err.Error()})
	}
	return c.JSON(prods)
}
