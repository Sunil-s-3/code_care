from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password, verify_password, create_access_token
from app.utils.validators import is_valid_email, check_duplicates


def register_user(db: Session, data: RegisterRequest) -> User:
    if not is_valid_email(str(data.email)):
        raise HTTPException(status_code=400, detail="Invalid email format")

    duplicate_msg = check_duplicates(db, data.user_id, data.user_name, str(data.email))
    if duplicate_msg:
        raise HTTPException(status_code=409, detail=duplicate_msg)

    user = User(
        user_id=data.user_id,
        user_name=data.user_name,
        password=hash_password(data.password),
        email=str(data.email),
        phone_number=data.phone_number,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def authenticate_user(db: Session, user_name: str, password: str) -> str:
    user = db.query(User).filter(User.user_name == user_name).first()
    if not user or not verify_password(password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
        )
    return create_access_token(subject=str(user.id))
