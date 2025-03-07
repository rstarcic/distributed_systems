from dotenv import load_dotenv
from fastapi import FastAPI
from routes.auth import router as auth_router
from routes.recipes import router as recipes_router

load_dotenv()

app = FastAPI(title="Classic service")

app.include_router(auth_router)
app.include_router(recipes_router)