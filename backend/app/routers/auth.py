from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest,
    TokenResponse,
    UserResponse,
    ProfileUpdateRequest,
)
from app.services.auth_service import register_user, authenticate_user
from app.core.deps import get_current_user
from app.models.user import User

router = APIRouter()


@router.post("/register", response_model=RegisterResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    user = register_user(db, data)
    return RegisterResponse(message="Registration successful", user_id=user.user_id)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    token = authenticate_user(db, data.user_name, data.password)
    return TokenResponse(access_token=token)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/profile", response_model=UserResponse)
def update_profile(
    data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    current_user.phone_number = data.phone_number
    db.commit()
    db.refresh(current_user)
    return current_user
