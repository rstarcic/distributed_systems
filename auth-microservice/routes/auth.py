from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from models import UserRegisterResponse, Token
from utils import hash_password, verify_password, create_access_token, verify_token
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

@router.post("/register", response_model=UserRegisterResponse, status_code=200)
def register_user(password: str = Form(...)):
    try:
        hashed_password = hash_password(password)
        return {"hashed_password": hashed_password}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error hashing password")

# prepraviti 
"""
@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    users_table = get_table("Users") 
    if not users_table:
        raise HTTPException(status_code=503, detail="Database service unavailable")
    
    response = users_table.query(IndexName="email-index", KeyConditionExpression=Key('email').eq(form_data.username))
    if not response["Items"] or not verify_password(form_data.password, response["Items"][0]["password"]):
        raise HTTPException(status_code=401, detail="Incorrect username or password")

    access_token = create_access_token(data={"sub": response["Items"][0]["user_id"]}, expires_delta=timedelta(minutes=30))
    return Token(access_token=access_token, token_type="bearer")
"""

@router.get("/verify-token")
def verify_token_route(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload 