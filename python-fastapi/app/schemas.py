from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator


class UserBase(BaseModel):
    name: str
    email: str


class UserCreate(UserBase):
    pass


class UserUpdate(UserBase):
    pass


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    created_at: datetime

    @field_validator("created_at", mode="before")
    @classmethod
    def _ensure_tz(cls, value):
        if isinstance(value, datetime) and value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value


class CategoryCreate(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str


class ProductCreate(BaseModel):
    name: str
    price: float
    category_id: Optional[int] = None


class ProductUpdate(ProductCreate):
    pass


class ProductOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    price: float
    category_id: Optional[int] = None
    created_at: datetime

    @field_validator("created_at", mode="before")
    @classmethod
    def _ensure_tz(cls, value):
        if isinstance(value, datetime) and value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value


class OrderCreate(BaseModel):
    user_id: Optional[int] = None
    status: str
    total: float


class OrderOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: Optional[int] = None
    status: str
    total: float
    created_at: datetime

    @field_validator("created_at", mode="before")
    @classmethod
    def _ensure_tz(cls, value):
        if isinstance(value, datetime) and value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc)
        return value


class OrderItemOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    order_id: int
    product_id: Optional[int] = None
    quantity: int
    price: float


class StatsOut(BaseModel):
    users: int
    products: int
    orders: int
    revenue: float