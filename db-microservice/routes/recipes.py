from fastapi import APIRouter, HTTPException, Depends
from boto3.dynamodb.conditions import Key
from models import RecipeResponse, RecipeRequest
from database import get_table
import uuid

router = APIRouter(prefix="/recipes", tags=["Recipes"])


@router.get("/", response_model=list[RecipeResponse], status_code=200)
def get_all_recipes():
    recipes_table = get_table("Recipes")
    if recipes_table is None:
        raise HTTPException(
            status_code=500, detail="Could not connect to the Recipes table."
        )

    try:
        response = recipes_table.scan()
        return response.get("Items", [])
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error while fetching data from Recipes table: {str(e)}",
        )


@router.get("/{id}", response_model=RecipeResponse)
def get_recipe_by_id(id: str):
    recipes_table = get_table("Recipes")

    if recipes_table is None:
        raise HTTPException(
            status_code=500, detail="Could not connect to the Recipes table."
        )

    try:
        response = recipes_table.get_item(Key={"recipe_id": id})
        if "Item" in response:
            return response["Item"]
        else:
            raise HTTPException(status_code=404, detail="Recipe not found")
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error while fetching data from Recipes table: {str(e)}",
        )


@router.post("/", response_model=RecipeResponse, status_code=201)
def create_recipe(recipe: RecipeRequest):
    recipes_table = get_table("Recipes")
    existing_recipe = recipes_table.query(
        IndexName="recipe-name-index",
        KeyConditionExpression=Key("name").eq(recipe.name),
    )

    if existing_recipe.get("Items"):
        raise HTTPException(
            status_code=400, detail="Recipe already exists with this name."
        )

    recipe_dict = recipe.model_dump()
    recipe_dict["recipe_id"] = str(uuid.uuid4())
    recipe_dict["image_url"] = str(recipe.image_url)

    recipes_table.put_item(Item=recipe_dict)
    return recipe_dict
