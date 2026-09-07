// Internationalization dictionary

type Dict = Record<string, Record<string, string>>;

const dict: Dict = {
  ru: {
    // Splash
    appName: 'Bloom',
    appSlogan: 'Расцветай каждый день',
    // Onboarding
    welcome: 'Давай знакомиться',
    yourName: 'Как тебя зовут?',
    namePlaceholder: 'Введи имя',
    mottoLabel: 'Твой девиз',
    mottoPlaceholder: 'Например: Каждый день — новый шанс',
    next: 'Далее',
    chooseIcon: 'Выбери свой значок',
    start: 'Начать',
    skip: 'Пропустить',
    // Header
    today: 'Сегодня',
    schedule: 'Расписание',
    goals: 'Цели',
    menu: 'Меню',
    // Today
    habits: 'Привычки',
    tasks: 'Задачи',
    addHabit: '+ Привычка',
    newTask: 'Новая задача…',
    // Schedule
    scheduleTitle: 'Расписание · по дням недели',
    addEvent: '+ Новое событие',
    now: 'СЕЙЧАС',
    // Goals
    goalsTitle: 'Цели · большие ориентиры',
    addGoal: '+ Новая цель',
    achieved: 'Выполнено!',
    // Menu
    profile: 'Профиль',
    profileDesc: 'личная карточка',
    manageLists: 'Управление списками',
    manageListsDesc: 'Привычки · Задачи · Завершённые',
    settings: 'Настройки',
    settingsDesc: 'язык, темы, аккаунт',
    tools: 'Инструменты',
    toolsDesc: 'lo-fi · Помодоро',
    // Profile
    name: 'Имя',
    motto: 'Девиз',
    iconLabel: 'Значок',
    save: 'Сохранить',
    saved: 'Сохранено!',
    achievements: 'Достижения',
    habitsDone: 'привычек выполнено',
    bestStreak: 'лучшая серия',
    tasksTodayLabel: 'задач сегодня',
    goalsReached: 'целей достигнуто',
    // Settings
    language: 'Язык',
    theme: 'Тема',
    themePink: 'Розовый',
    themeLavender: 'Лавандовый',
    themeMint: 'Мятный',
    logoutAccount: 'Выйти из аккаунта',
    logout: 'Выйти',
    logoutConfirm: 'Все данные будут удалены. Продолжить?',
    yes: 'Да',
    no: 'Нет',
    cancel: 'Отмена',
    delete: 'Удалить',
    deleteConfirm: 'Удалить этот элемент?',
    // Modals
    configureHabit: 'Настроить привычку',
    configureEvent: 'Настроить событие',
    configureGoal: 'Настроить цель',
    habitName: 'Название',
    startTime: 'Время начала',
    duration: 'Длительность',
    auto: 'Авто',
    manual: 'Вручную',
    minutes: 'мин',
    daysOfWeek: 'Дни недели',
    icon: 'Значок',
    note: 'Заметка',
    notePlaceholder: 'Локация, ссылка, комментарий…',
    unit: 'Единица',
    unitPlaceholder: 'книг, слов, км…',
    quantity: 'Количество',
    // Tools
    lofiPlayer: 'Lo-fi плеер',
    pomodoro: 'Помодоро',
    play: 'Играть',
    pause: 'Пауза',
    volume: 'Громкость',
    nowPlaying: 'Сейчас играет',
    start2: 'Старт',
    reset: 'Сброс',
    focus: 'Фокус',
    break: 'Перерыв',
    focusTip: 'Фокусируйся {focus} минут — потом отдых {break} мин.',
    // Manage
    allHabits: 'Все привычки',
    allTasks: 'Все задачи',
    completed: 'Завершённые',
    noItems: 'Пока пусто',
    restore: 'Восстановить',
    // Days
    mon: 'Пн', tue: 'Вт', wed: 'Ср', thu: 'Чт', fri: 'Пт', sat: 'Сб', sun: 'Вс',
    // Months
    jan: 'января', feb: 'февраля', mar: 'марта', apr: 'апреля',
    may: 'мая', jun: 'июня', jul: 'июля', aug: 'августа',
    sep: 'сентября', oct: 'октября', nov: 'ноября', dec: 'декабря',
    // Day names full
    monday: 'понедельник', tuesday: 'вторник', wednesday: 'среда',
    thursday: 'четверг', friday: 'пятница', saturday: 'суббота', sunday: 'воскресенье',
    // Misc
    defaultDuration: '≈ {min} мин · стандартный час',
    step: 'шаг',
  },
  en: {
    appName: 'Bloom',
    appSlogan: 'Bloom every day',
    welcome: "Let's get acquainted",
    yourName: "What's your name?",
    namePlaceholder: 'Enter your name',
    mottoLabel: 'Your motto',
    mottoPlaceholder: 'e.g.: Every day is a new chance',
    next: 'Next',
    chooseIcon: 'Choose your icon',
    start: 'Start',
    skip: 'Skip',
    today: 'Today',
    schedule: 'Schedule',
    goals: 'Goals',
    menu: 'Menu',
    habits: 'Habits',
    tasks: 'Tasks',
    addHabit: '+ Habit',
    newTask: 'New task…',
    scheduleTitle: 'Schedule · by weekday',
    addEvent: '+ New event',
    now: 'NOW',
    goalsTitle: 'Goals · big milestones',
    addGoal: '+ New goal',
    achieved: 'Achieved!',
    profile: 'Profile',
    profileDesc: 'personal card',
    manageLists: 'Manage lists',
    manageListsDesc: 'Habits · Tasks · Completed',
    settings: 'Settings',
    settingsDesc: 'language, themes, account',
    tools: 'Tools',
    toolsDesc: 'lo-fi · Pomodoro',
    name: 'Name',
    motto: 'Motto',
    iconLabel: 'Icon',
    save: 'Save',
    saved: 'Saved!',
    achievements: 'Achievements',
    habitsDone: 'habits completed',
    bestStreak: 'best streak',
    tasksTodayLabel: 'tasks today',
    goalsReached: 'goals reached',
    language: 'Language',
    theme: 'Theme',
    themePink: 'Pink',
    themeLavender: 'Lavender',
    themeMint: 'Mint',
    logoutAccount: 'Log out',
    logout: 'Log out',
    logoutConfirm: 'All data will be deleted. Continue?',
    yes: 'Yes',
    no: 'No',
    cancel: 'Cancel',
    delete: 'Delete',
    deleteConfirm: 'Delete this item?',
    configureHabit: 'Configure habit',
    configureEvent: 'Configure event',
    configureGoal: 'Configure goal',
    habitName: 'Name',
    startTime: 'Start time',
    duration: 'Duration',
    auto: 'Auto',
    manual: 'Manual',
    minutes: 'min',
    daysOfWeek: 'Days of week',
    icon: 'Icon',
    note: 'Note',
    notePlaceholder: 'Location, link, comment…',
    unit: 'Unit',
    unitPlaceholder: 'books, words, km…',
    quantity: 'Quantity',
    lofiPlayer: 'Lo-fi player',
    pomodoro: 'Pomodoro',
    play: 'Play',
    pause: 'Pause',
    volume: 'Volume',
    nowPlaying: 'Now playing',
    start2: 'Start',
    reset: 'Reset',
    focus: 'Focus',
    break: 'Break',
    focusTip: 'Focus for {focus} minutes — then rest {break} min.',
    allHabits: 'All habits',
    allTasks: 'All tasks',
    completed: 'Completed',
    noItems: 'Nothing yet',
    restore: 'Restore',
    mon: 'Mo', tue: 'Tu', wed: 'We', thu: 'Th', fri: 'Fr', sat: 'Sa', sun: 'Su',
    jan: 'January', feb: 'February', mar: 'March', apr: 'April',
    may: 'May', jun: 'June', jul: 'July', aug: 'August',
    sep: 'September', oct: 'October', nov: 'November', dec: 'December',
    monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday',
    thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday', sunday: 'Sunday',
    defaultDuration: '≈ {min} min · default hour',
    step: 'step',
  },
};

export function t(key: string, lang: 'ru' | 'en', params?: Record<string, string | number>): string {
  let str = dict[lang]?.[key] || dict['ru'][key] || key;
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      str = str.replace(`{${k}}`, String(v));
    });
  }
  return str;
}

export function getDayName(dayIndex: number, lang: 'ru' | 'en'): string {
  const keys = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return t(keys[dayIndex], lang);
}

export function getFullDayName(dayIndex: number, lang: 'ru' | 'en'): string {
  const keys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  return t(keys[dayIndex], lang);
}

export function getMonthName(monthIndex: number, lang: 'ru' | 'en'): string {
  const keys = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return t(keys[monthIndex], lang);
}

export function formatDate(date: Date, lang: 'ru' | 'en'): string {
  const dayName = getFullDayName(date.getDay(), lang);
  const day = date.getDate();
  const month = getMonthName(date.getMonth(), lang);
  if (lang === 'ru') {
    return `${dayName}, ${day} ${month}`;
  }
  return `${dayName}, ${month} ${day}`;
}

export default dict;
