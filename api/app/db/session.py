from collections.abc import Iterator

from sqlalchemy import create_engine, event
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings

db_url = str(settings.database_url)
is_sqlite = db_url.startswith("sqlite")

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False} if is_sqlite else {},
    pool_pre_ping=True,
    pool_recycle=3600 if not is_sqlite else -1,
)

if is_sqlite:
    @event.listens_for(engine, "connect")
    def set_sqlite_case_folding(dbapi_connection, _):
        dbapi_connection.create_function("lower", 1, lambda s: s.lower() if s else s)

SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)

def get_db() -> Iterator[Session]:
    with SessionLocal() as db:
        yield db
