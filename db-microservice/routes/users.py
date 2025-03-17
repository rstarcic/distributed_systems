from fastapi import APIRouter, HTTPException
from database import get_table
from utils import convert_time
from models import UserRegisterRequest, UserLoginRequest
from boto3.dynamodb.conditions import Key
import uuid

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", status_code=201)
def create_user(user: UserRegisterRequest):
    email = user.email
    hashed_password = user.password
    users_table = get_table("Users")
    
    if not users_table:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    
    response = users_table.query(
        IndexName="email-index",  
        KeyConditionExpression=Key("email").eq(user.email)
    )
    if response["Items"]:
        raise HTTPException(status_code=409, detail="Email already registered")
    
    user_id = str(uuid.uuid4())
    created_at = convert_time()
    new_user = {
        "user_id": user_id,
        "email": email,
        "password": hashed_password,
        "created_at": created_at, 
    }
    users_table.put_item(Item=new_user)
    return {"status": "201", "message": "User registered successfully"}

@router.get("/", status_code=200)
def retrieve_user_by_email(email: str):
    users_table = get_table("Users")
    
    if not users_table:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    
    response = users_table.query(
        IndexName="email-index",  
        KeyConditionExpression=Key("email").eq(email)
    )
    if not response["Items"]:
        raise HTTPException(status_code=404, detail="User not found")
    
    return response["Items"][0]