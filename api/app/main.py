from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import app.models  # noqa: F401
from app.api.router import api_router
from app.core.config import settings
from app.core.security import get_password_hash
from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.models.movie import Movie
from app.models.user import User

def seed_initial_movies(db: Session):
    if db.query(Movie).count() > 0:
        return

    sample_movies = [
        Movie(
            title="Интерстеллар",
            original_title="Interstellar",
            description="Когда засуха, пыльные бури и вымирание растений приводят человечество к продовольственному кризису, коллектив исследователей и учёных отправляется сквозь червоточину в поисках новой планеты с подходящими для человечества условиями жизни.",
            year=2014,
            director="Кристофер Нолан",
            genres="фантастика, драма, приключения",
            country="США, Великобритания",
            duration_minutes=169,
            rating=8.7,
            age_rating="16+",
            poster_url="https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
        ),
        Movie(
            title="Побег из Шоушенка",
            original_title="The Shawshank Redemption",
            description="Бухгалтер Энди Дюфрейн обвинён в убийстве собственной жены и её любовника. Оказавшись в тюрьме под названием Шоушенк, он сталкивается с жестокостью и беззаконием, но не теряет надежду и силу духа.",
            year=1994,
            director="Фрэнк Дарабонт",
            genres="драма, криминал",
            country="США",
            duration_minutes=142,
            rating=9.1,
            age_rating="16+",
            poster_url="https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
        ),
        Movie(
            title="Начало",
            original_title="Inception",
            description="Кобб — талантливый вор, лучший из лучших в опасном искусстве извлечения: он крадёт ценные секреты из глубин подсознания во время сна, когда человеческий разум наиболее уязвим.",
            year=2010,
            director="Кристофер Нолан",
            genres="фантастика, боевик, детектив",
            country="США, Великобритания",
            duration_minutes=148,
            rating=8.8,
            age_rating="16+",
            poster_url="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
        ),
        Movie(
            title="Матрица",
            original_title="The Matrix",
            description="Жизнь Томаса Андерсона разделена на две части: днём он обычный офисный служащий, а ночью — хакер Нео. Но однажды всё меняется, когда он узнаёт страшную правду о реальности.",
            year=1999,
            director="Лана Вачовски, Лилли Вачовски",
            genres="фантастика, боевик",
            country="США, Австралия",
            duration_minutes=136,
            rating=8.7,
            age_rating="16+",
            poster_url="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
        ),
        Movie(
            title="Криминальное чтиво",
            original_title="Pulp Fiction",
            description="Двое бандитов Винсент Вега и Джулс Виннфилд проводят время в философских беседах в перерывах между разборками и поручениями криминального босса Марселласа Уоллеса.",
            year=1994,
            director="Квентин Тарантино",
            genres="криминал, комедия, драма",
            country="США",
            duration_minutes=154,
            rating=8.9,
            age_rating="18+",
            poster_url="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
        ),
        Movie(
            title="Зеленая миля",
            original_title="The Green Mile",
            description="Пол Эджкомб — начальник блока смертников тюрьмы «Холодная гора». В блок поступает гигант Джон Коффи, обвинённый в страшном преступлении, но обладающий невероятным божественным даром целителя.",
            year=1999,
            director="Фрэнк Дарабонт",
            genres="драма, фэнтези, криминал",
            country="США",
            duration_minutes=189,
            rating=9.1,
            age_rating="16+",
            poster_url="https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=80",
        ),
        Movie(
            title="Властелин колец: Братство кольца",
            original_title="The Lord of the Rings: The Fellowship of the Ring",
            description="Сказания о Средиземье — это хроника Великой войны за Кольцо Всевластья. Темный Властелин Саурон стремится подчинить себе народы мира, а юному хоббиту Фродо выпала судьба уничтожить кольцо.",
            year=2001,
            director="Питер Джексон",
            genres="фэнтези, приключения, драма",
            country="Новая Зеландия, США",
            duration_minutes=178,
            rating=8.9,
            age_rating="12+",
            poster_url="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop&q=80",
        ),
        Movie(
            title="Джентльмены",
            original_title="The Gentlemen",
            description="Успешный выпускник Оксфорда придумал дерзкую схему нелегального обогащения. Но когда он решает продать свой прибыльный бизнес влиятельному клану миллиардеров, на его пути встают обаятельные, но жестокие джентльмены.",
            year=2019,
            director="Гай Ричи",
            genres="криминал, комедия, боевик",
            country="Великобритания, США",
            duration_minutes=113,
            rating=8.5,
            age_rating="18+",
            poster_url="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80",
        ),
        Movie(
            title="Унесённые призраками",
            original_title="Sen to Chihiro no kamikakushi",
            description="Маленькая девочка Тихиро вместе с родителями переезжает в новый дом. Заблудившись по дороге, они оказываются в таинственном безлюдном городке, где их ждёт заколдованный мир духов и волшебства.",
            year=2001,
            director="Хаяо Миядзаки",
            genres="аниме, мультфильм, фэнтези, приключения",
            country="Япония",
            duration_minutes=125,
            rating=8.5,
            age_rating="12+",
            poster_url="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
        ),
        Movie(
            title="Дюна: Часть вторая",
            original_title="Dune: Part Two",
            description="Пол Атрейдес объединяется с фременами, чтобы отомстить заговорщикам, уничтожившим его семью. Столкнувшись с выбором между любовью всей своей жизни и судьбой вселенной, он пытается предотвратить ужасное будущее.",
            year=2024,
            director="Дени Вильнёв",
            genres="фантастика, боевик, драма, приключения",
            country="США, Канада",
            duration_minutes=166,
            rating=8.6,
            age_rating="16+",
            poster_url="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&auto=format&fit=crop&q=80",
        ),
    ]
    db.add_all(sample_movies)
    db.commit()

def seed_initial_users(db: Session):
    admin_user = db.query(User).filter(User.login == settings.seed_admin_login).first()
    if not admin_user:
        admin_user = User(
            login=settings.seed_admin_login,
            name=settings.seed_admin_name,
            hashed_password=get_password_hash(settings.seed_admin_password),
            role=settings.role_admin,
            is_blocked=False,
            failed_attempts=0,
        )
        db.add(admin_user)

    regular_user = db.query(User).filter(User.login == settings.seed_user_login).first()
    if not regular_user:
        regular_user = User(
            login=settings.seed_user_login,
            name=settings.seed_user_name,
            hashed_password=get_password_hash(settings.seed_user_password),
            role=settings.role_user,
            is_blocked=False,
            failed_attempts=0,
        )
        db.add(regular_user)

    db.commit()

def check_and_migrate_db():
    from sqlalchemy import text
    with engine.connect() as conn:
        res = conn.execute(text("PRAGMA table_info(users)"))
        cols = [r[1] for r in res]
        if "blocked_until" not in cols:
            conn.execute(text("ALTER TABLE users ADD COLUMN blocked_until DATETIME"))
            conn.commit()

@asynccontextmanager
async def lifespan(_: FastAPI):
    Base.metadata.create_all(bind=engine)
    check_and_migrate_db()
    with SessionLocal() as db:
        seed_initial_users(db)
        seed_initial_movies(db)
    yield

app = FastAPI(title=settings.app_name, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
