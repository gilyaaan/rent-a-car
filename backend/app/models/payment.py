from sqlalchemy import Column, Integer, Float, String, Date, ForeignKey
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    rental_id = Column(
        Integer,
        ForeignKey("rentals.id")
    )

    amount = Column(Float)

    payment_method = Column(String)

    payment_date = Column(Date)

    status = Column(
        String,
        default="Paid"
    )