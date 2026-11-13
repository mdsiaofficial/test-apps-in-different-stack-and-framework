from fastapi import APIRouter, Depends, HTTPException

from app.crud import create_category, get_category, list_categories
from app.database import get_db
from app.schemas import CategoryCreate, CategoryOut

router = APIRouter()


@router.get("/categories", response_model=list[CategoryOut])
def list_all(db=Depends(get_db)):
    return [CategoryOut(**r) for r in list_categories(db)]


@router.get("/categories/{category_id}", response_model=CategoryOut)
def get_one(category_id: int, db=Depends(get_db)):
    row = get_category(db, category_id)
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return CategoryOut(**row)


@router.post("/categories", response_model=CategoryOut, status_code=201)
def create(body: CategoryCreate, db=Depends(get_db)):
    row = create_category(db, body.name, body.description)
    return CategoryOut(**row)