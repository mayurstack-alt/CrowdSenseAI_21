from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()

from app.routes import health
from app.routes import predict
from app.routes import weather
from app.routes import locations
from app.routes import reports

app = FastAPI()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "CrowdSense AI Backend is running!"}

app.include_router(health.router)
app.include_router(predict.router)
app.include_router(weather.router)
app.include_router(locations.router)
app.include_router(reports.router)