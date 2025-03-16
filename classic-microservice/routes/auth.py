from fastapi import APIRouter, Depends, HTTPException, Form
from fastapi.security import OAuth2PasswordBearer
import os
import aiohttp

AUTH_SERVICE_ENDPOINT=os.getenv("AUTH_SERVICE_ENDPOINT", "http://localhost:8001")
DB_SERVICE_ENDPOINT=os.getenv("DATABASE_SERVICE_ENDPOINT", "http://localhost:8004")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{AUTH_SERVICE_ENDPOINT}/auth/login")

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/verify-token")
async def verify_user_token(token: str = Depends(oauth2_scheme)):
    headers = {'Authorization': f'Bearer {token}'}
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{AUTH_SERVICE_ENDPOINT}/auth/verify-token", headers=headers) as response:
                if response.status == 200:
                    user_data = await response.json()
                    return user_data 
                else:
                    detail = await response.text()
                    raise HTTPException(status_code=response.status, detail=detail)
        except aiohttp.ClientError as e:
            raise HTTPException(status_code=500, detail=str(e))
        
@router.post("/registration", status_code=200)
async def register_user(
    email: str = Form(...),
    password: str = Form(...)):
    async with aiohttp.ClientSession() as session:
        try:
            async with session.post(f"{AUTH_SERVICE_ENDPOINT}/auth/register", data={"password": password}) as response:
                if response.status == 200:
                    hashed_password = (await response.json())["hashed_password"]
                    async with session.post(f"{DB_SERVICE_ENDPOINT}/users", json={"email": email, "password": hashed_password}) as db_response:
                        if db_response.status == 201:
                            return {"message": "User registered successfully", "status": "200"}
                        elif db_response.status == 409: 
                            detail = await db_response.text()
                            raise HTTPException(status_code=409, detail=detail)
                        else:
                            raise HTTPException(status_code=db_response.status, detail="Error storing user in database")
                else:
                    raise HTTPException(status_code=response.status, detail="Error in authentication service during registration")
        except aiohttp.ClientError as e:
            raise HTTPException(status_code=500, detail=str(e))
