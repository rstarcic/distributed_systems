from dotenv import load_dotenv
from fastapi import FastAPI
from routes.recipes import router as recipes_router
from routes.ingredients import router as ingredients_router
from routes.auth import router as auth_router
from routes.users import router as users_router

load_dotenv()

app = FastAPI()

app.include_router(recipes_router)
app.include_router(ingredients_router)
app.include_router(auth_router)
app.include_router(users_router)