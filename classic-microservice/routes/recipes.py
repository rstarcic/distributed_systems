from fastapi import APIRouter, Depends, HTTPException, Query
from routes.auth import verify_user_token
from models import RecipeResponse, RecipeRequest
import os
import aiohttp
from typing import Literal, Optional, List

DATABASE_SERVICE_URL = os.getenv("DATABASE_SERVICE_URL", "http://localhost:8004")
RECOMMENDATION_SERVICE_URL= os.getenv("RECOMMENDATION_SERVICE_ENDPOINT", "http://localhost:8003")

router = APIRouter(prefix="/recipes", tags=["Recipes"])

@router.get("/")
async def get_all_recipes(token: str = Depends(verify_user_token)):
    headers = {'Authorization': f'Bearer {token}'}
    print(f"Authorization token: {token}")

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
    
@router.get("/{id}", response_model=RecipeResponse)
async def get_recipe_by_id(id: str, token: str = Depends(verify_user_token)):
    print(f"Requesting with id: {id}")
    headers = {'Authorization': f'Bearer {token}'}
    print(f"Authorization token: {token}")

    try:
        async with aiohttp.ClientSession() as session:
            response = await session.get(f"{DATABASE_SERVICE_URL}/recipes/{id}", headers=headers)
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

@router.get("/filter")
async def get_recipes_from_recommendation(
    token: str = Depends(verify_user_token),
    avoid: Optional[List[str]] = Query(None, description="Filter by avoid ingredients"),
    difficulty: Optional[List[str]] = Query(None, description="Filter by difficulty level"),
    ingredients: Optional[List[str]] = Query(None, description="Filter by ingredients"),
    match_all: Optional[bool] = Query(False, description="Match all ingredients"),
    max_ingredients: Optional[int] = Query(None, description="Maximum number of ingredients"),
    max_time: Optional[int] = Query(None, description="Maximum time for cooking"),
    dish_type: Optional[Literal["breakfast", "lunch", "dinner", "salad"]] = Query(None, description="Meal type")
):
    print(f"Received request with token: {token}")
    print(f"Parameters - avoid: {avoid}, difficulty: {difficulty}, ingredients: {ingredients}, "
          f"match_all: {match_all}, max_ingredients: {max_ingredients}, max_time: {max_time}, dish_type: {dish_type}")

    headers = {'Authorization': f'Bearer {token}'}
    print(f"Authorization token: {token}")

    try:
        async with aiohttp.ClientSession() as session:
            response = await session.get(f"{RECOMMENDATION_SERVICE_URL}/recommend", headers=headers, params={
                "avoid": avoid,
                "difficulty": difficulty,
                "ingredients": ingredients,
                "match_all": match_all,
                "max_ingredients": max_ingredients,
                "max_time": max_time,
                "dish_type": dish_type
            })
            print(f"Response status from Recommendation Service: {response.status}")
            if response.status == 200:
                filtered_recipes = await response.json()
                return filtered_recipes
            else:
                raise HTTPException(status_code=500, detail=f"Error fetching filtered recipes from recommendation service: {str(error)}")
    except aiohttp.ClientError as error:
        raise HTTPException(status_code=500, detail=f"Error while connecting to the recommendation service: {str(error)}")
    
@router.post("/")
async def create_recipe(recipe: RecipeRequest, token: str = Depends(verify_user_token)):
    headers = {'Authorization': f'Bearer {token}'}
    print(f"Authorization token: {token}")

    try:
        async with aiohttp.ClientSession() as session:
            response = await session.post(f"{DATABASE_SERVICE_URL}/recipes", headers=headers, json=recipe)
            
            if response.status == 201:
                return await response.json()
            else:
                raise HTTPException(status_code=response.status, detail="Error while creating recipe in the database")
    except aiohttp.ClientError as error:
        raise HTTPException(status_code=500, detail=f"Error while connecting to the database service: {str(error)}")