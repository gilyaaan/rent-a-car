from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

from app.database import Base


class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    owner_id = Column(
        UUID(as_uuid=True),
        ForeignKey("users.id"),
        nullable=True,
        index=True
    )

    plate_number = Column(
        String,
        unique=True
    )

    brand = Column(String)

    model = Column(String)

    year = Column(Integer)

    daily_rate = Column(Integer)

    status = Column(
        String,
        default="Available"
    )