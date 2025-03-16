from pydantic import BaseModel
from datetime import datetime

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str

class User(BaseModel):
    email: str

class UserRegisterResponse(BaseModel):
    hashed_password: str

class UserLoginRequest(User):
    password: str
