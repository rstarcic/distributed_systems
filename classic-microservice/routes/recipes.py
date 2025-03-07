from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from routes.auth import verify_user_token
import os
import aiohttp

DATABASE_SERVICE_URL = os.getenv("DATABASE_SERVICE_URL", "http://localhost:8004")

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("/")
async def get_all_recipes(token: str = Depends(verify_user_token)):
    headers = {'Authorization': f'Bearer {token}'}
    try:
        async with aiohttp.ClientSession() as session:
            response = await session.get(f"{DATABASE_SERVICE_URL}/recipes", headers=headers)
            if response.status == 200:
                recipes = await response.json()
                return recipes
            else:
                detail = await response.text()
                raise HTTPException(status_code=response.status, detail=detail)
    except aiohttp.ClientError as e:
        raise HTTPException(status_code=500, detail=f"Error while connecting to the database service: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")