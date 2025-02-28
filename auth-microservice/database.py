import boto3
import os
from botocore.exceptions import EndpointConnectionError

try:
    dynamodb = boto3.resource(
        "dynamodb",
        aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID", "my_fake_key"),
        aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY", "my_fake_secret_key"),
        region_name=os.getenv("AWS_REGION", "eu-central-1"),
        endpoint_url=os.getenv("DYNAMODB_ENDPOINT", "http://localhost:4566"),
    )

    users_table = dynamodb.Table("Users")
    users_table.load()  

except EndpointConnectionError:
    print("Unable to connect to the DynamoDB endpoint.")
    users_table = None

except Exception as e:
    print(f"Unexpected error: {e}")
    users_table = None
