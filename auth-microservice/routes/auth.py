from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordBearer
from models import UserRegisterResponse, Token, UserLoginRequest
from datetime import timedelta
from utils import hash_password, verify_password, create_access_token, verify_token
import os

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))
AUTH_SERVICE_ENDPOINT=os.getenv("AUTH_SERVICE_ENDPOINT", "http://localhost:8001")

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
    
@router.post("/register", response_model=UserRegisterResponse, status_code=200)
def register_user(password: str = Form(...)):
    try:
        hashed_password = hash_password(password)
        return {"hashed_password": hashed_password}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error hashing password")

@router.post("/login", response_model=Token)
def login(user_data: UserLoginRequest):
    try:
        if not verify_password(user_data.password, user_data.hashed_password):
            raise HTTPException(status_code=401, detail="Incorrect email or password")
        access_token = create_access_token(data={"sub": user_data.user_id}, expires_delta=timedelta(minutes=30))
        return Token(access_token=access_token, token_type="bearer")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

@router.get("/verify-token")
def verify_token_route(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload 