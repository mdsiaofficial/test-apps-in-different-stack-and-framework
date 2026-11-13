from django.urls import include, path

from api.views import not_found

handler404 = not_found

urlpatterns = [
    path("", include("api.urls")),
]
