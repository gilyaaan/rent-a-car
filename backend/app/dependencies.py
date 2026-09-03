from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User


# ==================================================
# JWT CONFIGURATION
# ==================================================

SECRET_KEY = "your-secret-key-change-this"
ALGORITHM = "HS256"

security = HTTPBearer()


# ==================================================
# GET CURRENT AUTHENTICATED USER
# ==================================================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token"
            )

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token"
        )

    user = (
        db.query(User)
        .filter(User.id == user_id)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    return user


# ==================================================
# REQUIRE SUPER ADMIN
# ==================================================

def require_super_admin(
    current_user: User = Depends(get_current_user)
):
    """
    Only the system owner / super administrator
    can access Super Admin functionality.
    """

    if current_user.role != "super_admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Super Admin access required"
        )

    return current_user


# ==================================================
# REQUIRE ADMIN OR SUPER ADMIN
# ==================================================

def require_admin_or_super_admin(
    current_user: User = Depends(get_current_user)
):
    """
    Allows both normal administrators and the
    system owner.
    """

    if current_user.role not in [
        "admin",
        "super_admin"
    ]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Administrator access required"
        )

    return current_user


# ==================================================
# REQUIRE NORMAL ADMIN
# ==================================================

def require_admin(
    current_user: User = Depends(get_current_user)
):
    """
    Normal administrator access.

    Super Admin is intentionally NOT included here.
    This keeps normal admin permissions separate from
    Super Admin permissions.
    """

    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user