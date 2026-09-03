from sqlalchemy import Column, Integer, Date, String, ForeignKey
from app.database import Base

class Reservation(Base):
    __tablename__ = "reservations"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(Integer, ForeignKey("customers.id"))
    vehicle_id = Column(Integer, ForeignKey("vehicles.id"))

    pickup_date = Column(Date)
    return_date = Column(Date)

    status = Column(String, default="Pending")