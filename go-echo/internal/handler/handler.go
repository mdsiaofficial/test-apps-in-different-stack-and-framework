package handler

import (
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
	"go-echo/internal/repository"
)

type Handler struct {
	Repo *repository.Repo
}

func New(r *repository.Repo) *Handler {
	return &Handler{Repo: r}
}

func (h *Handler) Health(c echo.Context) error {
	return c.JSON(http.StatusOK, map[string]string{"status": "ok"})
}

// Users
func (h *Handler) ListUsers(c echo.Context) error {
	users, err := h.Repo.ListUsers(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, users)
}

func (h *Handler) GetUser(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	u, err := h.Repo.GetUser(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "not found"})
	}
	return c.JSON(http.StatusOK, u)
}

type userReq struct {
	Name  string `json:"name"`
	Email string `json:"email"`
}

func (h *Handler) CreateUser(c echo.Context) error {
	var req userReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	u, err := h.Repo.CreateUser(c.Request().Context(), req.Name, req.Email)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusCreated, u)
}

func (h *Handler) UpdateUser(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var req userReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	u, err := h.Repo.UpdateUser(c.Request().Context(), id, req.Name, req.Email)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, u)
}

func (h *Handler) DeleteUser(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.Repo.DeleteUser(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]bool{"deleted": true})
}

// Categories
func (h *Handler) ListCategories(c echo.Context) error {
	cats, err := h.Repo.ListCategories(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, cats)
}

func (h *Handler) GetCategory(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	cat, err := h.Repo.GetCategory(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "not found"})
	}
	return c.JSON(http.StatusOK, cat)
}

type categoryReq struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func (h *Handler) CreateCategory(c echo.Context) error {
	var req categoryReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	cat, err := h.Repo.CreateCategory(c.Request().Context(), req.Name, req.Description)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusCreated, cat)
}

// Products
func (h *Handler) ListProducts(c echo.Context) error {
	prods, err := h.Repo.ListProducts(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, prods)
}

func (h *Handler) GetProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	p, err := h.Repo.GetProduct(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "not found"})
	}
	return c.JSON(http.StatusOK, p)
}

type productReq struct {
	Name       string  `json:"name"`
	Price      float64 `json:"price"`
	CategoryID *int    `json:"category_id"`
}

func (h *Handler) CreateProduct(c echo.Context) error {
	var req productReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	p, err := h.Repo.CreateProduct(c.Request().Context(), req.Name, req.Price, req.CategoryID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusCreated, p)
}

func (h *Handler) UpdateProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	var req productReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	p, err := h.Repo.UpdateProduct(c.Request().Context(), id, req.Name, req.Price, req.CategoryID)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, p)
}

func (h *Handler) DeleteProduct(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.Repo.DeleteProduct(c.Request().Context(), id); err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, map[string]bool{"deleted": true})
}

// Orders
func (h *Handler) ListOrders(c echo.Context) error {
	orders, err := h.Repo.ListOrders(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, orders)
}

func (h *Handler) GetOrder(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	o, err := h.Repo.GetOrder(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusNotFound, map[string]string{"error": "not found"})
	}
	return c.JSON(http.StatusOK, o)
}

type orderReq struct {
	UserID *int    `json:"user_id"`
	Status string  `json:"status"`
	Total  float64 `json:"total"`
}

func (h *Handler) CreateOrder(c echo.Context) error {
	var req orderReq
	if err := c.Bind(&req); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": err.Error()})
	}
	o, err := h.Repo.CreateOrder(c.Request().Context(), req.UserID, req.Status, req.Total)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusCreated, o)
}

func (h *Handler) ListOrderItems(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	items, err := h.Repo.ListOrderItems(c.Request().Context(), id)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, items)
}

// Stats
func (h *Handler) StatsSummary(c echo.Context) error {
	s, err := h.Repo.Stats(c.Request().Context())
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, s)
}

// Search
func (h *Handler) Search(c echo.Context) error {
	q := c.QueryParam("q")
	prods, err := h.Repo.SearchProducts(c.Request().Context(), q)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}
	return c.JSON(http.StatusOK, prods)
}

