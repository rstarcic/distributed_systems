from fastapi import APIRouter, Query, HTTPException
from typing import Optional, List, Literal
import os
import aiohttp
import random

DATABASE_SERVICE_URL = os.getenv("DATABASE_SERVICE_ENDPOINT", "http://localhost:8004")

router = APIRouter(prefix="/recommend", tags=["Recommend"])


@router.get("/", response_model=list[dict])
async def get_filtered_recipes(
    avoid: Optional[List[str]] = Query(None, description="Filter by avoid ingredients"),
    difficulty: Optional[List[str]] = Query(
        None, description="Filter by difficulty level"
    ),
    ingredients: Optional[List[str]] = Query(None, description="Filter by ingredients"),
    match_all: Optional[bool] = Query("false", description="Match all ingredients"),
    max_ingredients: Optional[int] = Query(
        None, description="Maximum number of ingredients"
    ),
    max_time: Optional[int] = Query(None, description="Maximum time for cooking"),
    dish_type: Optional[Literal["breakfast", "lunch", "dinner", "salad"]] = Query(
        None, description="Meal type"
    ),
):
    match_all_bool = str(match_all).lower() == "true"
    try:
        async with aiohttp.ClientSession() as session:
            response = await session.get(f"{DATABASE_SERVICE_URL}/recipes")

            if response.status == 200:
                recipes = await response.json()
                filtered_recipes = []

                for recipe in recipes:
                    recipe_passes = True
                    recipe_ingredients = [
                        ingredient["name"].lower()
                        for ingredient in recipe["ingredients"]
                    ]

                    if avoid:
                        if any(
                            ingredient.lower() in recipe_ingredients
                            for ingredient in avoid
                        ):
                            recipe_passes = False

                    if difficulty and recipe["difficulty"] not in difficulty:
                        recipe_passes = False

                    if ingredients:
                        if match_all_bool:
                            if not all(
                                query_ingredient.lower() in recipe_ingredients
                                for query_ingredient in ingredients
                            ):
                                recipe_passes = False
                        else:
                            if not any(
                                query_ingredient.lower() in recipe_ingredients
                                for query_ingredient in ingredients
                            ):
                                recipe_passes = False

                    if (
                        max_ingredients
                        and recipe["ingredients_count"] > max_ingredients
                    ):
                        recipe_passes = False

                    if max_time and recipe["max_time"] > max_time:
                        recipe_passes = False

                    if dish_type and recipe["meal_type"].lower() != dish_type.lower():
                        recipe_passes = False

                    if recipe_passes:
                        filtered_recipes.append(recipe)

                return filtered_recipes
            else:
                raise HTTPException(
                    status_code=response.status, detail="Error fetching recipes"
                )

    except aiohttp.ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error while connecting to the database service: {str(e)}",
        )


@router.get("/random", response_model=dict)
async def get_random_recipe():
    try:
        async with aiohttp.ClientSession() as session:
            response = await session.get(f"{DATABASE_SERVICE_URL}/recipes")
            if response.status == 200:
                recipes = await response.json()
                if recipes:
                    return random.choice(recipes)
                else:
                    raise HTTPException(status_code=404, detail="No recipes found")
            else:
                raise HTTPException(
                    status_code=response.status, detail="Error fetching recipes"
                )
    except aiohttp.ClientError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error while connecting to the database service: {str(e)}",
        )
