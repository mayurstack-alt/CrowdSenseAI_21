from fastapi import FastAPI
from dotenv import load_dotenv

load_dotenv()

from app.routes import health
from app.routes import predict
from app.routes import weather
from app.routes import locations

app = FastAPI()

@app.get("/")
def home():
    return {"message": "CrowdSense AI Backend is running!"}

app.include_router(health.router)
app.include_router(predict.router)
app.include_router(weather.router)
app.include_router(locations.router)