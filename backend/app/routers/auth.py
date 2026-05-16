import logging
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

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    logger.info("Register request: user_id=%s user_name=%s email=%s", data.user_id, data.user_name, data.email)
    user = register_user(db, data)
    return RegisterResponse(message="Registration successful", user_id=user.user_id)


@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    logger.info("Login request: user_name=%s", data.user_name)
    token = authenticate_user(db, data.user_name, data.password)
    return TokenResponse(access_token=token, token_type="bearer")


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("/profile", response_model=UserResponse)
def update_profile(
    data: ProfileUpdateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        current_user.phone_number = data.phone_number.strip()
        db.commit()
        db.refresh(current_user)
        return current_user
    except Exception as e:
        db.rollback()
        logger.exception("Profile update failed: %s", e)
        raise HTTPException(status_code=500, detail="Failed to update profile")
