from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.models.user import User
from app.dependencies import (
    get_current_user,
    require_admin_or_super_admin,
)


router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)


# ==================================================
# CUSTOMER RESPONSE HELPER
# ==================================================

def customer_response(customer: Customer):
    return {
        "id": customer.id,
        "user_id": str(customer.user_id)
        if customer.user_id else None,
        "first_name": customer.first_name,
        "last_name": customer.last_name,
        "email": customer.email,
        "phone": customer.phone,
        "license_number": customer.license_number,
        "address": customer.address,
    }


# ==================================================
# GET MY CUSTOMER PROFILE
# AUTHENTICATED USER
# ==================================================

@router.get("/me")
def get_my_customer_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns the customer profile belonging to
    the currently authenticated user.

    The user is identified through the JWT.

    The frontend does NOT provide user_id.
    """

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

    return customer_response(customer)


# ==================================================
# UPDATE MY CUSTOMER PROFILE
# AUTHENTICATED USER
# ==================================================

@router.put("/me")
def update_my_customer_profile(
    customer: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Allows the authenticated customer to update
    their own customer profile.

    The customer is identified through the JWT.
    """

    existing_customer = (
        db.query(Customer)
        .filter(
            Customer.user_id == current_user.id
        )
        .first()
    )

    if not existing_customer:
        raise HTTPException(
            status_code=404,
            detail="Customer profile not found"
        )

    # --------------------------------------------------
    # FIRST NAME
    # --------------------------------------------------

    if "first_name" in customer:

        first_name = customer.get("first_name")

        if not first_name or not str(first_name).strip():
            raise HTTPException(
                status_code=400,
                detail="First name cannot be empty"
            )

        existing_customer.first_name = (
            str(first_name).strip()
        )

    # --------------------------------------------------
    # LAST NAME
    # --------------------------------------------------

    if "last_name" in customer:

        last_name = customer.get("last_name")

        if not last_name or not str(last_name).strip():
            raise HTTPException(
                status_code=400,
                detail="Last name cannot be empty"
            )

        existing_customer.last_name = (
            str(last_name).strip()
        )

    # --------------------------------------------------
    # EMAIL
    # --------------------------------------------------

    if "email" in customer:

        email = customer.get("email")

        if not email or not str(email).strip():
            raise HTTPException(
                status_code=400,
                detail="Email cannot be empty"
            )

        email = str(email).strip().lower()

        # Check Customer email
        duplicate_customer = (
            db.query(Customer)
            .filter(
                Customer.email == email,
                Customer.id != existing_customer.id
            )
            .first()
        )

        if duplicate_customer:
            raise HTTPException(
                status_code=409,
                detail="Email already exists"
            )

        # Keep User email synchronized
        duplicate_user = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != current_user.id
            )
            .first()
        )

        if duplicate_user:
            raise HTTPException(
                status_code=409,
                detail="Email is already in use"
            )

        existing_customer.email = email
        current_user.email = email

    # --------------------------------------------------
    # PHONE
    # --------------------------------------------------

    if "phone" in customer:

        phone = customer.get("phone")

        if phone is not None:
            phone = str(phone).strip()

        existing_customer.phone = phone

    # --------------------------------------------------
    # LICENSE NUMBER
    # --------------------------------------------------

    if "license_number" in customer:

        license_number = customer.get(
            "license_number"
        )

        if license_number is not None:
            license_number = (
                str(license_number).strip()
            )

            if license_number == "":
                license_number = None

        duplicate_license = None

        if license_number:

            duplicate_license = (
                db.query(Customer)
                .filter(
                    Customer.license_number == license_number,
                    Customer.id != existing_customer.id
                )
                .first()
            )

        if duplicate_license:
            raise HTTPException(
                status_code=409,
                detail="License number already exists"
            )

        existing_customer.license_number = (
            license_number
        )

    # --------------------------------------------------
    # ADDRESS
    # --------------------------------------------------

    if "address" in customer:

        address = customer.get("address")

        if address is not None:
            address = str(address).strip()

        existing_customer.address = address

    # --------------------------------------------------
    # SAVE
    # --------------------------------------------------

    db.commit()

    db.refresh(existing_customer)
    db.refresh(current_user)

    return customer_response(existing_customer)


# ==================================================
# GET ALL CUSTOMERS
# ADMIN / SUPER ADMIN
# ==================================================

@router.get("/")
def get_customers(
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_admin_or_super_admin
    )
):
    """
    Admin and Super Admin only.

    Returns all customer profiles.
    """

    customers = (
        db.query(Customer)
        .order_by(Customer.id.desc())
        .all()
    )

    return [
        customer_response(customer)
        for customer in customers
    ]


# ==================================================
# GET CUSTOMER BY ID
# ADMIN / SUPER ADMIN
# ==================================================

@router.get("/{customer_id}")
def get_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_admin_or_super_admin
    )
):
    """
    Admin and Super Admin only.
    """

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

    return customer_response(customer)


# ==================================================
# CREATE CUSTOMER
# ADMIN / SUPER ADMIN
# ==================================================

@router.post("/")
def create_customer(
    customer: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_admin_or_super_admin
    )
):

    # --------------------------------------------------
    # REQUIRED FIELDS
    # --------------------------------------------------

    first_name = customer.get("first_name")
    last_name = customer.get("last_name")
    email = customer.get("email")

    if not first_name or not str(first_name).strip():
        raise HTTPException(
            status_code=400,
            detail="First name is required"
        )

    if not last_name or not str(last_name).strip():
        raise HTTPException(
            status_code=400,
            detail="Last name is required"
        )

    if not email or not str(email).strip():
        raise HTTPException(
            status_code=400,
            detail="Email is required"
        )

    first_name = str(first_name).strip()
    last_name = str(last_name).strip()
    email = str(email).strip().lower()

    # --------------------------------------------------
    # USER ID
    # --------------------------------------------------

    user_id = customer.get("user_id")

    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="user_id is required"
        )

    # --------------------------------------------------
    # FIND USER
    # --------------------------------------------------

    user = (
        db.query(User)
        .filter(
            User.id == user_id
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # --------------------------------------------------
    # CHECK EXISTING USER CUSTOMER
    # --------------------------------------------------

    existing_user_customer = (
        db.query(Customer)
        .filter(
            Customer.user_id == user.id
        )
        .first()
    )

    if existing_user_customer:
        raise HTTPException(
            status_code=400,
            detail="This user already has a customer profile"
        )

    # --------------------------------------------------
    # CHECK EMAIL
    # --------------------------------------------------

    existing_email = (
        db.query(Customer)
        .filter(
            Customer.email == email
        )
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    # --------------------------------------------------
    # CHECK LICENSE NUMBER
    # --------------------------------------------------

    license_number = customer.get(
        "license_number"
    )

    if license_number:
        license_number = (
            str(license_number).strip()
        )

        existing_license = (
            db.query(Customer)
            .filter(
                Customer.license_number
                == license_number
            )
            .first()
        )

        if existing_license:
            raise HTTPException(
                status_code=400,
                detail="License number already exists"
            )

    # --------------------------------------------------
    # CREATE CUSTOMER
    # --------------------------------------------------

    new_customer = Customer(
        user_id=user.id,
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=customer.get("phone"),
        license_number=license_number,
        address=customer.get("address"),
    )

    db.add(new_customer)

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to create customer"
        )

    db.refresh(new_customer)

    return customer_response(new_customer)


# ==================================================
# UPDATE CUSTOMER
# ADMIN / SUPER ADMIN
# ==================================================

@router.put("/{customer_id}")
def update_customer(
    customer_id: int,
    customer: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_admin_or_super_admin
    )
):

    existing_customer = (
        db.query(Customer)
        .filter(
            Customer.id == customer_id
        )
        .first()
    )

    if not existing_customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    # --------------------------------------------------
    # UPDATE USER ID
    # --------------------------------------------------

    if "user_id" in customer:

        user_id = customer.get("user_id")

        # Do not allow the required relationship
        # to become NULL.
        if not user_id:

            raise HTTPException(
                status_code=400,
                detail="user_id cannot be empty"
            )

        user = (
            db.query(User)
            .filter(
                User.id == user_id
            )
            .first()
        )

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        duplicate = (
            db.query(Customer)
            .filter(
                Customer.user_id == user.id,
                Customer.id != customer_id
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=400,
                detail="This user already has a customer profile"
            )

        existing_customer.user_id = user.id

    # --------------------------------------------------
    # UPDATE FIRST NAME
    # --------------------------------------------------

    if "first_name" in customer:

        first_name = customer.get("first_name")

        if not first_name or not str(first_name).strip():
            raise HTTPException(
                status_code=400,
                detail="First name cannot be empty"
            )

        existing_customer.first_name = (
            str(first_name).strip()
        )

    # --------------------------------------------------
    # UPDATE LAST NAME
    # --------------------------------------------------

    if "last_name" in customer:

        last_name = customer.get("last_name")

        if not last_name or not str(last_name).strip():
            raise HTTPException(
                status_code=400,
                detail="Last name cannot be empty"
            )

        existing_customer.last_name = (
            str(last_name).strip()
        )

    # --------------------------------------------------
    # UPDATE EMAIL
    # --------------------------------------------------

    if "email" in customer:

        new_email = customer.get("email")

        if not new_email or not str(new_email).strip():
            raise HTTPException(
                status_code=400,
                detail="Email cannot be empty"
            )

        new_email = (
            str(new_email).strip().lower()
        )

        duplicate_email = (
            db.query(Customer)
            .filter(
                Customer.email == new_email,
                Customer.id != customer_id
            )
            .first()
        )

        if duplicate_email:
            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        existing_customer.email = new_email

    # --------------------------------------------------
    # UPDATE PHONE
    # --------------------------------------------------

    if "phone" in customer:

        existing_customer.phone = (
            customer.get("phone")
        )

    # --------------------------------------------------
    # UPDATE LICENSE NUMBER
    # --------------------------------------------------

    if "license_number" in customer:

        new_license = customer.get(
            "license_number"
        )

        if new_license:
            new_license = (
                str(new_license).strip()
            )

        duplicate_license = None

        if new_license:

            duplicate_license = (
                db.query(Customer)
                .filter(
                    Customer.license_number
                    == new_license,
                    Customer.id != customer_id
                )
                .first()
            )

        if duplicate_license:
            raise HTTPException(
                status_code=400,
                detail="License number already exists"
            )

        existing_customer.license_number = (
            new_license
        )

    # --------------------------------------------------
    # UPDATE ADDRESS
    # --------------------------------------------------

    if "address" in customer:

        existing_customer.address = (
            customer.get("address")
        )

    # --------------------------------------------------
    # SAVE
    # --------------------------------------------------

    db.commit()
    db.refresh(existing_customer)

    return customer_response(existing_customer)


# ==================================================
# DELETE CUSTOMER
# ADMIN / SUPER ADMIN
# ==================================================

@router.delete("/{customer_id}")
def delete_customer(
    customer_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(
        require_admin_or_super_admin
    )
):

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

    db.delete(customer)
    db.commit()

    return {
        "message": f"Customer {customer_id} deleted"
    }