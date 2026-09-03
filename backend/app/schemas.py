from datetime import date
from uuid import UUID

from pydantic import BaseModel


class VehicleBase(BaseModel):
    plate_number: str
    brand: str
    model: str
    year: int
    daily_rate: int
    status: str


class VehicleCreate(VehicleBase):
    pass


class VehicleResponse(VehicleBase):
    id: int

    class Config:
        orm_mode = True


class CustomerBase(BaseModel):
    first_name: str
    last_name: str
    email: str
    phone: str
    license_number: str
    address: str


class CustomerCreate(CustomerBase):
    pass


class CustomerResponse(CustomerBase):
    id: int

    class Config:
        from_attributes = True

class ReservationBase(BaseModel):
    customer_id: int
    vehicle_id: int
    pickup_date: date
    return_date: date
    status: str = "Pending"


class ReservationCreate(ReservationBase):
    pass


class ReservationResponse(ReservationBase):
    id: int

    class Config:
        from_attributes = True


class RentalBase(BaseModel):
    reservation_id: int
    start_date: date
    actual_return_date: date | None = None
    total_amount: float
    status: str = "Active"


class RentalCreate(RentalBase):
    pass


class RentalResponse(RentalBase):
    id: int

    class Config:
        from_attributes = True


class PaymentBase(BaseModel):
    rental_id: int
    amount: float
    payment_method: str
    payment_date: date
    status: str = "Paid"


class PaymentCreate(PaymentBase):
    pass


class PaymentResponse(PaymentBase):
    id: int

    class Config:
        from_attributes = True

# =========================
# USER
# =========================

class UserCreate(BaseModel):
    name: str
    email: str
    password: str


class UserResponse(BaseModel):
    id: UUID
    name: str
    email: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    email: str
    password: str        