from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.reservation import Reservation
from app.models.customer import Customer
from app.models.vehicle import Vehicle
from app.models.user import User
from app.dependencies import get_current_user


router = APIRouter(
    prefix="/reservations",
    tags=["Reservations"]
)


# ==========================================================
# HELPER: GET CURRENT USER'S CUSTOMER
# ==========================================================

def get_user_customer(
    current_user: User,
    db: Session
):
    customer = (
        db.query(Customer)
        .filter(Customer.user_id == current_user.id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found"
        )

    return customer


# ==========================================================
# HELPER: GET RESERVATION WITH OWNERSHIP CHECK
# ==========================================================

def get_owned_reservation(
    reservation_id: int,
    current_user: User,
    db: Session
):
    reservation = (
        db.query(Reservation)
        .filter(Reservation.id == reservation_id)
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
                detail="You do not have permission to access this reservation"
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
            detail="You do not have permission to access this reservation"
        )

    return reservation


# ==========================================================
# RESPONSE HELPER
# ==========================================================

def reservation_response(
    reservation: Reservation,
    db: Session
):
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
        "id": reservation.id,

        "customer_id": reservation.customer_id,

        "customer": {
            "id": customer.id,
            "first_name": customer.first_name,
            "last_name": customer.last_name,
            "email": customer.email,
            "phone": customer.phone,
        } if customer else None,

        "vehicle_id": reservation.vehicle_id,

        "vehicle": {
            "id": vehicle.id,
            "brand": vehicle.brand,
            "model": vehicle.model,
            "year": vehicle.year,
            "plate_number": vehicle.plate_number,
            "daily_rate": vehicle.daily_rate,
            "status": vehicle.status,
        } if vehicle else None,

        "pickup_date": reservation.pickup_date,
        "return_date": reservation.return_date,
        "status": reservation.status,
    }


# ==========================================================
# GET ALL RESERVATIONS
# ==========================================================

@router.get("/")
def get_reservations(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ======================================================
    # SUPER ADMIN / ADMIN
    # ======================================================

    if current_user.role in ["super_admin", "admin"]:

        reservations = (
            db.query(Reservation)
            .order_by(Reservation.id.desc())
            .all()
        )

    # ======================================================
    # CAR OWNER
    # ======================================================

    elif current_user.role == "car_owner":

        reservations = (
            db.query(Reservation)
            .join(
                Vehicle,
                Reservation.vehicle_id == Vehicle.id
            )
            .filter(
                Vehicle.owner_id == current_user.id
            )
            .order_by(Reservation.id.desc())
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

        reservations = (
            db.query(Reservation)
            .filter(
                Reservation.customer_id == customer.id
            )
            .order_by(Reservation.id.desc())
            .all()
        )

    return [
        reservation_response(
            reservation,
            db
        )
        for reservation in reservations
    ]


# ==========================================================
# GET RESERVATION BY ID
# ==========================================================

@router.get("/{reservation_id}")
def get_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reservation = get_owned_reservation(
        reservation_id,
        current_user,
        db
    )

    return reservation_response(
        reservation,
        db
    )


# ==========================================================
# CREATE RESERVATION
# ==========================================================

@router.post("/")
def create_reservation(
    reservation: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ======================================================
    # CAR OWNER CANNOT CREATE CUSTOMER RESERVATION
    # ======================================================

    if current_user.role == "car_owner":

        raise HTTPException(
            status_code=403,
            detail="Car owners cannot create customer reservations"
        )

    # ======================================================
    # SUPER ADMIN / ADMIN
    # ======================================================

    if current_user.role in ["super_admin", "admin"]:

        customer_id = reservation.get("customer_id")

        if not customer_id:
            raise HTTPException(
                status_code=400,
                detail="Customer ID is required"
            )

        customer = (
            db.query(Customer)
            .filter(
                Customer.id == customer_id
            )
            .first()
        )

        if not customer:
            raise HTTPException(
                status_code=404,
                detail="Customer not found"
            )

    # ======================================================
    # CUSTOMER
    # ======================================================

    else:

        customer = get_user_customer(
            current_user,
            db
        )

        customer_id = customer.id

    # ======================================================
    # VEHICLE
    # ======================================================

    vehicle_id = reservation.get("vehicle_id")

    if not vehicle_id:

        raise HTTPException(
            status_code=400,
            detail="Vehicle ID is required"
        )

    vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id
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
    # DATES
    # ======================================================

    pickup_date = reservation.get("pickup_date")
    return_date = reservation.get("return_date")

    if not pickup_date:

        raise HTTPException(
            status_code=400,
            detail="Pickup date is required"
        )

    if not return_date:

        raise HTTPException(
            status_code=400,
            detail="Return date is required"
        )

    try:

        pickup_date = date.fromisoformat(
            pickup_date
        )

        return_date = date.fromisoformat(
            return_date
        )

    except (ValueError, TypeError):

        raise HTTPException(
            status_code=400,
            detail="Dates must use YYYY-MM-DD format"
        )

    if return_date < pickup_date:

        raise HTTPException(
            status_code=400,
            detail="Return date cannot be before pickup date"
        )

    # ======================================================
    # STATUS
    # ======================================================

    if current_user.role in ["super_admin", "admin"]:

        status = reservation.get(
            "status",
            "Pending"
        )

    else:

        status = "Pending"

    # ======================================================
    # CREATE
    # ======================================================

    new_reservation = Reservation(
        customer_id=customer_id,
        vehicle_id=vehicle_id,
        pickup_date=pickup_date,
        return_date=return_date,
        status=status
    )

    db.add(new_reservation)

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to create reservation"
        )

    db.refresh(new_reservation)

    return reservation_response(
        new_reservation,
        db
    )


# ==========================================================
# UPDATE RESERVATION
# ==========================================================

@router.put("/{reservation_id}")
def update_reservation(
    reservation_id: int,
    reservation: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    existing_reservation = get_owned_reservation(
        reservation_id,
        current_user,
        db
    )

    # ======================================================
    # SUPER ADMIN / ADMIN
    # ======================================================

    if current_user.role in ["super_admin", "admin"]:

        # --------------------------------------------------
        # CUSTOMER
        # --------------------------------------------------

        if "customer_id" in reservation:

            new_customer_id = reservation.get(
                "customer_id"
            )

            customer = (
                db.query(Customer)
                .filter(
                    Customer.id == new_customer_id
                )
                .first()
            )

            if not customer:

                raise HTTPException(
                    status_code=404,
                    detail="Customer not found"
                )

            existing_reservation.customer_id = (
                new_customer_id
            )

        # --------------------------------------------------
        # VEHICLE
        # --------------------------------------------------

        if "vehicle_id" in reservation:

            vehicle_id = reservation.get(
                "vehicle_id"
            )

            vehicle = (
                db.query(Vehicle)
                .filter(
                    Vehicle.id == vehicle_id
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

            existing_reservation.vehicle_id = (
                vehicle_id
            )

        # --------------------------------------------------
        # STATUS
        # --------------------------------------------------

        if "status" in reservation:

            existing_reservation.status = (
                reservation["status"]
            )

    # ======================================================
    # CAR OWNER
    # ======================================================

    elif current_user.role == "car_owner":

        if "customer_id" in reservation:

            raise HTTPException(
                status_code=403,
                detail="Car owners cannot change the customer"
            )

        if "status" in reservation:

            raise HTTPException(
                status_code=403,
                detail="Car owners cannot change reservation status"
            )

        if "vehicle_id" in reservation:

            vehicle_id = reservation.get(
                "vehicle_id"
            )

            vehicle = (
                db.query(Vehicle)
                .filter(
                    Vehicle.id == vehicle_id
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
                    detail="You can only use your own vehicles"
                )

            existing_reservation.vehicle_id = (
                vehicle_id
            )

    # ======================================================
    # CUSTOMER
    # ======================================================

    else:

        if "customer_id" in reservation:

            raise HTTPException(
                status_code=403,
                detail="Users cannot change the customer"
            )

        if "status" in reservation:

            raise HTTPException(
                status_code=403,
                detail="Users cannot change reservation status"
            )

        if "vehicle_id" in reservation:

            vehicle_id = reservation.get(
                "vehicle_id"
            )

            vehicle = (
                db.query(Vehicle)
                .filter(
                    Vehicle.id == vehicle_id
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

            existing_reservation.vehicle_id = (
                vehicle_id
            )

    # ======================================================
    # DATES
    # ======================================================

    if "pickup_date" in reservation:

        try:

            existing_reservation.pickup_date = (
                date.fromisoformat(
                    reservation["pickup_date"]
                )
            )

        except (ValueError, TypeError):

            raise HTTPException(
                status_code=400,
                detail="Invalid pickup date"
            )

    if "return_date" in reservation:

        try:

            existing_reservation.return_date = (
                date.fromisoformat(
                    reservation["return_date"]
                )
            )

        except (ValueError, TypeError):

            raise HTTPException(
                status_code=400,
                detail="Invalid return date"
            )

    # ======================================================
    # DATE VALIDATION
    # ======================================================

    if (
        existing_reservation.pickup_date
        and existing_reservation.return_date
        and existing_reservation.return_date
        < existing_reservation.pickup_date
    ):

        raise HTTPException(
            status_code=400,
            detail="Return date cannot be before pickup date"
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
            detail="Failed to update reservation"
        )

    db.refresh(existing_reservation)

    return reservation_response(
        existing_reservation,
        db
    )


# ==========================================================
# DELETE RESERVATION
# ==========================================================

@router.delete("/{reservation_id}")
def delete_reservation(
    reservation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    reservation = get_owned_reservation(
        reservation_id,
        current_user,
        db
    )

    # ======================================================
    # ONLY ADMIN / SUPER ADMIN CAN DELETE
    # ======================================================

    if current_user.role not in ["admin", "super_admin"]:

        raise HTTPException(
            status_code=403,
            detail="Only administrators can delete reservations"
        )

    db.delete(reservation)

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to delete reservation"
        )

    return {
        "message": f"Reservation {reservation_id} deleted"
    }