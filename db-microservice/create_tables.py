import boto3
import os

dynamodb = boto3.resource(
    "dynamodb",
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID", "my_fake_key"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY", "my_fake_secret_key"),
    region_name=os.getenv("AWS_REGION", "eu-central-1"),
    endpoint_url=os.getenv("DYNAMODB_ENDPOINT", "http://localhost:4566"), 
)

def create_tables():
    try:
        users = dynamodb.create_table(
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

        recipes = dynamodb.create_table(
            TableName="Recipes",
            KeySchema=[{"AttributeName": "recipe_id", "KeyType": "HASH"}], 
            AttributeDefinitions=[
                {"AttributeName": "recipe_id", "AttributeType": "S"}, 
                {"AttributeName": "recipe_name", "AttributeType": "S"}, 
                {"AttributeName": "difficulty", "AttributeType": "S"}, 
                {"AttributeName": "meal_type", "AttributeType": "S"},  
                {"AttributeName": "max_time", "AttributeType": "N"}, 
                {"AttributeName": "ingredients_count", "AttributeType": "N"} 
            ],
            GlobalSecondaryIndexes=[
                {
                    "IndexName": "recipe-name-index",
                    "KeySchema": [{"AttributeName": "recipe_name", "KeyType": "HASH"}],
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
        
create_tables()