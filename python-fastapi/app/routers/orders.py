from fastapi import APIRouter, Depends, HTTPException

from app.crud import create_order, get_order, list_order_items, list_orders
from app.database import get_db
from app.schemas import OrderCreate, OrderItemOut, OrderOut

router = APIRouter()


@router.get("/orders", response_model=list[OrderOut])
def list_all(db=Depends(get_db)):
    return [OrderOut(**r) for r in list_orders(db)]


@router.get("/orders/{order_id}", response_model=OrderOut)
def get_one(order_id: int, db=Depends(get_db)):
    row = get_order(db, order_id)
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return OrderOut(**row)


@router.post("/orders", response_model=OrderOut, status_code=201)
def create(body: OrderCreate, db=Depends(get_db)):
    row = create_order(db, body.user_id, body.status, body.total)
    return OrderOut(**row)


@router.get("/orders/{order_id}/items", response_model=list[OrderItemOut])
def items(order_id: int, db=Depends(get_db)):
    return [OrderItemOut(**r) for r in list_order_items(db, order_id)]