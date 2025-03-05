from fastapi import APIRouter
from database import get_table

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])

@router.get("/", response_model=list[str])
def get_all_ingredients():
    recipes_table = get_table("Recipes")
    unique_ingredients = set()
    
    response = recipes_table.scan()
    for recipe in response.get("Items", []):
        for ingredient in recipe["ingredients"]:
            unique_ingredients.add(ingredient["name"])  

    return list(unique_ingredients)

 
