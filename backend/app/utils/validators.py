import re
from sqlalchemy.orm import Session
from app.models.user import User

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")


def is_valid_email(email: str) -> bool:
    return bool(EMAIL_REGEX.match(email))


def check_duplicates(
    db: Session,
    user_id: str,
    user_name: str,
    email: str,
) -> str | None:
    if db.query(User).filter(User.user_id == user_id).first():
        return "User ID already exists"
    if db.query(User).filter(User.user_name == user_name).first():
        return "Username already exists"
    if db.query(User).filter(User.email == email).first():
        return "Email already registered"
    return None
