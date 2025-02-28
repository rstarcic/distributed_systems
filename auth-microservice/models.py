from pydantic import BaseModel
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str

class User(BaseModel):
    email: str

class UserRegisterRequest(User):
    password: str

class UserRegisterResponse(User):
    user_id: str
    created_at: datetime

class UserLoginRequest(User):
    password: str
