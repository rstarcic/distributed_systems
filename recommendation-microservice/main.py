from dotenv import load_dotenv
from fastapi import FastAPI
from routes.recommendation import router as recommendation_router

load_dotenv()

app = FastAPI(title="Recommendation service")

app.include_router(recommendation_router)