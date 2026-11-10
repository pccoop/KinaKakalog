from pydantic_settings import BaseSettings, SettingsConfigDict
from sqlalchemy.engine import URL

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Site Template API"
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]

    secret_key: str = "site-template-super-secret-key-change-in-production-2026"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    refresh_token_expire_days: int = 7

    database_url_override: str | None = None
    use_sqlite: bool = True

    mysql_host: str = "127.0.0.1"
    mysql_port: int = 3306
    mysql_user: str = "app"
    mysql_password: str = "app"
    mysql_database: str = "site_template"

    max_failed_attempts: int = 3
    lockout_duration_seconds: int = 60
    role_admin: str = "Администратор"
    role_user: str = "Пользователь"

    msg_invalid_credentials: str = (
        "Вы ввели неверный логин или пароль. Пожалуйста проверьте ещё раз введенные данные"
    )
    msg_blocked: str = "Вы заблокированы. Обратитесь к администратору"
    msg_login_exists: str = "Пользователь с указанным логином уже существует"
    msg_success_login: str = "Вы успешно авторизовались"
    msg_self_demote_forbidden: str = (
        "Администратор не может снять с себя права администратора"
    )
    msg_self_block_forbidden: str = "Администратор не может заблокировать сам себя"

    seed_admin_login: str = "admin"
    seed_admin_password: str = "Admin123!"
    seed_admin_name: str = "Главный Администратор"

    seed_user_login: str = "user"
    seed_user_password: str = "User123!"
    seed_user_name: str = "Иван Иванов"

    @property
    def database_url(self) -> str | URL:
        if self.database_url_override:
            return self.database_url_override
        if self.use_sqlite:
            return "sqlite:///./site_template.db"
        return URL.create(
            "mysql+pymysql",
            username=self.mysql_user,
            password=self.mysql_password,
            host=self.mysql_host,
            port=self.mysql_port,
            database=self.mysql_database,
            query={"charset": "utf8mb4"},
        )

settings = Settings()
