from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
import os
import aiohttp

AUTH_SERVICE_ENDPOINT=os.getenv("AUTH_SERVICE_ENDPOINT", "http://localhost:8001/auth")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{AUTH_SERVICE_ENDPOINT}/login")

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/verify-token")
async def verify_user_token(token: str = Depends(oauth2_scheme)):
    headers = {'Authorization': f'Bearer {token}'}
    async with aiohttp.ClientSession() as session:
        try:
            async with session.get(f"{AUTH_SERVICE_ENDPOINT}/verify-token", headers=headers) as response:
                if response.status == 200:
                    user_data = await response.json()
                    return user_data 
                else:
                    detail = await response.text()
                    raise HTTPException(status_code=response.status, detail=detail)
        except aiohttp.ClientError as e:
            raise HTTPException(status_code=500, detail=str(e))