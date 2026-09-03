from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import Base, engine

from app.models.user import User
from app.routers import users
from app.routers import auth
from app.routers import vehicles
from app.routers import customers
from app.routers import reservations
from app.routers import rentals
from app.routers import payments
from app.routers import reports


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="Rent A Car Management API",
    version="1.0.0"
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# API Routers
# --------------------------------------------------

app.include_router(users.router)
app.include_router(auth.router)
app.include_router(vehicles.router)
app.include_router(customers.router)
app.include_router(reservations.router)
app.include_router(rentals.router)
app.include_router(payments.router)
app.include_router(reports.router)


# --------------------------------------------------
# Root
# --------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "Rent A Car Backend Running"
    }


# --------------------------------------------------
# Database Test
# --------------------------------------------------

@app.get("/api/test/database")
def test_database():
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        return {
            "status": "success",
            "message": "PostgreSQL Connected Successfully"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": "Database connection failed",
            "error": str(e)
        }


# --------------------------------------------------
# Frontend Connection Test
# --------------------------------------------------

@app.get("/api/test")
def test_frontend():
    return {
        "status": "success",
        "message": "Frontend Connected"
    }


# --------------------------------------------------
# Dashboard
# --------------------------------------------------

