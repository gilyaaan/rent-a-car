from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pwdlib import PasswordHash
from jose import jwt

from app.database import get_db
from app.models.user import User
from app.models.customer import Customer
from app.schemas import UserCreate, UserResponse, LoginRequest
from app.dependencies import get_current_user


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


# =========================================================
# SECURITY CONFIGURATION
# =========================================================

password_hash = PasswordHash.recommended()

SECRET_KEY = "your-secret-key-change-this"
ALGORITHM = "HS256"


# =========================================================
# REGISTER
# =========================================================

@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    user: UserCreate,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # CHECK IF EMAIL ALREADY EXISTS
    # -----------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    # -----------------------------------------------------
    # HASH PASSWORD
    # -----------------------------------------------------

    hashed_password = password_hash.hash(
        user.password
    )

    # -----------------------------------------------------
    # CREATE USER
    # -----------------------------------------------------

    new_user = User(
        name=user.name.strip(),
        email=user.email.strip().lower(),
        password_hash=hashed_password,

        # All public registrations are normal customers.
        # Admin / Car Owner / Super Admin accounts should
        # be created or promoted through protected admin
        # functionality.
        role="user",

        is_active=True
    )

    db.add(new_user)

    # Flush so PostgreSQL generates the UUID for new_user
    # before creating the Customer record.
    db.flush()

    # -----------------------------------------------------
    # CREATE CUSTOMER PROFILE
    # -----------------------------------------------------

    # Split the registered name into first and last name.
    #
    # Example:
    # "John Smith"
    #     ↓
    # first_name = "John"
    # last_name  = "Smith"
    #
    # If only one name is provided:
    # "John"
    #     ↓
    # first_name = "John"
    # last_name  = "John"

    name_parts = user.name.strip().split()

    if len(name_parts) == 1:

        first_name = name_parts[0]
        last_name = name_parts[0]

    else:

        first_name = name_parts[0]
        last_name = " ".join(name_parts[1:])

    # -----------------------------------------------------
    # CREATE CUSTOMER
    # -----------------------------------------------------

    new_customer = Customer(
        user_id=new_user.id,
        first_name=first_name,
        last_name=last_name,
        email=user.email.strip().lower(),

        # These fields are optional in your Customer model.
        phone=None,
        license_number=None,
        address=None
    )

    db.add(new_customer)

    # -----------------------------------------------------
    # SAVE BOTH USER AND CUSTOMER
    # -----------------------------------------------------

    try:

        db.commit()

    except Exception:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail="Failed to create customer account"
        )

    # Refresh user after commit
    db.refresh(new_user)

    return new_user


# =========================================================
# LOGIN
# =========================================================

@router.post("/login")
def login(
    user: LoginRequest,
    db: Session = Depends(get_db)
):

    # -----------------------------------------------------
    # FIND USER
    # -----------------------------------------------------

    existing_user = (
        db.query(User)
        .filter(
            User.email == user.email.strip().lower()
        )
        .first()
    )

    # -----------------------------------------------------
    # INVALID LOGIN
    # -----------------------------------------------------

    if not existing_user:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # -----------------------------------------------------
    # VERIFY PASSWORD
    # -----------------------------------------------------

    password_valid = password_hash.verify(
        user.password,
        existing_user.password_hash
    )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    # -----------------------------------------------------
    # CHECK ACCOUNT STATUS
    # -----------------------------------------------------

    if not existing_user.is_active:
        raise HTTPException(
            status_code=403,
            detail="User account is inactive"
        )

    # =====================================================
    # CREATE JWT
    # =====================================================

    token_data = {
        "sub": str(existing_user.id),
        "email": existing_user.email,
        "role": existing_user.role
    }

    access_token = jwt.encode(
        token_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    # -----------------------------------------------------
    # RETURN LOGIN RESPONSE
    # -----------------------------------------------------

    return {
        "message": "Login successful",

        "access_token": access_token,

        "token_type": "bearer",

        "user": {
            "id": str(existing_user.id),
            "name": existing_user.name,
            "email": existing_user.email,
            "role": existing_user.role,
            "is_active": existing_user.is_active
        }
    }


# =========================================================
# CURRENT USER
# =========================================================

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):

    return {
        "id": str(current_user.id),
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }