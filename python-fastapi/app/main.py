import os

from fastapi import FastAPI

from app.routers import categories, health, orders, products, search, stats, users

app = FastAPI(title="python-fastapi")

app.include_router(health.router)

for r in (users, categories, products, orders, stats, search):
    app.include_router(r.router, prefix="/api")


def main():
    import uvicorn

    port = int(os.getenv("PORT", "8015"))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port)


if __name__ == "__main__":
    main()