from datetime import date

from sqlalchemy import func
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException

from app.database import get_db

from app.models.vehicle import Vehicle
from app.models.customer import Customer
from app.models.reservation import Reservation
from app.models.rental import Rental
from app.models.payment import Payment
from app.models.user import User

from app.dependencies import get_current_user


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


# ==================================================
# HELPER: GET USER'S CUSTOMER PROFILE
# ==================================================

def get_user_customer(
    current_user: User,
    db: Session
):
    """
    Get the Customer profile belonging to
    the authenticated user.

    Admins and Super Admins do not need
    a customer profile.
    """

    # Admin and Super Admin use system-wide reports
    if current_user.role in ["admin", "super_admin"]:
        return None

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


# ==================================================
# DASHBOARD REPORT
# ==================================================

@router.get("/dashboard")
def dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    # ==================================================
    # ADMIN / SUPER ADMIN DASHBOARD
    # ==================================================

    if current_user.role in ["admin", "super_admin"]:

        # ----------------------------------------------
        # VEHICLES
        # ----------------------------------------------

        total_vehicles = (
            db.query(Vehicle)
            .count()
        )

        available_vehicles = (
            db.query(Vehicle)
            .filter(
                Vehicle.status == "Available"
            )
            .count()
        )

        rented_vehicles = (
            db.query(Vehicle)
            .filter(
                Vehicle.status == "Rented"
            )
            .count()
        )

        maintenance_vehicles = (
            db.query(Vehicle)
            .filter(
                Vehicle.status == "Maintenance"
            )
            .count()
        )

        # ----------------------------------------------
        # CUSTOMERS
        # ----------------------------------------------

        total_customers = (
            db.query(Customer)
            .count()
        )

        # ----------------------------------------------
        # RESERVATIONS
        # ----------------------------------------------

        total_reservations = (
            db.query(Reservation)
            .count()
        )

        pending_reservations = (
            db.query(Reservation)
            .filter(
                Reservation.status == "Pending"
            )
            .count()
        )

        confirmed_reservations = (
            db.query(Reservation)
            .filter(
                Reservation.status == "Confirmed"
            )
            .count()
        )

        completed_reservations = (
            db.query(Reservation)
            .filter(
                Reservation.status == "Completed"
            )
            .count()
        )

        cancelled_reservations = (
            db.query(Reservation)
            .filter(
                Reservation.status == "Cancelled"
            )
            .count()
        )

        # ----------------------------------------------
        # RENTALS
        # ----------------------------------------------

        total_rentals = (
            db.query(Rental)
            .count()
        )

        active_rentals = (
            db.query(Rental)
            .filter(
                Rental.status == "Active"
            )
            .count()
        )

        completed_rentals = (
            db.query(Rental)
            .filter(
                Rental.status == "Completed"
            )
            .count()
        )

        cancelled_rentals = (
            db.query(Rental)
            .filter(
                Rental.status == "Cancelled"
            )
            .count()
        )

        # ----------------------------------------------
        # PAYMENTS
        # ----------------------------------------------

        total_payments = (
            db.query(Payment)
            .count()
        )

        total_revenue = (
            db.query(
                func.coalesce(
                    func.sum(Payment.amount),
                    0
                )
            )
            .filter(
                Payment.status == "Paid"
            )
            .scalar()
        )

        # ----------------------------------------------
        # CURRENT MONTH REVENUE
        # ----------------------------------------------

        today = date.today()

        monthly_revenue = (
            db.query(
                func.coalesce(
                    func.sum(Payment.amount),
                    0
                )
            )
            .filter(
                Payment.status == "Paid"
            )
            .filter(
                func.extract(
                    "year",
                    Payment.payment_date
                ) == today.year
            )
            .filter(
                func.extract(
                    "month",
                    Payment.payment_date
                ) == today.month
            )
            .scalar()
        )

        # ----------------------------------------------
        # ADMIN / SUPER ADMIN RESPONSE
        # ----------------------------------------------

        return {
            "role": current_user.role,

            # Vehicles
            "total_vehicles": total_vehicles,
            "available_vehicles": available_vehicles,
            "rented_vehicles": rented_vehicles,
            "maintenance_vehicles": maintenance_vehicles,

            # Customers
            "total_customers": total_customers,

            # Reservations
            "total_reservations": total_reservations,
            "pending_reservations": pending_reservations,
            "confirmed_reservations": confirmed_reservations,
            "completed_reservations": completed_reservations,
            "cancelled_reservations": cancelled_reservations,

            # Rentals
            "total_rentals": total_rentals,
            "active_rentals": active_rentals,
            "completed_rentals": completed_rentals,
            "cancelled_rentals": cancelled_rentals,

            # Payments
            "total_payments": total_payments,
            "total_revenue": float(
                total_revenue or 0
            ),
            "monthly_revenue": float(
                monthly_revenue or 0
            )
        }


    # ==================================================
    # NORMAL USER REPORT
    # ==================================================

    customer = get_user_customer(
        current_user,
        db
    )

    customer_id = customer.id

    # ==================================================
    # USER RESERVATIONS
    # ==================================================

    total_reservations = (
        db.query(Reservation)
        .filter(
            Reservation.customer_id == customer_id
        )
        .count()
    )

    pending_reservations = (
        db.query(Reservation)
        .filter(
            Reservation.customer_id == customer_id
        )
        .filter(
            Reservation.status == "Pending"
        )
        .count()
    )

    confirmed_reservations = (
        db.query(Reservation)
        .filter(
            Reservation.customer_id == customer_id
        )
        .filter(
            Reservation.status == "Confirmed"
        )
        .count()
    )

    completed_reservations = (
        db.query(Reservation)
        .filter(
            Reservation.customer_id == customer_id
        )
        .filter(
            Reservation.status == "Completed"
        )
        .count()
    )

    cancelled_reservations = (
        db.query(Reservation)
        .filter(
            Reservation.customer_id == customer_id
        )
        .filter(
            Reservation.status == "Cancelled"
        )
        .count()
    )

    # ==================================================
    # USER RENTALS
    # ==================================================

    user_rental_query = (
        db.query(Rental)
        .join(
            Reservation,
            Rental.reservation_id == Reservation.id
        )
        .filter(
            Reservation.customer_id == customer_id
        )
    )

    total_rentals = (
        user_rental_query.count()
    )

    active_rentals = (
        db.query(Rental)
        .join(
            Reservation,
            Rental.reservation_id == Reservation.id
        )
        .filter(
            Reservation.customer_id == customer_id
        )
        .filter(
            Rental.status == "Active"
        )
        .count()
    )

    completed_rentals = (
        db.query(Rental)
        .join(
            Reservation,
            Rental.reservation_id == Reservation.id
        )
        .filter(
            Reservation.customer_id == customer_id
        )
        .filter(
            Rental.status == "Completed"
        )
        .count()
    )

    cancelled_rentals = (
        db.query(Rental)
        .join(
            Reservation,
            Rental.reservation_id == Reservation.id
        )
        .filter(
            Reservation.customer_id == customer_id
        )
        .filter(
            Rental.status == "Cancelled"
        )
        .count()
    )

    # ==================================================
    # USER PAYMENTS
    # ==================================================

    user_payment_query = (
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
            Reservation.customer_id == customer_id
        )
    )

    total_payments = (
        user_payment_query.count()
    )

    total_revenue = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0
            )
        )
        .join(
            Rental,
            Payment.rental_id == Rental.id
        )
        .join(
            Reservation,
            Rental.reservation_id == Reservation.id
        )
        .filter(
            Reservation.customer_id == customer_id
        )
        .filter(
            Payment.status == "Paid"
        )
        .scalar()
    )

    # ==================================================
    # USER MONTHLY REVENUE
    # ==================================================

    today = date.today()

    monthly_revenue = (
        db.query(
            func.coalesce(
                func.sum(Payment.amount),
                0
            )
        )
        .join(
            Rental,
            Payment.rental_id == Rental.id
        )
        .join(
            Reservation,
            Rental.reservation_id == Reservation.id
        )
        .filter(
            Reservation.customer_id == customer_id
        )
        .filter(
            Payment.status == "Paid"
        )
        .filter(
            func.extract(
                "year",
                Payment.payment_date
            ) == today.year
        )
        .filter(
            func.extract(
                "month",
                Payment.payment_date
            ) == today.month
        )
        .scalar()
    )

    # ==================================================
    # USER RESPONSE
    # ==================================================

    return {
        "role": "user",

        # Vehicles
        "total_vehicles": total_vehicles,
        "available_vehicles": available_vehicles,
        "rented_vehicles": rented_vehicles,
        "maintenance_vehicles": maintenance_vehicles,

        # Customer
        "total_customers": 1,

        # Reservations
        "total_reservations": total_reservations,
        "pending_reservations": pending_reservations,
        "confirmed_reservations": confirmed_reservations,
        "completed_reservations": completed_reservations,
        "cancelled_reservations": cancelled_reservations,

        # Rentals
        "total_rentals": total_rentals,
        "active_rentals": active_rentals,
        "completed_rentals": completed_rentals,
        "cancelled_rentals": cancelled_rentals,

        # Payments
        "total_payments": total_payments,
        "total_revenue": float(
            total_revenue or 0
        ),
        "monthly_revenue": float(
            monthly_revenue or 0
        )
    }