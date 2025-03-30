from fastapi import APIRouter, HTTPException, Depends, Form
from fastapi.security import OAuth2PasswordBearer
from models import UserRegisterResponse, Token
from datetime import timedelta
from utils import hash_password, verify_password, create_access_token, verify_token
import os
import aiohttp


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 30))
DB_SERVICE_ENDPOINT = os.getenv(
    "DATABASE_SERVICE_ENDPOINT", "http://db-microservice:8004"
)
AUTH_SERVICE_ENDPOINT = os.getenv("AUTH_SERVICE_ENDPOINT", "http://localhost:8001")

router = APIRouter(prefix="/auth", tags=["Authentication"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{AUTH_SERVICE_ENDPOINT}/auth/login")


@router.post("/register", response_model=UserRegisterResponse, status_code=200)
def register_user(password: str = Form(...)):
    try:
        hashed_password = hash_password(password)
        return {"hashed_password": hashed_password}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Error hashing password")


@router.post("/login", response_model=Token)
async def login(
    username: str = Form(...),
    password: str = Form(...),
):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(
                f"{DB_SERVICE_ENDPOINT}/users", params={"email": username}
            ) as db_response:
                if db_response.status == 404:
                    raise HTTPException(
                        status_code=404, detail="User not found in database service"
                    )
                user_data = await db_response.json()
                if not user_data or "password" not in user_data:
                    raise HTTPException(
                        status_code=400, detail="Invalid user data from DB service"
                    )

                if not verify_password(password, user_data["password"]):
                    raise HTTPException(
                        status_code=401, detail="Incorrect email or password"
                    )
                access_token = create_access_token(
                    data={"sub": user_data["user_id"]},
                    expires_delta=timedelta(minutes=30),
                )
                return Token(access_token=access_token, token_type="bearer")
        except aiohttp.ClientError as e:
            raise HTTPException(
                status_code=503,
                detail=f"Error connecting to the database service: {str(e)}",
            )
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.get("/verify-token")
def verify_token_route(token: str = Depends(oauth2_scheme)):
    payload = verify_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload
