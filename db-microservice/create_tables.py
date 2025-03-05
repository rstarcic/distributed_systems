from database import get_dynamodb

def create_tables():
    db = get_dynamodb()
    if not db:
        print("DynamoDB resource not available.")
        return
    try:
        users = db.create_table(
            TableName="Users",
            KeySchema=[{"AttributeName": "user_id", "KeyType": "HASH"}],  
            AttributeDefinitions=[
                {"AttributeName": "user_id", "AttributeType": "S"},
                {"AttributeName": "email", "AttributeType": "S"} 
            ],
            GlobalSecondaryIndexes=[{
                "IndexName": "email-index",  
                "KeySchema": [{"AttributeName": "email", "KeyType": "HASH"}], 
                "Projection": {"ProjectionType": "ALL"},  
                "ProvisionedThroughput": {"ReadCapacityUnits": 1, "WriteCapacityUnits": 1} 
            }],
            ProvisionedThroughput={"ReadCapacityUnits": 1, "WriteCapacityUnits": 1}  
        )
        users.wait_until_exists()

        recipes = db.create_table(
            TableName="Recipes",
            KeySchema=[{"AttributeName": "recipe_id", "KeyType": "HASH"}], 
            AttributeDefinitions=[
                {"AttributeName": "recipe_id", "AttributeType": "S"}, 
                {"AttributeName": "name", "AttributeType": "S"}, 
                {"AttributeName": "difficulty", "AttributeType": "S"}, 
                {"AttributeName": "meal_type", "AttributeType": "S"},  
                {"AttributeName": "max_time", "AttributeType": "N"}, 
                {"AttributeName": "ingredients_count", "AttributeType": "N"} 
            ],
            GlobalSecondaryIndexes=[
                {
                    "IndexName": "recipe-name-index",
                    "KeySchema": [{"AttributeName": "name", "KeyType": "HASH"}],
                    "Projection": {"ProjectionType": "ALL"},
                    "ProvisionedThroughput": {"ReadCapacityUnits": 1, "WriteCapacityUnits": 1}
                },
                {
                    "IndexName": "difficulty-index",
                    "KeySchema": [{"AttributeName": "difficulty", "KeyType": "HASH"}],
                    "Projection": {"ProjectionType": "ALL"},
                    "ProvisionedThroughput": {"ReadCapacityUnits": 1, "WriteCapacityUnits": 1}
                },
                {
                    "IndexName": "meal-type-index",
                    "KeySchema": [{"AttributeName": "meal_type", "KeyType": "HASH"}],
                    "Projection": {"ProjectionType": "ALL"},
                    "ProvisionedThroughput": {"ReadCapacityUnits": 1, "WriteCapacityUnits": 1}
                },
                {
                    "IndexName": "max-time-index",
                    "KeySchema": [{"AttributeName": "max_time", "KeyType": "HASH"}],
                    "Projection": {"ProjectionType": "ALL"},
                    "ProvisionedThroughput": {"ReadCapacityUnits": 1, "WriteCapacityUnits": 1}
                },
                {
                    "IndexName": "ingredients-count-index",
                    "KeySchema": [{"AttributeName": "ingredients_count", "KeyType": "HASH"}],
                    "Projection": {"ProjectionType": "ALL"},
                    "ProvisionedThroughput": {"ReadCapacityUnits": 1, "WriteCapacityUnits": 1}
                }
            ],
            ProvisionedThroughput={"ReadCapacityUnits": 1, "WriteCapacityUnits": 1}
        )
        recipes.wait_until_exists()
        print("Tables successfully created.")
    except Exception as e:
        print(f"Error during table creation: {e}")

if __name__ == "__main__":
    create_tables()