from fastapi import APIRouter, Depends, HTTPException

from app.crud import (
    create_product,
    delete_product,
    get_product,
    list_products,
    update_product,
)
from app.database import get_db
from app.schemas import ProductCreate, ProductOut, ProductUpdate

router = APIRouter()


@router.get("/products", response_model=list[ProductOut])
def list_all(db=Depends(get_db)):
    return [ProductOut(**r) for r in list_products(db)]


@router.get("/products/{product_id}", response_model=ProductOut)
def get_one(product_id: int, db=Depends(get_db)):
    row = get_product(db, product_id)
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return ProductOut(**row)


@router.post("/products", response_model=ProductOut, status_code=201)
def create(body: ProductCreate, db=Depends(get_db)):
    row = create_product(db, body.name, body.price, body.category_id)
    return ProductOut(**row)


@router.put("/products/{product_id}", response_model=ProductOut)
def update(product_id: int, body: ProductUpdate, db=Depends(get_db)):
    row = update_product(db, product_id, body.name, body.price, body.category_id)
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return ProductOut(**row)


@router.delete("/products/{product_id}")
def delete(product_id: int, db=Depends(get_db)):
    delete_product(db, product_id)
    return {"deleted": True}