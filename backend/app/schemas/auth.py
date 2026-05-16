from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    user_id: str = Field(..., min_length=3, max_length=50)
    user_name: str = Field(..., min_length=3, max_length=100)
    password: str = Field(..., min_length=6)
    email: EmailStr
    phone_number: str = Field(..., min_length=7, max_length=20)


class RegisterResponse(BaseModel):
    message: str
    user_id: str


class LoginRequest(BaseModel):
    user_name: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserResponse(BaseModel):
    id: int
    user_id: str
    user_name: str
    email: str
    phone_number: str

    class Config:
        from_attributes = True


class ProfileUpdateRequest(BaseModel):
    phone_number: str = Field(..., min_length=7, max_length=20)
