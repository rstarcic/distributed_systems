from fastapi import APIRouter, HTTPException
from database import get_table
from routes.auth import verify_user_token
from boto3.dynamodb.conditions import Key

router = APIRouter(prefix="/users", tags=["Ingredients"])

@router.post("/", response_model=UserRegisterResponse)
def create_user(user: UserRegisterRequest):
    users_table = get_table("Users")
    
    if not users_table:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    
    response = users_table.query(
        IndexName="email-index",  
        KeyConditionExpression=Key("email").eq(user.email)
    )
    if response["Items"]:
        raise HTTPException(status_code=400, detail="Email already registered")
    # DORADA