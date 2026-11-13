from django.urls import path

from . import views

urlpatterns = [
    path("health", views.health),
    path("api/users", views.users_list),
    path("api/users/<int:pk>", views.user_detail),
    path("api/categories", views.categories_list),
    path("api/categories/<int:pk>", views.category_detail),
    path("api/products", views.products_list),
    path("api/products/<int:pk>", views.product_detail),
    path("api/orders", views.orders_list),
    path("api/orders/<int:pk>", views.order_detail),
    path("api/orders/<int:pk>/items", views.order_items),
    path("api/stats/summary", views.stats_summary),
    path("api/search", views.search_products),
]
