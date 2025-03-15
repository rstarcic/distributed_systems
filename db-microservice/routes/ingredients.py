from fastapi import APIRouter, Depends
from database import get_table
from routes.auth import verify_user_token

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])

@router.get("/", response_model=list[str])
def get_all_ingredients(token: str = Depends(verify_user_token)):
    recipes_table = get_table("Recipes")
    unique_ingredients = set()
    
    response = recipes_table.scan()
    for recipe in response.get("Items", []):
        for ingredient in recipe["ingredients"]:
            unique_ingredients.add(ingredient["name"])  

    return list(unique_ingredients)