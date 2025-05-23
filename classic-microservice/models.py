from pydantic import BaseModel
from typing import Literal


class Ingredients(BaseModel):
    name: str
    quantity: str
    unit: str


class RecipeResponse(BaseModel):
    recipe_id: str
    name: str
    description: str
    ingredients: list[Ingredients]
    instructions: list[str]
    prep_time: int
    cook_time: int
    max_time: int
    difficulty: Literal["easy", "medium", "hard"]
    ingredients_count: int
    meal_type: Literal["breakfast", "lunch", "dinner", "salad", "dessert"]
    image_url: str


class RecipeRequest(BaseModel):
    name: str
    description: str
    ingredients: list[Ingredients]
    instructions: list[str]
    prep_time: int
    cook_time: int
    max_time: int
    difficulty: Literal["easy", "medium", "hard"]
    ingredients_count: int
    meal_type: Literal["breakfast", "lunch", "dinner", "salad", "dessert"]
    image_url: str


class Token(BaseModel):
    access_token: str
    token_type: str
