import logging
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from app.config import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()


def _normalize_db_url(url: str) -> str:
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg://", 1)
    return url


engine = create_engine(
    _normalize_db_url(settings.DATABASE_URL),
    pool_pre_ping=True,
    connect_args={"sslmode": "require"} if "sslmode=require" in settings.DATABASE_URL else {},
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _migrate_legacy_users_table(conn) -> None:
    """Align legacy Aiven/local schemas with the current User model."""
    inspector = inspect(engine)
    if "users" not in inspector.get_table_names():
        return

    cols = {c["name"] for c in inspector.get_columns("users")}

    # Rename legacy column names
    renames = [
        ("username", "user_name"),
        ("phone", "phone_number"),
    ]
    for old_name, new_name in renames:
        if old_name in cols and new_name not in cols:
            logger.info("Migrating users.%s -> users.%s", old_name, new_name)
            conn.execute(
                text(f'ALTER TABLE users RENAME COLUMN "{old_name}" TO "{new_name}"')
            )
            cols.remove(old_name)
            cols.add(new_name)

    # Consolidate legacy phone_no into phone_number
    if "phone_no" in cols and "phone_number" in cols:
        logger.info("Consolidating users.phone_no into users.phone_number")
        conn.execute(
            text(
                "UPDATE users SET phone_number = phone_no "
                "WHERE phone_number IS NULL OR phone_number = ''"
            )
        )
        conn.execute(text("ALTER TABLE users DROP COLUMN phone_no"))
        cols.discard("phone_no")
    elif "phone_no" in cols and "phone_number" not in cols:
        logger.info("Migrating users.phone_no -> users.phone_number")
        conn.execute(text('ALTER TABLE users RENAME COLUMN phone_no TO phone_number'))
        cols.remove("phone_no")
        cols.add("phone_number")

    # Add missing columns expected by the model
    additions = {
        "user_id": "VARCHAR(50)",
        "user_name": "VARCHAR(100)",
        "password": "VARCHAR(255)",
        "email": "VARCHAR(255)",
        "phone_number": "VARCHAR(20)",
        "created_at": "TIMESTAMPTZ DEFAULT NOW()",
    }
    for col_name, col_type in additions.items():
        if col_name not in cols:
            logger.info("Adding missing column users.%s", col_name)
            conn.execute(text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}"))


def init_db() -> None:
    """Create tables and migrate legacy schema. Import models first."""
    from app.models.user import User  # noqa: F401

    logger.info("Initializing database tables...")
    Base.metadata.create_all(bind=engine)

    with engine.begin() as conn:
        _migrate_legacy_users_table(conn)

    logger.info("Database ready. Tables: %s", list(Base.metadata.tables.keys()))
