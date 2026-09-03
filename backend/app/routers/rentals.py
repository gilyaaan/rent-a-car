from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.rental import Rental
from app.models.reservation import Reservation
from app.models.customer import Customer
from app.models.vehicle import Vehicle
from app.models.user import User

from app.dependencies import get_current_user


router = APIRouter(
    prefix="/rentals",
    tags=["Rentals"]
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
# RESERVATION OWNERSHIP
# ==========================================================

def get_owned_reservation(
    reservation_id: int,
    current_user: User,
    db: Session
):

    reservation = (
        db.query(Reservation)
        .filter(
            Reservation.id == reservation_id
        )
        .first()
    )

    if not reservation:
        raise HTTPException(
            status_code=404,
            detail="Reservation not found"
        )

    # ======================================================
    # SUPER ADMIN / ADMIN
    # ======================================================

    if current_user.role in ["super_admin", "admin"]:
        return reservation

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
                detail="You do not have access to this reservation"
            )

        return reservation

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
            detail="You do not have access to this reservation"
        )

    return reservation


# ==========================================================
# RENTAL OWNERSHIP
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
    # ASSOCIATED RESERVATION
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
            detail="Associated reservation not found"
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
                detail="You do not have access to this rental"
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
            detail="You do not have access to this rental"
        )

    return rental


# ==========================================================
# RENTAL RESPONSE
# ==========================================================

def rental_response(
    rental: Rental,
    db: Session
):

    reservation = (
        db.query(Reservation)
        .filter(
            Reservation.id == rental.reservation_id
        )
        .first()
    )

    customer = None
    vehicle = None

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
        "id": rental.id,

        "reservation_id": rental.reservation_id,

        "reservation": {
            "id": reservation.id,
            "customer_id": reservation.customer_id,
            "vehicle_id": reservation.vehicle_id,
            "pickup_date": reservation.pickup_date,
            "return_date": reservation.return_date,
            "status": reservation.status,
        } if reservation else None,

        "customer": {
            "id": customer.id,
            "first_name": customer.first_name,
            "last_name": customer.last_name,
            "email": customer.email,
            "phone": customer.phone,
        } if customer else None,

        "vehicle": {
            "id": vehicle.id,
            "brand": vehicle.brand,
            "model": vehicle.model,
            "year": vehicle.year,
            "plate_number": vehicle.plate_number,
            "daily_rate": vehicle.daily_rate,
        } if vehicle else None,

        "start_date": rental.start_date,
        "actual_return_date": rental.actual_return_date,
        "total_amount": rental.total_amount,
        "status": rental.status,
    }


# ==========================================================
# GET ALL RENTALS
# ==========================================================

@router.get("/")
def get_rentals(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # ======================================================
    # SUPER ADMIN / ADMIN
    # ======================================================

    if current_user.role in ["super_admin", "admin"]:

        rentals = (
            db.query(Rental)
            .order_by(Rental.id.desc())
            .all()
        )

    # ======================================================
    # CAR OWNER
    # ======================================================

    elif current_user.role == "car_owner":

        rentals = (
            db.query(Rental)
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
            .order_by(Rental.id.desc())
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

        rentals = (
            db.query(Rental)
            .join(
                Reservation,
                Rental.reservation_id == Reservation.id
            )
            .filter(
                Reservation.customer_id == customer.id
            )
            .order_by(Rental.id.desc())
            .all()
        )

    return [
        rental_response(
            rental,
            db
        )
        for rental in rentals
    ]


# ==========================================================
# GET SINGLE RENTAL
# ==========================================================

@router.get("/{rental_id}")
def get_rental(
    rental_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    rental = get_owned_rental(
        rental_id,
        current_user,
        db
    )

    return rental_response(
        rental,
        db
    )


# ==========================================================
# CREATE RENTAL
# ==========================================================

@router.post("/")
def create_rental(
    reservation_id: int,
    start_date: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # ======================================================
    # CAR OWNER CANNOT CREATE RENTALS
    # ======================================================

    if current_user.role == "car_owner":

        raise HTTPException(
            status_code=403,
            detail="Car owners cannot create customer rentals"
        )

    reservation = get_owned_reservation(
        reservation_id,
        current_user,
        db
    )

    # ======================================================
    # RESERVATION STATUS
    # ======================================================

    allowed_statuses = [
        "Pending",
        "Confirmed",
        "Approved"
    ]

    if reservation.status not in allowed_statuses:

        raise HTTPException(
            status_code=400,
            detail="Reservation cannot be converted into a rental"
        )

    # ======================================================
    # PREVENT DUPLICATE RENTAL
    # ======================================================

    existing_rental = (
        db.query(Rental)
        .filter(
            Rental.reservation_id == reservation_id
        )
        .first()
    )

    if existing_rental:

        raise HTTPException(
            status_code=400,
            detail="Rental already exists for this reservation"
        )

    # ======================================================
    # VEHICLE
    # ======================================================

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

    if vehicle.status != "Available":

        raise HTTPException(
            status_code=400,
            detail="Vehicle is not available"
        )

    # ======================================================
    # START DATE
    # ======================================================

    try:

        rental_start_date = date.fromisoformat(
            start_date
        )

    except (ValueError, TypeError):

        raise HTTPException(
            status_code=400,
            detail="Invalid start_date format. Use YYYY-MM-DD"
        )

    if rental_start_date < reservation.pickup_date:

        raise HTTPException(
            status_code=400,
            detail="Rental start date cannot be before pickup date"
        )

    if rental_start_date > reservation.return_date:

        raise HTTPException(
            status_code=400,
            detail="Rental start date cannot be after return date"
        )

    # ======================================================
    # CALCULATE RENTAL DAYS
    # ======================================================

    rental_days = (
        reservation.return_date -
        rental_start_date
    ).days

    rental_days = max(
        rental_days,
        1
    )

    total_amount = (
        rental_days *
        vehicle.daily_rate
    )

    # ======================================================
    # CREATE RENTAL
    # ======================================================

    new_rental = Rental(
        reservation_id=reservation.id,
        start_date=rental_start_date,
        actual_return_date=None,
        total_amount=total_amount,
        status="Active"
    )

    db.add(new_rental)

    reservation.status = "Confirmed"

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to create rental"
        )

    db.refresh(new_rental)

    return rental_response(
        new_rental,
        db
    )


# ==========================================================
# UPDATE RENTAL
# ==========================================================

@router.put("/{rental_id}")
def update_rental(
    rental_id: int,
    reservation_id: int | None = None,
    start_date: str | None = None,
    status: str | None = None,
    actual_return_date: str | None = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # ======================================================
    # ADMIN / SUPER ADMIN ONLY
    # ======================================================

    if current_user.role not in ["admin", "super_admin"]:

        raise HTTPException(
            status_code=403,
            detail="Administrator access required"
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

    # ======================================================
    # RESERVATION
    # ======================================================

    if reservation_id is not None:

        reservation = (
            db.query(Reservation)
            .filter(
                Reservation.id == reservation_id
            )
            .first()
        )

        if not reservation:

            raise HTTPException(
                status_code=404,
                detail="Reservation not found"
            )

        rental.reservation_id = reservation_id

    else:

        reservation = (
            db.query(Reservation)
            .filter(
                Reservation.id == rental.reservation_id
            )
            .first()
        )

    # ======================================================
    # START DATE
    # ======================================================

    if start_date is not None:

        try:

            rental.start_date = date.fromisoformat(
                start_date
            )

        except (ValueError, TypeError):

            raise HTTPException(
                status_code=400,
                detail="Invalid start_date format. Use YYYY-MM-DD"
            )

    # ======================================================
    # STATUS
    # ======================================================

    if status is not None:

        allowed_statuses = [
            "Active",
            "Completed",
            "Cancelled",
            "Overdue"
        ]

        if status not in allowed_statuses:

            raise HTTPException(
                status_code=400,
                detail="Invalid rental status"
            )

        rental.status = status

    # ======================================================
    # ACTUAL RETURN DATE
    # ======================================================

    if actual_return_date is not None:

        try:

            rental.actual_return_date = (
                date.fromisoformat(
                    actual_return_date
                )
            )

        except (ValueError, TypeError):

            raise HTTPException(
                status_code=400,
                detail="Invalid actual_return_date format. Use YYYY-MM-DD"
            )

    # ======================================================
    # RECALCULATE TOTAL
    # ======================================================

    if reservation and rental.start_date:

        vehicle = (
            db.query(Vehicle)
            .filter(
                Vehicle.id == reservation.vehicle_id
            )
            .first()
        )

        if vehicle:

            rental_days = (
                reservation.return_date -
                rental.start_date
            ).days

            rental_days = max(
                rental_days,
                1
            )

            rental.total_amount = (
                rental_days *
                vehicle.daily_rate
            )

    # ======================================================
    # SAVE
    # ======================================================

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to update rental"
        )

    db.refresh(rental)

    return rental_response(
        rental,
        db
    )


# ==========================================================
# DELETE RENTAL
# ==========================================================

@router.delete("/{rental_id}")
def delete_rental(
    rental_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # ======================================================
    # ADMIN / SUPER ADMIN ONLY
    # ======================================================

    if current_user.role not in ["admin", "super_admin"]:

        raise HTTPException(
            status_code=403,
            detail="Administrator access required"
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

    db.delete(rental)

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to delete rental"
        )

    return {
        "message": f"Rental {rental_id} deleted successfully"
    }