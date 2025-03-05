from database import get_dynamodb
import json
import uuid

def convert_quantity(value):
    if isinstance(value, str) and "/" in value:
        return value 
    try:
        return str(value)
    except Exception:
        return None

def load_recipes_from_json():
    db = get_dynamodb()
    if not db:
        print("DynamoDB resource not available.")
        return

    recipes_table = db.Table("Recipes")

    try:
        with open("dummy_data.json", "r", encoding="utf-8") as f:
            recipes = json.load(f)
            for recipe in recipes:
                recipe["recipe_id"] = str(uuid.uuid4()) 
                for ingredient in recipe["ingredients"]:
                    ingredient["quantity"] = convert_quantity(ingredient["quantity"])
                recipes_table.put_item(Item=recipe)
            print("Recipes successfully loaded into DynamoDB!")
    except Exception as e:
        print(f"Error loading recipes: {e}")

if __name__ == "__main__":
    load_recipes_from_json()
