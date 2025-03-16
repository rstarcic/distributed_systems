from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.auth import router as auth_router

load_dotenv()

app = FastAPI()

app.include_router(auth_router)
