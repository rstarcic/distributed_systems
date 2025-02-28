from fastapi import APIRouter, HTTPException, Depends
from boto3.dynamodb.conditions import Key
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import UserRegisterResponse, UserRegisterRequest, Token
from database import users_table
from datetime import timedelta
from utils import convert_time, hash_password, verify_password, create_access_token, verify_token
import uuid
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/register", response_model=UserRegisterResponse)
def register_user(credentials: UserRegisterRequest):
    response = users_table.query(IndexName="email-index", KeyConditionExpression=Key('email').eq(credentials.email))
    if response["Items"]:
        raise HTTPException(status_code=400, detail="Email already registered")

    user_id = str(uuid.uuid4())
    hashed_password = hash_password(credentials.password)
    created_at = convert_time()
    new_user = {
        "user_id": user_id,
        "email": credentials.email,
        "password": hashed_password,
        "created_at": created_at, 
    }
    users_table.put_item(Item=new_user)
    return UserRegisterResponse(user_id=user_id, email=credentials.email, created_at=created_at)

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    response = users_table.query(IndexName="email-index", KeyConditionExpression=Key('email').eq(form_data.username))
    if not response["Items"] or not verify_password(form_data.password, response["Items"][0]["password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": response["Items"][0]["user_id"]}, expires_delta=timedelta(minutes=30))
    return Token(access_token=access_token, token_type="bearer")


@router.get("/verify-token")
def verify_token_route(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload 