import boto3
import os
from botocore.exceptions import EndpointConnectionError


def get_dynamodb():
    try:
        return boto3.resource(
            "dynamodb",
            aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID", "my_fake_key"),
            aws_secret_access_key=os.getenv(
                "AWS_SECRET_ACCESS_KEY", "my_fake_secret_key"
            ),
            region_name=os.getenv("AWS_REGION", "eu-central-1"),
            endpoint_url=os.getenv("DYNAMODB_ENDPOINT", "http://localstack:4566"),
        )
    except EndpointConnectionError as e:
        print("Unable to connect to the DynamoDB endpoint:", e)
        return None
    except Exception as e:
        print("Unexpected error while initializing DynamoDB resource:", e)
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
    return None
