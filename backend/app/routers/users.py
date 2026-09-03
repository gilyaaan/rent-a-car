from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from passlib.context import CryptContext

from app.database import get_db
from app.models.user import User
from app.dependencies import (
    get_current_user,
    require_admin_or_super_admin,
)


router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# ==================================================
# RESPONSE
# ==================================================

def user_response(user: User):
    return {
        "id": str(user.id),
        "name": user.name,
        "email": user.email,
        "role": user.role,
        "is_active": user.is_active,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }


# ==================================================
# CURRENT USER / OWNER PROFILE
# ==================================================

@router.get("/me")
def get_my_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Returns the profile of the currently authenticated user.

    The user is determined from the JWT.
    The frontend does NOT provide user_id or owner_id.
    """

    return user_response(current_user)


# ==================================================
# UPDATE CURRENT USER / OWNER PROFILE
# ==================================================

@router.put("/me")
def update_my_profile(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Allows the authenticated user to update their own
    name and email.

    Protected fields cannot be changed:
    - id
    - role
    - is_active
    - password_hash
    """

    # --------------------------------------------------
    # SECURITY: BLOCK PROTECTED FIELDS FIRST
    # --------------------------------------------------

    protected_fields = {
        "id",
        "role",
        "is_active",
        "password_hash",
    }

    attempted_protected_fields = [
        field
        for field in protected_fields
        if field in data
    ]

    if attempted_protected_fields:
        raise HTTPException(
            status_code=403,
            detail=(
                "You cannot modify protected account fields: "
                + ", ".join(attempted_protected_fields)
            )
        )

    # --------------------------------------------------
    # NAME
    # --------------------------------------------------

    if "name" in data:

        name = data.get("name")

        if not name or not str(name).strip():
            raise HTTPException(
                status_code=400,
                detail="Name cannot be empty"
            )

        current_user.name = str(name).strip()

    # --------------------------------------------------
    # EMAIL
    # --------------------------------------------------

    if "email" in data:

        email = data.get("email")

        if not email or not str(email).strip():
            raise HTTPException(
                status_code=400,
                detail="Email cannot be empty"
            )

        email = str(email).strip().lower()

        existing_user = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != current_user.id
            )
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="Email is already in use"
            )

        current_user.email = email

    # --------------------------------------------------
    # UPDATE TIMESTAMP
    # --------------------------------------------------

    current_user.updated_at = datetime.utcnow()

    db.commit()
    db.refresh(current_user)

    return user_response(current_user)


# ==================================================
# CHANGE CURRENT USER PASSWORD
# ==================================================

@router.put("/me/password")
def change_my_password(
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Allows the authenticated user to change their password.
    """

    current_password = data.get("current_password")
    new_password = data.get("new_password")

    # --------------------------------------------------
    # VALIDATION
    # --------------------------------------------------

    if not current_password:
        raise HTTPException(
            status_code=400,
            detail="Current password is required"
        )

    if not new_password:
        raise HTTPException(
            status_code=400,
            detail="New password is required"
        )

    if len(new_password) < 6:
        raise HTTPException(
            status_code=400,
            detail="New password must be at least 6 characters"
        )

    # --------------------------------------------------
    # VERIFY CURRENT PASSWORD
    # --------------------------------------------------

    if not pwd_context.verify(
        current_password,
        current_user.password_hash
    ):
        raise HTTPException(
            status_code=403,
            detail="Current password is incorrect"
        )

    # --------------------------------------------------
    # HASH NEW PASSWORD
    # --------------------------------------------------

    current_user.password_hash = (
        pwd_context.hash(new_password)
    )

    current_user.updated_at = datetime.utcnow()

    db.commit()

    return {
        "message": "Password changed successfully"
    }


# ==================================================
# ADMIN / SUPER ADMIN: GET ALL USERS
# ==================================================

@router.get("/")
def get_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_super_admin)
):
    """
    Admin and Super Admin only.

    Returns all users.
    """

    users = (
        db.query(User)
        .order_by(User.created_at.desc())
        .all()
    )

    return [
        user_response(user)
        for user in users
    ]


# ==================================================
# ADMIN / SUPER ADMIN: GET USER BY ID
# ==================================================

@router.get("/{user_id}")
def get_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_super_admin)
):
    """
    Admin and Super Admin only.
    """

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

    return user_response(user)


# ==================================================
# ADMIN / SUPER ADMIN: UPDATE USER
# ==================================================

@router.put("/{user_id}")
def admin_update_user(
    user_id: str,
    data: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_super_admin)
):
    """
    Admin and Super Admin may change:
    - name
    - email
    - role
    - is_active

    Security:
    - Only Super Admin can assign Super Admin.
    - Only Super Admin can modify another Super Admin.
    - Users cannot change their own role.
    - Users cannot deactivate themselves.
    """

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
    # SUPER ADMIN PROTECTION
    # --------------------------------------------------

    # A normal Admin cannot modify an existing
    # Super Admin account.
    if (
        user.role == "super_admin"
        and current_user.role != "super_admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="Only Super Admin can modify a Super Admin"
        )

    # --------------------------------------------------
    # NAME
    # --------------------------------------------------

    if "name" in data:

        name = data.get("name")

        if not name or not str(name).strip():
            raise HTTPException(
                status_code=400,
                detail="Name cannot be empty"
            )

        user.name = str(name).strip()

    # --------------------------------------------------
    # EMAIL
    # --------------------------------------------------

    if "email" in data:

        email = data.get("email")

        if not email or not str(email).strip():
            raise HTTPException(
                status_code=400,
                detail="Email cannot be empty"
            )

        email = str(email).strip().lower()

        existing_user = (
            db.query(User)
            .filter(
                User.email == email,
                User.id != user.id
            )
            .first()
        )

        if existing_user:
            raise HTTPException(
                status_code=409,
                detail="Email is already in use"
            )

        user.email = email

    # --------------------------------------------------
    # ROLE
    # --------------------------------------------------

    if "role" in data:

        role = data.get("role")

        allowed_roles = [
            "admin",
            "user",
            "car_owner",
            "super_admin",
        ]

        if role not in allowed_roles:
            raise HTTPException(
                status_code=400,
                detail=(
                    "Role must be admin, user, car_owner, "
                    "or super_admin"
                )
            )

        # --------------------------------------------------
        # ONLY SUPER ADMIN CAN ASSIGN SUPER ADMIN
        # --------------------------------------------------

        if (
            role == "super_admin"
            and current_user.role != "super_admin"
        ):
            raise HTTPException(
                status_code=403,
                detail=(
                    "Only Super Admin can assign "
                    "the Super Admin role"
                )
            )

        # --------------------------------------------------
        # PREVENT SELF ROLE CHANGE
        # --------------------------------------------------

        if (
            user.id == current_user.id
            and role != current_user.role
        ):
            raise HTTPException(
                status_code=400,
                detail="You cannot change your own role"
            )

        user.role = role

    # --------------------------------------------------
    # ACTIVE STATUS
    # --------------------------------------------------

    if "is_active" in data:

        is_active = data.get("is_active")

        if not isinstance(is_active, bool):
            raise HTTPException(
                status_code=400,
                detail="is_active must be true or false"
            )

        # --------------------------------------------------
        # PREVENT SELF DEACTIVATION
        # --------------------------------------------------

        if (
            user.id == current_user.id
            and is_active is False
        ):
            raise HTTPException(
                status_code=400,
                detail="You cannot deactivate your own account"
            )

        user.is_active = is_active

    # --------------------------------------------------
    # UPDATE TIMESTAMP
    # --------------------------------------------------

    user.updated_at = datetime.utcnow()

    # --------------------------------------------------
    # SAVE
    # --------------------------------------------------

    db.commit()
    db.refresh(user)

    return user_response(user)


# ==================================================
# ADMIN / SUPER ADMIN: DELETE USER
# ==================================================

@router.delete("/{user_id}")
def delete_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin_or_super_admin)
):
    """
    Admin and Super Admin only.

    Prevents an administrator from deleting
    their own account.

    A normal Admin cannot delete a Super Admin.
    """

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
    # PREVENT SELF DELETE
    # --------------------------------------------------

    if user.id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot delete your own account"
        )

    # --------------------------------------------------
    # SUPER ADMIN PROTECTION
    # --------------------------------------------------

    if (
        user.role == "super_admin"
        and current_user.role != "super_admin"
    ):
        raise HTTPException(
            status_code=403,
            detail="Only Super Admin can delete a Super Admin"
        )

    # --------------------------------------------------
    # DELETE
    # --------------------------------------------------

    db.delete(user)
    db.commit()

    return {
        "message": "User deleted successfully"
    }