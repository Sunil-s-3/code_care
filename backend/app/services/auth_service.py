import logging
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password, verify_password, create_access_token
from app.utils.validators import is_valid_email, check_duplicates

logger = logging.getLogger(__name__)


def register_user(db: Session, data: RegisterRequest) -> User:
    if not is_valid_email(str(data.email)):
        raise HTTPException(status_code=400, detail="Invalid email format")

    duplicate_msg = check_duplicates(db, data.user_id, data.user_name, str(data.email))
    if duplicate_msg:
        raise HTTPException(status_code=409, detail=duplicate_msg)

    try:
        user = User(
            user_id=data.user_id.strip(),
            user_name=data.user_name.strip(),
            password=hash_password(data.password),
            email=str(data.email).strip().lower(),
            phone_number=data.phone_number.strip(),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        logger.info("User registered: user_id=%s user_name=%s", user.user_id, user.user_name)
        return user
    except IntegrityError as e:
        db.rollback()
        logger.warning("Registration integrity error: %s", e)
        raise HTTPException(
            status_code=409,
            detail="User ID, username, or email already exists",
        )
    except Exception as e:
        db.rollback()
        logger.exception("Registration failed: %s", e)
        raise HTTPException(
            status_code=500,
            detail="Registration failed. Please try again.",
        )


def authenticate_user(db: Session, user_name: str, password: str) -> str:
    try:
        user = db.query(User).filter(User.user_name == user_name.strip()).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid username or password",
            )
        logger.info("User logged in: user_name=%s", user.user_name)
        return create_access_token(subject=str(user.id))
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Login failed: %s", e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Login failed. Please try again.",
        )
