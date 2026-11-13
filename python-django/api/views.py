import json

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .models import Category, Order, OrderItem, Product, User


def _json_body(request):
    if not request.body:
        return {}
    try:
        return json.loads(request.body.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {}


def _get_or_404(model, pk):
    obj = model.objects.filter(pk=pk).first()
    if obj is None:
        return None, JsonResponse({"error": "not found"}, status=404)
    return obj, None


def _user(u):
    return {
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "created_at": u.created_at,
    }


def _category(c):
    return {
        "id": c.id,
        "name": c.name,
        "description": c.description if c.description is not None else "",
    }


def _product(p):
    return {
        "id": p.id,
        "name": p.name,
        "price": float(p.price),
        "category_id": p.category_id,
        "created_at": p.created_at,
    }


def _order(o):
    return {
        "id": o.id,
        "user_id": o.user_id,
        "status": o.status,
        "total": float(o.total),
        "created_at": o.created_at,
    }


def _order_item(oi):
    return {
        "id": oi.id,
        "order_id": oi.order_id,
        "product_id": oi.product_id,
        "quantity": oi.quantity,
        "price": float(oi.price),
    }


@csrf_exempt
def health(request):
    return JsonResponse({"status": "ok"})


@csrf_exempt
def not_found(request, exception=None):
    return JsonResponse({"error": "not found"}, status=404)


# Users
@csrf_exempt
def users_list(request):
    if request.method == "GET":
        users = User.objects.all().order_by("id")
        return JsonResponse([_user(u) for u in users], safe=False)
    if request.method == "POST":
        data = _json_body(request)
        u = User.objects.create(name=data.get("name"), email=data.get("email"))
        return JsonResponse(_user(u), status=201)
    return JsonResponse({"detail": "method not allowed"}, status=405)


@csrf_exempt
def user_detail(request, pk):
    u, err = _get_or_404(User, pk)
    if err:
        return err
    if request.method == "GET":
        return JsonResponse(_user(u))
    if request.method == "PUT":
        data = _json_body(request)
        u.name = data.get("name", u.name)
        u.email = data.get("email", u.email)
        u.save()
        return JsonResponse(_user(u))
    if request.method == "DELETE":
        u.delete()
        return JsonResponse({"deleted": True})
    return JsonResponse({"detail": "method not allowed"}, status=405)


# Categories
@csrf_exempt
def categories_list(request):
    if request.method == "GET":
        cats = Category.objects.all().order_by("id")
        return JsonResponse([_category(c) for c in cats], safe=False)
    if request.method == "POST":
        data = _json_body(request)
        c = Category.objects.create(
            name=data.get("name"), description=data.get("description")
        )
        return JsonResponse(_category(c), status=201)
    return JsonResponse({"detail": "method not allowed"}, status=405)


@csrf_exempt
def category_detail(request, pk):
    c, err = _get_or_404(Category, pk)
    if err:
        return err
    if request.method == "GET":
        return JsonResponse(_category(c))
    return JsonResponse({"detail": "method not allowed"}, status=405)


# Products
@csrf_exempt
def products_list(request):
    if request.method == "GET":
        prods = Product.objects.all().order_by("id")
        return JsonResponse([_product(p) for p in prods], safe=False)
    if request.method == "POST":
        data = _json_body(request)
        p = Product.objects.create(
            name=data.get("name"),
            price=data.get("price"),
            category_id=data.get("category_id"),
        )
        return JsonResponse(_product(p), status=201)
    return JsonResponse({"detail": "method not allowed"}, status=405)


@csrf_exempt
def product_detail(request, pk):
    p, err = _get_or_404(Product, pk)
    if err:
        return err
    if request.method == "GET":
        return JsonResponse(_product(p))
    if request.method == "PUT":
        data = _json_body(request)
        p.name = data.get("name", p.name)
        if "price" in data:
            p.price = data.get("price")
        if "category_id" in data:
            p.category_id = data.get("category_id")
        p.save()
        return JsonResponse(_product(p))
    if request.method == "DELETE":
        p.delete()
        return JsonResponse({"deleted": True})
    return JsonResponse({"detail": "method not allowed"}, status=405)


# Orders
@csrf_exempt
def orders_list(request):
    if request.method == "GET":
        ords = Order.objects.all().order_by("id")
        return JsonResponse([_order(o) for o in ords], safe=False)
    if request.method == "POST":
        data = _json_body(request)
        o = Order.objects.create(
            user_id=data.get("user_id"),
            status=data.get("status"),
            total=data.get("total"),
        )
        return JsonResponse(_order(o), status=201)
    return JsonResponse({"detail": "method not allowed"}, status=405)


@csrf_exempt
def order_detail(request, pk):
    o, err = _get_or_404(Order, pk)
    if err:
        return err
    if request.method == "GET":
        return JsonResponse(_order(o))
    return JsonResponse({"detail": "method not allowed"}, status=405)


@csrf_exempt
def order_items(request, pk):
    items = OrderItem.objects.filter(order_id=pk).order_by("id")
    return JsonResponse([_order_item(oi) for oi in items], safe=False)


# Stats
@csrf_exempt
def stats_summary(request):
    from django.db.models import Sum

    users_count = User.objects.count()
    products_count = Product.objects.count()
    orders_count = Order.objects.count()
    revenue = Order.objects.aggregate(total=Sum("total"))["total"]
    return JsonResponse(
        {
            "users": users_count,
            "products": products_count,
            "orders": orders_count,
            "revenue": float(revenue) if revenue is not None else 0.0,
        }
    )


# Search
@csrf_exempt
def search_products(request):
    q = request.GET.get("q", "")
    prods = Product.objects.filter(name__icontains=q).order_by("id")
    return JsonResponse([_product(p) for p in prods], safe=False)
