from typing import Optional

from psycopg2.extras import RealDictCursor


def list_users(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, name, email, created_at FROM users ORDER BY id")
        return [dict(r) for r in cur.fetchall()]


def get_user(conn, user_id: int):
    with conn.cursor() as cur:
        cur.execute("SELECT id, name, email, created_at FROM users WHERE id = %s", (user_id,))
        row = cur.fetchone()
        return dict(row) if row else None


def create_user(conn, name: str, email: str):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO users (name, email) VALUES (%s, %s) RETURNING id, name, email, created_at",
            (name, email),
        )
        row = cur.fetchone()
        conn.commit()
        return dict(row)


def update_user(conn, user_id: int, name: str, email: str):
    with conn.cursor() as cur:
        cur.execute(
            "UPDATE users SET name = %s, email = %s WHERE id = %s RETURNING id, name, email, created_at",
            (name, email, user_id),
        )
        row = cur.fetchone()
        conn.commit()
        return dict(row) if row else None


def delete_user(conn, user_id: int):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM users WHERE id = %s", (user_id,))
        conn.commit()


def list_categories(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, name, COALESCE(description, '') AS description FROM categories ORDER BY id")
        return [dict(r) for r in cur.fetchall()]


def get_category(conn, category_id: int):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, name, COALESCE(description, '') AS description FROM categories WHERE id = %s",
            (category_id,),
        )
        row = cur.fetchone()
        return dict(row) if row else None


def create_category(conn, name: str, description: Optional[str]):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO categories (name, description) VALUES (%s, %s) RETURNING id, name, COALESCE(description, '') AS description",
            (name, description),
        )
        row = cur.fetchone()
        conn.commit()
        return dict(row)


def list_products(conn):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, name, price::float8 AS price, category_id, created_at FROM products ORDER BY id"
        )
        return [dict(r) for r in cur.fetchall()]


def get_product(conn, product_id: int):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE id = %s",
            (product_id,),
        )
        row = cur.fetchone()
        return dict(row) if row else None


def create_product(conn, name: str, price: float, category_id: Optional[int]):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO products (name, price, category_id) VALUES (%s, %s, %s) RETURNING id, name, price::float8 AS price, category_id, created_at",
            (name, price, category_id),
        )
        row = cur.fetchone()
        conn.commit()
        return dict(row)


def update_product(conn, product_id: int, name: str, price: float, category_id: Optional[int]):
    with conn.cursor() as cur:
        cur.execute(
            "UPDATE products SET name = %s, price = %s, category_id = %s WHERE id = %s RETURNING id, name, price::float8 AS price, category_id, created_at",
            (name, price, category_id, product_id),
        )
        row = cur.fetchone()
        conn.commit()
        return dict(row) if row else None


def delete_product(conn, product_id: int):
    with conn.cursor() as cur:
        cur.execute("DELETE FROM products WHERE id = %s", (product_id,))
        conn.commit()


def list_orders(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, user_id, status, total::float8 AS total, created_at FROM orders ORDER BY id")
        return [dict(r) for r in cur.fetchall()]


def get_order(conn, order_id: int):
    with conn.cursor() as cur:
        cur.execute("SELECT id, user_id, status, total::float8 AS total, created_at FROM orders WHERE id = %s", (order_id,))
        row = cur.fetchone()
        return dict(row) if row else None


def create_order(conn, user_id: Optional[int], status: str, total: float):
    with conn.cursor() as cur:
        cur.execute(
            "INSERT INTO orders (user_id, status, total) VALUES (%s, %s, %s) RETURNING id, user_id, status, total::float8 AS total, created_at",
            (user_id, status, total),
        )
        row = cur.fetchone()
        conn.commit()
        return dict(row)


def list_order_items(conn, order_id: int):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, order_id, product_id, quantity, price::float8 AS price FROM order_items WHERE order_id = %s ORDER BY id",
            (order_id,),
        )
        return [dict(r) for r in cur.fetchall()]


def stats_summary(conn):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT (SELECT COUNT(*)::int FROM users) AS users, "
            "(SELECT COUNT(*)::int FROM products) AS products, "
            "(SELECT COUNT(*)::int FROM orders) AS orders, "
            "COALESCE((SELECT SUM(total) FROM orders), 0)::float8 AS revenue"
        )
        row = cur.fetchone()
        return dict(row)


def search_products(conn, q: str):
    with conn.cursor() as cur:
        cur.execute(
            "SELECT id, name, price::float8 AS price, category_id, created_at FROM products WHERE name ILIKE %s ORDER BY id",
            ("%" + q + "%",),
        )
        return [dict(r) for r in cur.fetchall()]