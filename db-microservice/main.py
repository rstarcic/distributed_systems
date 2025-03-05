from dotenv import load_dotenv
from fastapi import FastAPI
from routes.recipes import router as recipes_router
from routes.ingredients import router as ingredients_router

load_dotenv()

app = FastAPI()

app.include_router(recipes_router)
app.include_router(ingredients_router)