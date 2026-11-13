from fastapi import APIRouter, Depends, HTTPException

from app.crud import (
    create_user,
    delete_user,
    get_user,
    list_users,
    update_user,
)
from app.database import get_db
from app.schemas import UserCreate, UserOut, UserUpdate

router = APIRouter()


@router.get("/users", response_model=list[UserOut])
def list_all(db=Depends(get_db)):
    return [UserOut(**r) for r in list_users(db)]


@router.get("/users/{user_id}", response_model=UserOut)
def get_one(user_id: int, db=Depends(get_db)):
    row = get_user(db, user_id)
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return UserOut(**row)


@router.post("/users", response_model=UserOut, status_code=201)
def create(body: UserCreate, db=Depends(get_db)):
    row = create_user(db, body.name, body.email)
    return UserOut(**row)


@router.put("/users/{user_id}", response_model=UserOut)
def update(user_id: int, body: UserUpdate, db=Depends(get_db)):
    row = update_user(db, user_id, body.name, body.email)
    if not row:
        raise HTTPException(status_code=404, detail="not found")
    return UserOut(**row)


@router.delete("/users/{user_id}")
def delete(user_id: int, db=Depends(get_db)):
    delete_user(db, user_id)
    return {"deleted": True}