from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.vehicle import Vehicle
from app.models.user import User
from app.dependencies import get_current_user


router = APIRouter(
    prefix="/vehicles",
    tags=["Vehicles"]
)


def vehicle_response(vehicle: Vehicle):
    return {
        "id": vehicle.id,
        "owner_id": vehicle.owner_id,
        "plate_number": vehicle.plate_number,
        "brand": vehicle.brand,
        "model": vehicle.model,
        "year": vehicle.year,
        "daily_rate": vehicle.daily_rate,
        "status": vehicle.status,
    }


# ==========================================================
# GET ALL VEHICLES
# ==========================================================

@router.get("/")
def get_vehicles(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Admin can see all vehicles
    if current_user.role == "admin":
        vehicles = (
            db.query(Vehicle)
            .all()
        )

    # Car owner can only see their own vehicles
    elif current_user.role == "car_owner":
        vehicles = (
            db.query(Vehicle)
            .filter(
                Vehicle.owner_id == current_user.id
            )
            .all()
        )

    # Regular customers can see available vehicles
    else:
        vehicles = (
            db.query(Vehicle)
            .filter(
                Vehicle.status == "Available"
            )
            .all()
        )

    return [
        vehicle_response(vehicle)
        for vehicle in vehicles
    ]


# ==========================================================
# GET ONE VEHICLE
# ==========================================================

@router.get("/{vehicle_id}")
def get_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

    # Owner can only access their own vehicle
    if current_user.role == "car_owner":
        if vehicle.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You do not have access to this vehicle"
            )

    return vehicle_response(vehicle)


# ==========================================================
# CREATE VEHICLE
# ==========================================================

@router.post("/")
def create_vehicle(
    vehicle: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Only admin and car_owner can create vehicles
    if current_user.role not in ["admin", "car_owner"]:
        raise HTTPException(
            status_code=403,
            detail="Only admins and car owners can create vehicles"
        )

    plate_number = vehicle.get("plate_number")

    if not plate_number:
        raise HTTPException(
            status_code=400,
            detail="Plate number is required"
        )

    existing_vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.plate_number == plate_number
        )
        .first()
    )

    if existing_vehicle:
        raise HTTPException(
            status_code=400,
            detail="Plate number already exists"
        )

    # Admin may optionally provide an owner_id
    # Car owner automatically becomes the owner
    if current_user.role == "car_owner":
        owner_id = current_user.id
    else:
        owner_id = vehicle.get("owner_id")

    new_vehicle = Vehicle(
        owner_id=owner_id,
        plate_number=plate_number,
        brand=vehicle.get("brand"),
        model=vehicle.get("model"),
        year=vehicle.get("year"),
        daily_rate=vehicle.get("daily_rate"),
        status=vehicle.get(
            "status",
            "Available"
        )
    )

    db.add(new_vehicle)
    db.commit()
    db.refresh(new_vehicle)

    return vehicle_response(new_vehicle)


# ==========================================================
# UPDATE VEHICLE
# ==========================================================

@router.put("/{vehicle_id}")
def update_vehicle(
    vehicle_id: int,
    vehicle: dict,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    existing_vehicle = (
        db.query(Vehicle)
        .filter(
            Vehicle.id == vehicle_id
        )
        .first()
    )

    if not existing_vehicle:
        raise HTTPException(
            status_code=404,
            detail="Vehicle not found"
        )

    # Car owner can only update their own vehicle
    if current_user.role == "car_owner":
        if existing_vehicle.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can only update your own vehicles"
            )

    # Only admin and car_owner can update
    elif current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to update vehicles"
        )

    if "plate_number" in vehicle:
        duplicate = (
            db.query(Vehicle)
            .filter(
                Vehicle.plate_number == vehicle["plate_number"],
                Vehicle.id != vehicle_id
            )
            .first()
        )

        if duplicate:
            raise HTTPException(
                status_code=400,
                detail="Plate number already exists"
            )

        existing_vehicle.plate_number = vehicle["plate_number"]

    if "brand" in vehicle:
        existing_vehicle.brand = vehicle["brand"]

    if "model" in vehicle:
        existing_vehicle.model = vehicle["model"]

    if "year" in vehicle:
        existing_vehicle.year = vehicle["year"]

    if "daily_rate" in vehicle:
        existing_vehicle.daily_rate = vehicle["daily_rate"]

    if "status" in vehicle:
        existing_vehicle.status = vehicle["status"]

    # Only admin can change vehicle ownership
    if current_user.role == "admin" and "owner_id" in vehicle:
        existing_vehicle.owner_id = vehicle["owner_id"]

    db.commit()
    db.refresh(existing_vehicle)

    return vehicle_response(existing_vehicle)


# ==========================================================
# DELETE VEHICLE
# ==========================================================

@router.delete("/{vehicle_id}")
def delete_vehicle(
    vehicle_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

    # Car owner can only delete their own vehicle
    if current_user.role == "car_owner":
        if vehicle.owner_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You can only delete your own vehicles"
            )

    elif current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to delete vehicles"
        )

    db.delete(vehicle)
    db.commit()

    return {
        "message": f"Vehicle {vehicle_id} deleted"
    }