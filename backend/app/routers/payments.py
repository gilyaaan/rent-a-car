from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.payment import Payment
from app.models.rental import Rental
from app.models.reservation import Reservation
from app.models.customer import Customer
from app.models.vehicle import Vehicle
from app.models.user import User

from app.dependencies import get_current_user


router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


# ==========================================================
# CUSTOMER HELPER
# ==========================================================

def get_user_customer(
    current_user: User,
    db: Session
):
    customer = (
        db.query(Customer)
        .filter(
            Customer.user_id == current_user.id
        )
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found"
        )

    return customer


# ==========================================================
# HELPER: GET RENTAL AND CHECK OWNERSHIP
# ==========================================================

def get_owned_rental(
    rental_id: int,
    current_user: User,
    db: Session
):

    rental = (
        db.query(Rental)
        .filter(
            Rental.id == rental_id
        )
        .first()
    )

    if not rental:
        raise HTTPException(
            status_code=404,
            detail="Rental not found"
        )

    # ======================================================
    # SUPER ADMIN / ADMIN
    # ======================================================

    if current_user.role in ["super_admin", "admin"]:
        return rental

    # ======================================================
    # GET RESERVATION
    # ======================================================

    reservation = (
        db.query(Reservation)
        .filter(
            Reservation.id == rental.reservation_id
        )
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Reservation associated with rental not found"
        )

    # ======================================================
    # CAR OWNER
    # ======================================================

    if current_user.role == "car_owner":

        vehicle = (
            db.query(Vehicle)
            .filter(
                Vehicle.id == reservation.vehicle_id
            )
            .first()
        )

        if not vehicle:
            raise HTTPException(
                status_code=404,
                detail="Vehicle not found"
            )

        if vehicle.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have permission to use this rental"
            )

        return rental

    # ======================================================
    # CUSTOMER
    # ======================================================

    customer = get_user_customer(
        current_user,
        db
    )

    if reservation.customer_id != customer.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to use this rental"
        )

    return rental


# ==========================================================
# HELPER: GET PAYMENT WITH OWNERSHIP CHECK
# ==========================================================

def get_owned_payment(
    payment_id: int,
    current_user: User,
    db: Session
):

    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id
        )
        .first()
    )

    if not payment:
        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    # Super Admin / Admin
    if current_user.role in ["super_admin", "admin"]:
        return payment

    # Customer / Car Owner
    get_owned_rental(
        payment.rental_id,
        current_user,
        db
    )

    return payment


# ==========================================================
# PAYMENT RESPONSE
# ==========================================================

def payment_response(
    payment: Payment,
    db: Session
):

    rental = (
        db.query(Rental)
        .filter(
            Rental.id == payment.rental_id
        )
        .first()
    )

    reservation = None
    customer = None
    vehicle = None

    if rental:

        reservation = (
            db.query(Reservation)
            .filter(
                Reservation.id == rental.reservation_id
            )
            .first()
        )

        if reservation:

            customer = (
                db.query(Customer)
                .filter(
                    Customer.id == reservation.customer_id
                )
                .first()
            )

            vehicle = (
                db.query(Vehicle)
                .filter(
                    Vehicle.id == reservation.vehicle_id
                )
                .first()
            )

    return {
        "id": payment.id,

        "rental_id": payment.rental_id,

        "amount": payment.amount,

        "payment_method": payment.payment_method,

        "payment_date": payment.payment_date,

        "status": payment.status,

        "rental": {
            "id": rental.id,
            "start_date": rental.start_date,
            "actual_return_date": rental.actual_return_date,
            "total_amount": rental.total_amount,
            "status": rental.status,
        } if rental else None,

        "customer": {
            "id": customer.id,
            "first_name": customer.first_name,
            "last_name": customer.last_name,
            "email": customer.email,
        } if customer else None,

        "vehicle": {
            "id": vehicle.id,
            "brand": vehicle.brand,
            "model": vehicle.model,
            "plate_number": vehicle.plate_number,
        } if vehicle else None,
    }


# ==========================================================
# GET ALL PAYMENTS
# ==========================================================

@router.get("/")
def get_payments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ======================================================
    # SUPER ADMIN / ADMIN
    # ======================================================

    if current_user.role in ["super_admin", "admin"]:

        payments = (
            db.query(Payment)
            .order_by(Payment.id.desc())
            .all()
        )

    # ======================================================
    # CAR OWNER
    # ======================================================

    elif current_user.role == "car_owner":

        payments = (
            db.query(Payment)
            .join(
                Rental,
                Payment.rental_id == Rental.id
            )
            .join(
                Reservation,
                Rental.reservation_id == Reservation.id
            )
            .join(
                Vehicle,
                Reservation.vehicle_id == Vehicle.id
            )
            .filter(
                Vehicle.owner_id == current_user.id
            )
            .order_by(Payment.id.desc())
            .all()
        )

    # ======================================================
    # CUSTOMER
    # ======================================================

    else:

        customer = get_user_customer(
            current_user,
            db
        )

        payments = (
            db.query(Payment)
            .join(
                Rental,
                Payment.rental_id == Rental.id
            )
            .join(
                Reservation,
                Rental.reservation_id == Reservation.id
            )
            .filter(
                Reservation.customer_id == customer.id
            )
            .order_by(Payment.id.desc())
            .all()
        )

    return [
        payment_response(
            payment,
            db
        )
        for payment in payments
    ]


# ==========================================================
# GET PAYMENT BY ID
# ==========================================================

@router.get("/{payment_id}")
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    payment = get_owned_payment(
        payment_id,
        current_user,
        db
    )

    return payment_response(
        payment,
        db
    )


# ==========================================================
# CREATE PAYMENT
# ==========================================================

@router.post("/")
def create_payment(
    payment: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ======================================================
    # RENTAL
    # ======================================================

    rental_id = payment.get("rental_id")

    if not rental_id:

        raise HTTPException(
            status_code=400,
            detail="Rental ID is required"
        )

    rental = get_owned_rental(
        rental_id,
        current_user,
        db
    )

    # ======================================================
    # AMOUNT
    # ======================================================

    amount = payment.get("amount")

    if amount is None:

        raise HTTPException(
            status_code=400,
            detail="Payment amount is required"
        )

    try:

        amount = float(amount)

    except (ValueError, TypeError):

        raise HTTPException(
            status_code=400,
            detail="Payment amount must be a number"
        )

    if amount <= 0:

        raise HTTPException(
            status_code=400,
            detail="Payment amount must be greater than zero"
        )

    # ======================================================
    # PAYMENT METHOD
    # ======================================================

    payment_method = payment.get(
        "payment_method"
    )

    if not payment_method:

        raise HTTPException(
            status_code=400,
            detail="Payment method is required"
        )

    payment_method = str(
        payment_method
    ).strip()

    # ======================================================
    # PAYMENT DATE
    # ======================================================

    payment_date = payment.get(
        "payment_date"
    )

    if payment_date:

        try:

            payment_date = date.fromisoformat(
                payment_date
            )

        except (ValueError, TypeError):

            raise HTTPException(
                status_code=400,
                detail="Payment date must use YYYY-MM-DD format"
            )

    else:

        payment_date = date.today()

    # ======================================================
    # CREATE PAYMENT
    # ======================================================

    new_payment = Payment(
        rental_id=rental.id,
        amount=amount,
        payment_method=payment_method,
        payment_date=payment_date,
        status="Paid"
    )

    db.add(new_payment)

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to create payment"
        )

    db.refresh(new_payment)

    return payment_response(
        new_payment,
        db
    )


# ==========================================================
# UPDATE PAYMENT
# ==========================================================

@router.put("/{payment_id}")
def update_payment(
    payment_id: int,
    payment: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ======================================================
    # ADMIN / SUPER ADMIN ONLY
    # ======================================================

    if current_user.role not in [
        "admin",
        "super_admin"
    ]:

        raise HTTPException(
            status_code=403,
            detail="Administrator access required"
        )

    existing_payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id
        )
        .first()
    )

    if not existing_payment:

        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    # ======================================================
    # RENTAL
    # ======================================================

    if "rental_id" in payment:

        rental_id = payment.get(
            "rental_id"
        )

        rental = (
            db.query(Rental)
            .filter(
                Rental.id == rental_id
            )
            .first()
        )

        if not rental:

            raise HTTPException(
                status_code=404,
                detail="Rental not found"
            )

        existing_payment.rental_id = rental_id

    # ======================================================
    # AMOUNT
    # ======================================================

    if "amount" in payment:

        try:

            amount = float(
                payment["amount"]
            )

        except (ValueError, TypeError):

            raise HTTPException(
                status_code=400,
                detail="Payment amount must be a number"
            )

        if amount <= 0:

            raise HTTPException(
                status_code=400,
                detail="Payment amount must be greater than zero"
            )

        existing_payment.amount = amount

    # ======================================================
    # PAYMENT METHOD
    # ======================================================

    if "payment_method" in payment:

        payment_method = payment.get(
            "payment_method"
        )

        if not payment_method:

            raise HTTPException(
                status_code=400,
                detail="Payment method cannot be empty"
            )

        existing_payment.payment_method = (
            str(payment_method).strip()
        )

    # ======================================================
    # PAYMENT DATE
    # ======================================================

    if "payment_date" in payment:

        try:

            existing_payment.payment_date = (
                date.fromisoformat(
                    payment["payment_date"]
                )
            )

        except (ValueError, TypeError):

            raise HTTPException(
                status_code=400,
                detail="Payment date must use YYYY-MM-DD format"
            )

    # ======================================================
    # STATUS
    # ======================================================

    if "status" in payment:

        allowed_statuses = [
            "Paid",
            "Pending",
            "Failed",
            "Refunded"
        ]

        new_status = payment.get(
            "status"
        )

        if new_status not in allowed_statuses:

            raise HTTPException(
                status_code=400,
                detail="Invalid payment status"
            )

        existing_payment.status = new_status

    # ======================================================
    # SAVE
    # ======================================================

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to update payment"
        )

    db.refresh(existing_payment)

    return payment_response(
        existing_payment,
        db
    )


# ==========================================================
# DELETE PAYMENT
# ==========================================================

@router.delete("/{payment_id}")
def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ======================================================
    # ADMIN / SUPER ADMIN ONLY
    # ======================================================

    if current_user.role not in [
        "admin",
        "super_admin"
    ]:

        raise HTTPException(
            status_code=403,
            detail="Administrator access required"
        )

    payment = (
        db.query(Payment)
        .filter(
            Payment.id == payment_id
        )
        .first()
    )

    if not payment:

        raise HTTPException(
            status_code=404,
            detail="Payment not found"
        )

    db.delete(payment)

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to delete payment"
        )

    return {
        "message": f"Payment {payment_id} deleted successfully"
    }