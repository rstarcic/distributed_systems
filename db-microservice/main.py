from dotenv import load_dotenv
from fastapi import FastAPI
from routes.recipes import router as recipes_router
from routes.ingredients import router as ingredients_router
from routes.users import router as users_router

load_dotenv()

app = FastAPI(title="Database microservice")

app.include_router(recipes_router)
app.include_router(ingredients_router)
app.include_router(users_router)

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8004, reload=True)
