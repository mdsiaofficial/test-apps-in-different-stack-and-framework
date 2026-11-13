from fastapi import APIRouter, Depends, Query

from app.crud import search_products
from app.database import get_db
from app.schemas import ProductOut

router = APIRouter()


@router.get("/search", response_model=list[ProductOut])
def search(q: str = Query(default=""), db=Depends(get_db)):
    return [ProductOut(**r) for r in search_products(db, q)]