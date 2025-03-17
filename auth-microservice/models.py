from pydantic import BaseModel

class Token(BaseModel):
    access_token: str
    token_type: str

class User(BaseModel):
    email: str

class UserRegisterResponse(BaseModel):
    hashed_password: str
    
class UserLoginRequest(BaseModel):
    user_id: str
    password: str
    hashed_password: str