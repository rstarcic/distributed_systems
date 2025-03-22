import boto3
import os


def get_dynamodb():
    try:
        return boto3.resource(
            "dynamodb",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID", "my_fake_key"),
            aws_secret_access_key=os.getenv(
                "AWS_SECRET_ACCESS_KEY", "my_fake_secret_key"
            ),
            region_name=os.getenv("AWS_REGION", "eu-central-1"),
            endpoint_url=os.getenv("DYNAMODB_ENDPOINT", "http://localhost:4566"),
        )
    except Exception as e:
        print(f"Could not initialize DynamoDB resource: {e}")
        return None


def get_table(table_name):
    dynamodb = get_dynamodb()
    if dynamodb is not None:
        try:
            table = dynamodb.Table(table_name)
            table.load()
            return table
        except Exception as e:
            print(f"Error accessing table {table_name}: {e}")
    else:
        print("DynamoDB resource is not available.")
        return None
