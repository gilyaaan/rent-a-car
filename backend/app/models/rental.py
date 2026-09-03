from sqlalchemy import Column, Integer, Date, String, Float, ForeignKey
from app.database import Base

class Rental(Base):
    __tablename__ = "rentals"

    id = Column(Integer, primary_key=True, index=True)

    reservation_id = Column(
        Integer,
        ForeignKey("reservations.id")
    )

    start_date = Column(Date)

    actual_return_date = Column(Date)

    total_amount = Column(Float)

    status = Column(
        String,
        default="Active"
    )