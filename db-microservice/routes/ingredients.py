from fastapi import APIRouter, HTTPException
from database import get_table

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])


@router.get("/", response_model=list[str])
def get_all_ingredients():
    recipes_table = get_table("Recipes")
    unique_ingredients = set()

    response = recipes_table.scan()
    if not response.get("Items"):
        raise HTTPException(status_code=404, detail="No recipes found in the database")

    for recipe in response.get("Items", []):
        for ingredient in recipe["ingredients"]:
            unique_ingredients.add(ingredient["name"])

    return list(unique_ingredients)
