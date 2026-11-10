export type ModuleId =
  | "auth"
  | "profile"
  | "dashboard"
  | "settings"
  | "movies"
  | "activity-log";

export interface FooterLink {
  label: string;
  href: string;
}

export interface CaptchaPiece {
  id: string;
  src: string;
  alt: string;
  correctIndex: number; // 0: TL, 1: TR, 2: BL, 3: BR
}

export interface CaptchaConfig {
  folder: string;
  instruction: string;
  successMessage: string;
  resetButton: string;
  pieces: CaptchaPiece[];
}

export interface SiteTheme {
  radius: string;
  font: {
    
    family: string;
    
    googleFontsUrl: string | null;
  };
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
}

export interface SiteTexts {
  nav: {
    ariaMain: string;
    ariaFooter: string;
    openMenu: string;
    closeMenu: string;
    signIn: string;
    signOut: string;
    skipToContent: string;
    dashboard: string;
    profile: string;
    movies: string;
    activityLog: string;
  };
  loading: {
    default: string;
    page: string;
  };
  notFound: {
    code: string;
    title: string;
    description: string;
    backHome: string;
  };
  errorBoundary: {
    title: string;
    description: string;
    retry: string;
    backHome: string;
  };
  auth: {
    checkingSession: string;
    toggleShowPassword: string;
    toggleHidePassword: string;
    login: {
      title: string;
      description: string;
      loginLabel: string;
      loginPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      submitButton: string;
      submittingButton: string;
      successMessage: string;
      invalidCredentialsError: string;
      blockedError: string;
      tempBlockedTitle: string;
      tempBlockedMessage: string;
      lockoutTimerPrefix: string;
      lockoutExpiredMessage: string;
      captchaRequired: string;
      validationError: string;
      genericError: string;
      noAccountPrompt: string;
      registerLink: string;
    };
    register: {
      title: string;
      description: string;
      loginLabel: string;
      loginPlaceholder: string;
      nameLabel: string;
      namePlaceholder: string;
      emailLabel: string;
      emailPlaceholder: string;
      passwordLabel: string;
      passwordPlaceholder: string;
      passwordHint: string;
      confirmPasswordLabel: string;
      confirmPasswordPlaceholder: string;
      submitButton: string;
      submittingButton: string;
      successMessage: string;
      captchaRequired: string;
      validationError: string;
      genericError: string;
      hasAccountPrompt: string;
      loginLink: string;
    };
    profile: {
      title: string;
      description: string;
      adminPanelLink: string;
      changePasswordTitle: string;
      oldPasswordLabel: string;
      oldPasswordPlaceholder: string;
      newPasswordLabel: string;
      newPasswordPlaceholder: string;
      confirmPasswordLabel: string;
      confirmPasswordPlaceholder: string;
      submitChange: string;
      changing: string;
      successChange: string;
    };
  };
  dashboard: {
    title: string;
    description: string;
    refreshButton: string;
    addUserButton: string;
    statsTotalUsers: string;
    statsAdmins: string;
    statsBlocked: string;
    tableTitle: string;
    tableDescription: string;
    searchPlaceholder: string;
    noUsersFound: string;
    columns: {
      login: string;
      name: string;
      role: string;
      status: string;
      attempts: string;
      actions: string;
    };
    statusActive: string;
    statusBlocked: string;
    unblockButton: string;
    editButton: string;
    youBadge: string;
    addUserDialog: {
      title: string;
      description: string;
      loginLabel: string;
      nameLabel: string;
      passwordLabel: string;
      roleLabel: string;
      errorTitle: string;
      submitButton: string;
      cancelButton: string;
    };
    editUserDialog: {
      title: string;
      loginPrefix: string;
      nameLabel: string;
      roleLabel: string;
      blockedLabel: string;
      errorTitle: string;
      submitButton: string;
      cancelButton: string;
      selfDemoteWarning: string;
      selfBlockWarning: string;
    };
  };
  movies: {
    title: string;
    description: string;
    searchPlaceholder: string;
    allGenres: string;
    genreLabel: string;
    sortByLabel: string;
    sortOptions: {
      ratingDesc: string;
      ratingAsc: string;
      yearDesc: string;
      yearAsc: string;
      titleAsc: string;
    };
    minRatingLabel: string;
    yearFromLabel: string;
    yearToLabel: string;
    resetFilters: string;
    emptyList: string;
    addMovieButton: string;
    editMovieButton: string;
    deleteMovieButton: string;
    minutesUnit: string;
    backToList: string;
    titleLabel: string;
    detailsTitle: string;
    directorLabel: string;
    yearLabel: string;
    countryLabel: string;
    durationLabel: string;
    ratingLabel: string;
    genresLabel: string;
    ageRatingLabel: string;
    descriptionLabel: string;
    originalTitleLabel: string;
    posterUrlLabel: string;
    addDialog: {
      title: string;
      description: string;
      submitButton: string;
      cancelButton: string;
    };
    editDialog: {
      title: string;
      description: string;
      submitButton: string;
      cancelButton: string;
    };
    deleteDialog: {
      title: string;
      description: string;
      confirmButton: string;
      cancelButton: string;
    };
  };
  activityLog: {
    title: string;
    description: string;
    refreshButton: string;
    searchPlaceholder: string;
    filterEntityAll: string;
    filterEntityAuth: string;
    filterEntityMovie: string;
    filterEntityUser: string;
    tableColumns: {
      date: string;
      user: string;
      category: string;
      action: string;
      details: string;
      status: string;
    };
    statusSuccess: string;
    statusFailure: string;
    emptyList: string;
  };
  home: {
    heroBadge: string;
    heroTitle: string;
    heroSubtitle: string;
    exploreCatalog: string;
    signInPrompt: string;
    statsFilms: string;
    statsGenres: string;
    statsTopRating: string;
    topMoviesTitle: string;
    topMoviesDescription: string;
    allMoviesButton: string;
    guestLockTitle: string;
    guestLockDesc: string;
    guestSignIn: string;
    guestSignUp: string;
    featuresTitle: string;
    featuresDescription: string;
    features: {
      catalogTitle: string;
      catalogDesc: string;
      filterTitle: string;
      filterDesc: string;
      securityTitle: string;
      securityDesc: string;
      auditTitle: string;
      auditDesc: string;
    };
  };
}

export interface SiteConfig {
  
  name: string;
  tagline: string;
  description: string;
  logo: {
    src: string;
    alt: string;
  };
  
  storageKey: string;
  api: {
    baseUrl: string;
    provider: "fastapi" | "supabase";
  };
  roles: {
    admin: string;
    user: string;
  };
  auth: {
    maxFailedAttempts: number;
    lockoutDurationSeconds: number;
    redirectDelayMs: number;
    passwordRules: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireDigit: boolean;
      requireSpecial: boolean;
    };
  };
  captcha: CaptchaConfig;
  theme: SiteTheme;
  
  modules: ModuleId[];
  footerLinks: FooterLink[];
  texts: SiteTexts;
}

export const siteConfig: SiteConfig = {
  name: "КиноКаталог",
  tagline: "Интерактивная коллекция и витрина лучших фильмов",
  description: "Каталог кинолент с подробными данными, рейтингами, интеллектуальной фильтрацией, панелью управления и журналом аудита.",
  logo: {
    src: "/logo.svg",
    alt: "Логотип КиноКаталога",
  },
  storageKey: "cinema-catalog",
  api: {
    baseUrl: (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) || "/api",
    provider: "fastapi",
  },
  roles: {
    admin: "Администратор",
    user: "Пользователь",
  },
  auth: {
    maxFailedAttempts: 3,
    lockoutDurationSeconds: 60,
    redirectDelayMs: 700,
    passwordRules: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireDigit: true,
      requireSpecial: true,
    },
  },
  captcha: {
    folder: "/captcha",
    instruction: "Соберите картинку 2х2: перетаскивайте фрагменты мышью, меняя их местами.",
    successMessage: "Пазл собран верно! Капча пройдена.",
    resetButton: "Перемешать заново",
    pieces: [
      {
        id: "quadrant-1",
        src: "/captcha/1.png",
        alt: "Фрагмент 1 (Верх-лево)",
        correctIndex: 0,
      },
      {
        id: "quadrant-2",
        src: "/captcha/2.png",
        alt: "Фрагмент 2 (Верх-право)",
        correctIndex: 1,
      },
      {
        id: "quadrant-3",
        src: "/captcha/3.png",
        alt: "Фрагмент 3 (Низ-лево)",
        correctIndex: 2,
      },
      {
        id: "quadrant-4",
        src: "/captcha/4.png",
        alt: "Фрагмент 4 (Низ-право)",
        correctIndex: 3,
      },
    ],
  },
  theme: {
    radius: "0.5rem",
    font: {
      family: "'Manrope', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      googleFontsUrl:
        "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap",
    },
    colors: {
      background: "40 20% 98%",
      foreground: "160 20% 12%",
      card: "0 0% 100%",
      cardForeground: "160 20% 12%",
      popover: "0 0% 100%",
      popoverForeground: "160 20% 12%",
      primary: "165 33% 28%",
      primaryForeground: "40 20% 98%",
      secondary: "40 18% 92%",
      secondaryForeground: "160 20% 12%",
      muted: "40 14% 94%",
      mutedForeground: "160 8% 38%",
      accent: "40 18% 92%",
      accentForeground: "160 20% 12%",
      destructive: "0 72% 45%",
      destructiveForeground: "0 0% 100%",
      border: "40 12% 86%",
      input: "40 12% 86%",
      ring: "165 33% 28%",
    },
  },
  modules: ["auth", "movies", "activity-log", "dashboard", "profile"],
  footerLinks: [
    { label: "Главная", href: "/" },
    { label: "Кинокаталог", href: "/movies" },
  ],
  texts: {
    nav: {
      ariaMain: "Основная навигация",
      ariaFooter: "Навигация в подвале",
      openMenu: "Открыть главное меню",
      closeMenu: "Закрыть главное меню",
      signIn: "Войти",
      signOut: "Выйти",
      skipToContent: "Перейти к основному содержимому",
      dashboard: "Администрирование",
      profile: "Профиль",
      movies: "Кинокаталог",
      activityLog: "Журнал действий",
    },
    loading: {
      default: "Загрузка…",
      page: "Загрузка страницы…",
    },
    notFound: {
      code: "404",
      title: "Страница не найдена",
      description: "Такого адреса нет или страница была перемещена.",
      backHome: "На главную",
    },
    errorBoundary: {
      title: "Что-то пошло не так",
      description: "Произошла непредвиденная ошибка при загрузке содержимого.",
      retry: "Попробовать снова",
      backHome: "На главную",
    },
    auth: {
      checkingSession: "Проверка авторизации…",
      toggleShowPassword: "Показать пароль",
      toggleHidePassword: "Скрыть пароль",
      login: {
        title: "Вход в систему",
        description: "Форма для авторизации зарегистрированных пользователей",
        loginLabel: "Логин",
        loginPlaceholder: "Введите логин",
        passwordLabel: "Пароль",
        passwordPlaceholder: "Введите пароль",
        submitButton: "Войти",
        submittingButton: "Авторизация...",
        successMessage: "Вы успешно авторизовались",
        invalidCredentialsError: "Вы ввели неверный логин или пароль. Пожалуйста проверьте ещё раз введенные данные",
        blockedError: "Вы заблокированы. Обратитесь к администратору",
        tempBlockedTitle: "Временная блокировка учётной записи",
        tempBlockedMessage: "Превышено количество попыток входа (3). Повторите попытку через:",
        lockoutTimerPrefix: "Блокировка истечёт через",
        lockoutExpiredMessage: "Срок блокировки истёк. Вы можете повторить попытку входа.",
        captchaRequired: "Пожалуйста, соберите пазл капчи перед отправкой",
        validationError: "Пожалуйста, заполните все обязательные поля и соберите пазл капчи.",
        genericError: "Произошла непредвиденная ошибка. Проверьте подключение к серверу.",
        noAccountPrompt: "Ещё нет учётной записи?",
        registerLink: "Зарегистрироваться",
      },
      register: {
        title: "Регистрация нового пользователя",
        description: "Заполните поля для создания учётной записи",
        loginLabel: "Логин",
        loginPlaceholder: "Придумайте логин (латиница, цифры)",
        nameLabel: "ФИО / Имя пользователя",
        namePlaceholder: "Иванов Иван",
        emailLabel: "Email (необязательно)",
        emailPlaceholder: "ivan@example.com",
        passwordLabel: "Пароль",
        passwordPlaceholder: "Минимум 8 символов (заглавная, строчная, цифра, спецсимвол)",
        passwordHint: "Требования к паролю: минимум 8 символов, хотя бы одна заглавная буква, одна строчная буква, одна цифра и один специальный символ.",
        confirmPasswordLabel: "Подтверждение пароля",
        confirmPasswordPlaceholder: "Повторите пароль",
        submitButton: "Зарегистрироваться",
        submittingButton: "Регистрация...",
        successMessage: "Вы успешно зарегистрировались и авторизовались!",
        captchaRequired: "Пожалуйста, соберите пазл капчи перед отправкой",
        validationError: "Пожалуйста, проверьте правильность заполнения всех обязательных полей.",
        genericError: "Произошла ошибка при регистрации. Проверьте данные и повторите попытку.",
        hasAccountPrompt: "Уже зарегистрированы?",
        loginLink: "Войти",
      },
      profile: {
        title: "Личный кабинет",
        description: "Профиль пользователя и параметры учётной записи",
        adminPanelLink: "Панель администратора",
        changePasswordTitle: "Смена пароля",
        oldPasswordLabel: "Текущий пароль",
        oldPasswordPlaceholder: "Введите текущий пароль",
        newPasswordLabel: "Новый пароль",
        newPasswordPlaceholder: "Минимум 8 символов (A-Z, a-z, 0-9, спецсимвол)",
        confirmPasswordLabel: "Подтвердите новый пароль",
        confirmPasswordPlaceholder: "Повторите новый пароль",
        submitChange: "Изменить пароль",
        changing: "Сохранение...",
        successChange: "Пароль успешно изменён!",
      },
    },
    dashboard: {
      title: "Рабочий стол администратора",
      description: "Управление пользователями, ролями и снятие блокировок",
      refreshButton: "Обновить",
      addUserButton: "Добавить пользователя",
      statsTotalUsers: "Всего пользователей",
      statsAdmins: "Администраторов",
      statsBlocked: "Заблокированных аккаунтов",
      tableTitle: "Список пользователей",
      tableDescription: "Просмотр, редактирование прав и снятие блокировок",
      searchPlaceholder: "Поиск по логину или имени...",
      noUsersFound: "Пользователи не найдены.",
      columns: {
        login: "Логин",
        name: "Имя",
        role: "Роль",
        status: "Статус",
        attempts: "Ошибок входа",
        actions: "Действия",
      },
      statusActive: "Активен",
      statusBlocked: "Заблокирован",
      unblockButton: "Снять блокировку",
      editButton: "Изменить",
      youBadge: "(Вы)",
      addUserDialog: {
        title: "Добавление нового пользователя",
        description: "Введите данные пользователя. Система проверит уникальность логина.",
        loginLabel: "Логин",
        nameLabel: "Имя пользователя",
        passwordLabel: "Пароль",
        roleLabel: "Роль пользователя",
        errorTitle: "Ошибка при добавлении",
        submitButton: "Создать пользователя",
        cancelButton: "Отмена",
      },
      editUserDialog: {
        title: "Редактирование пользователя",
        loginPrefix: "Логин: ",
        nameLabel: "Имя пользователя",
        roleLabel: "Роль",
        blockedLabel: "Учётная запись заблокирована",
        errorTitle: "Ошибка сохранения",
        submitButton: "Сохранить изменения",
        cancelButton: "Отмена",
        selfDemoteWarning: "Администратор не может снять с себя права администратора.",
        selfBlockWarning: "Администратор не может заблокировать сам себя.",
      },
    },
    movies: {
      title: "Кинокаталог",
      description: "Коллекция шедевров мирового кинематографа с детальной информацией, рейтингами и фильтрацией",
      searchPlaceholder: "Поиск по названию или режиссёру...",
      allGenres: "Все жанры",
      genreLabel: "Жанр",
      sortByLabel: "Сортировка",
      sortOptions: {
        ratingDesc: "Сначала высокий рейтинг",
        ratingAsc: "Сначала низкий рейтинг",
        yearDesc: "Сначала новые (по году)",
        yearAsc: "Сначала старые (по году)",
        titleAsc: "По названию (А-Я)",
      },
      minRatingLabel: "Рейтинг от",
      yearFromLabel: "Год от",
      yearToLabel: "до",
      resetFilters: "Сбросить фильтры",
      emptyList: "Фильмы по заданным критериям не найдены.",
      addMovieButton: "Добавить фильм",
      editMovieButton: "Редактировать",
      deleteMovieButton: "Удалить",
      minutesUnit: "мин.",
      backToList: "Вернуться в каталог",
      titleLabel: "Название фильма",
      detailsTitle: "О фильме",
      directorLabel: "Режиссёр",
      yearLabel: "Год выпуска",
      countryLabel: "Страна",
      durationLabel: "Длительность",
      ratingLabel: "Рейтинг",
      genresLabel: "Жанры",
      ageRatingLabel: "Возрастной рейтинг",
      descriptionLabel: "Описание",
      originalTitleLabel: "Оригинальное название",
      posterUrlLabel: "Ссылка на постер",
      addDialog: {
        title: "Добавление фильма",
        description: "Заполните карточку фильма для каталога.",
        submitButton: "Добавить фильм",
        cancelButton: "Отмена",
      },
      editDialog: {
        title: "Редактирование фильма",
        description: "Измените параметры фильма в каталоге.",
        submitButton: "Сохранить изменения",
        cancelButton: "Отмена",
      },
      deleteDialog: {
        title: "Удаление фильма",
        description: "Вы уверены, что хотите удалить фильм «{title}»? Это действие нельзя будет отменить.",
        confirmButton: "Удалить фильм",
        cancelButton: "Отмена",
      },
    },
    activityLog: {
      title: "Журнал действий",
      description: "Аудит событий системы: авторизации, операции с фильмами и управление пользователями",
      refreshButton: "Обновить",
      searchPlaceholder: "Поиск по пользователю или событию...",
      filterEntityAll: "Все категории",
      filterEntityAuth: "Авторизация",
      filterEntityMovie: "Фильмы",
      filterEntityUser: "Пользователи",
      tableColumns: {
        date: "Дата и время",
        user: "Пользователь",
        category: "Категория",
        action: "Действие",
        details: "Подробности события",
        status: "Статус",
      },
      statusSuccess: "Успешно",
      statusFailure: "Ошибка",
      emptyList: "Записи в журнале действий не найдены.",
    },
    home: {
      heroBadge: "Полнофункциональный модульный проект",
      heroTitle: "КиноКаталог",
      heroSubtitle: "Интерактивная коллекция и витрина мирового кинематографа. Исследуйте шедевры, находите новинки по жанрам и годам, управляйте каталогом и отслеживайте аудит действий.",
      exploreCatalog: "Перейти в кинокаталог",
      signInPrompt: "Войти для просмотра каталога",
      statsFilms: "Фильмов в коллекции",
      statsGenres: "Жанров кинематографа",
      statsTopRating: "Максимальный рейтинг",
      topMoviesTitle: "Избранные шедевры",
      topMoviesDescription: "Лучшие фильмы каталога с наивысшими оценками зрителей и критиков",
      allMoviesButton: "Смотреть все фильмы",
      guestLockTitle: "Доступ к каталогу только для зарегистрированных зрителей",
      guestLockDesc: "Войдите в систему или создайте учётную запись, чтобы просматривать карточки фильмов, искать по жанрам и годам.",
      guestSignIn: "Войти в аккаунт",
      guestSignUp: "Зарегистрироваться",
      featuresTitle: "Архитектура и возможности",
      featuresDescription: "Как устроен КиноКаталог на базе масштабируемых и переиспользуемых модулей",
      features: {
        catalogTitle: "Модуль каталога",
        catalogDesc: "Сетка фильмов с постерами, карточками, пагинацией, фильтрами по жанрам, годам и рейтингам, а также отдельной страницей фильма.",
        filterTitle: "Быстрый поиск и фильтры",
        filterDesc: "Динамическая фильтрация с поиском по режиссёру и названию, чипсами жанров и множественной сортировкой.",
        securityTitle: "Авторизация и капча 2х2",
        securityDesc: "JWT сессии, защита от подбора паролей с блокировкой после 3 неудачных попыток и интерактивная капча-пазл.",
        auditTitle: "Журнал аудита действий",
        auditDesc: "Детальная фиксация всех операций в реальном времени: входы, смены паролей, добавление и редактирование фильмов.",
      },
    },
  },
};

export const isModuleEnabled = (id: ModuleId): boolean =>
  siteConfig.modules.includes(id);
