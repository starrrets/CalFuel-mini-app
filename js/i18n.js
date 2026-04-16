/**
 * Internationalization module for the Calorie Tracker Telegram Mini App
 * 
 * Handles multi-language support (Russian default + English, Ukrainian, Spanish,
 * German, French, Belarusian). Uses data-i18n and data-i18n-placeholder attributes.
 * All text and placeholders are updated dynamically via renderAllTexts().
 */

const translations = {
  ru: {
    flag: "ru", name: "Русский",
    title: "Трекер калорий",
    unitKcal: "ккал",
    eaten: "Съедено",
    remaining: "Осталось",
    today: "Сегодня",
    myFoods: "Мои блюда",
    history: "История",
    profile: "Профиль",
    addMeal: "+ Добавить приём пищи",
    foodNamePlaceholder: "Название блюда",
    caloriesPlaceholder: "Калории",
    proteins: "Белки",
    fats: "Жиры",
    carbs: "Углеводы",
    proteinsPlaceholder: "Белки (г)",
    fatsPlaceholder: "Жиры (г)",
    carbsPlaceholder: "Углеводы (г)",
    addFoodToBase: "Добавить в базу",
    quickAdd: "Быстрое добавление",
    whatDidYouEat: "Что ты съел?",
    calories: "Калории",
    add: "Добавить",
    ageLabel: "Возраст",
    agePlaceholder: "Возраст",
    genderMale: "Мужской",
    genderFemale: "Женский",
    unitsMetric: "Метрическая",
    unitsImperial: "Имперская",
    heightMetric: "Рост (см)",
    heightImperial: "Рост (дюймы)",
    weightMetric: "Вес (кг)",
    weightImperial: "Вес (фунты)",
    activityLabel: "Уровень активности",
    activitySedentary: "Сидячий",
    activityLight: "Лёгкий",
    activityModerate: "Умеренный",
    activityHigh: "Высокий",
    activityVeryHigh: "Очень высокий",
    goalLabel: "Цель",
    goalMaintain: "Поддержание",
    goalDeficit: "Дефицит",
    goalSurplus: "Профицит",
    goalPercentLabel: "Процент",
    goalPercentPlaceholder: "%",
    saveProfile: "Сохранить профиль",
    fillFields: "Заполните все поля",
    dishAdded: "Блюдо добавлено в базу",
    recordAdded: "Запись добавлена",
    profileSaved: "Профиль сохранён",
    addedTemplate: "{name} ({calories} ккал) добавлено",
    deleteConfirmLog: "Удалить запись?",
    deleteConfirmFood: "Удалить блюдо из базы?"
  },
  en: {
    flag: "gb", name: "English",
    title: "Calorie Tracker",
    unitKcal: "kcal",
    eaten: "Eaten",
    remaining: "Remaining",
    today: "Today",
    myFoods: "My Foods",
    history: "History",
    profile: "Profile",
    addMeal: "+ Add meal",
    foodNamePlaceholder: "Dish name",
    caloriesPlaceholder: "Calories",
    proteins: "Proteins",
    fats: "Fats",
    carbs: "Carbs",
    proteinsPlaceholder: "Proteins (g)",
    fatsPlaceholder: "Fats (g)",
    carbsPlaceholder: "Carbs (g)",
    addFoodToBase: "Add to database",
    quickAdd: "Quick add",
    whatDidYouEat: "What did you eat?",
    calories: "Calories",
    add: "Add",
    ageLabel: "Age",
    agePlaceholder: "Age",
    genderMale: "Male",
    genderFemale: "Female",
    unitsMetric: "Metric",
    unitsImperial: "Imperial",
    heightMetric: "Height (in)",
    heightImperial: "Height (in)",
    weightMetric: "Weight (lbs)",
    weightImperial: "Weight (lbs)",
    activityLabel: "Activity level",
    activitySedentary: "Sedentary",
    activityLight: "Light",
    activityModerate: "Moderate",
    activityHigh: "High",
    activityVeryHigh: "Very high",
    goalLabel: "Goal",
    goalMaintain: "Maintain",
    goalDeficit: "Deficit",
    goalSurplus: "Surplus",
    goalPercentLabel: "Percent",
    goalPercentPlaceholder: "%",
    saveProfile: "Save profile",
    fillFields: "Please fill all fields",
    dishAdded: "Dish added to database",
    recordAdded: "Record added",
    profileSaved: "Profile saved",
    addedTemplate: "{name} ({calories} kcal) added",
    deleteConfirmLog: "Delete this log?",
    deleteConfirmFood: "Delete this food from database?"
  },
  uk: {
    flag: "ua", name: "Українська",
    title: "Трекер калорій",
    unitKcal: "ккал",
    eaten: "З'їдено",
    remaining: "Залишилось",
    today: "Сьогодні",
    myFoods: "Мої страви",
    history: "Історія",
    profile: "Профіль",
    addMeal: "+ Додати прийом їжі",
    foodNamePlaceholder: "Назва страви",
    caloriesPlaceholder: "Калорії",
    proteins: "Білки",
    fats: "Жири",
    carbs: "Вуглеводи",
    proteinsPlaceholder: "Білки (г)",
    fatsPlaceholder: "Жири (г)",
    carbsPlaceholder: "Вуглеводи (г)",
    addFoodToBase: "Додати в базу",
    quickAdd: "Швидке додавання",
    whatDidYouEat: "Що ти з'їв?",
    calories: "Калорії",
    add: "Додати",
    ageLabel: "Вік",
    agePlaceholder: "Вік",
    genderMale: "Чоловічий",
    genderFemale: "Жіночий",
    unitsMetric: "Метрична",
    unitsImperial: "Імперська",
    heightMetric: "Зріст (см)",
    heightImperial: "Зріст (дюйми)",
    weightMetric: "Вага (кг)",
    weightImperial: "Вага (фунти)",
    activityLabel: "Рівень активності",
    activitySedentary: "Сидячий",
    activityLight: "Легкий",
    activityModerate: "Помірний",
    activityHigh: "Високий",
    activityVeryHigh: "Дуже високий",
    goalLabel: "Ціль",
    goalMaintain: "Підтримання",
    goalDeficit: "Дефіцит",
    goalSurplus: "Профіцит",
    goalPercentLabel: "Відсоток",
    goalPercentPlaceholder: "%",
    saveProfile: "Зберегти профіль",
    fillFields: "Заповніть усі поля",
    dishAdded: "Страва додана в базу",
    recordAdded: "Запис додано",
    profileSaved: "Профіль збережено",
    addedTemplate: "{name} ({calories} ккал) додано",
    deleteConfirmLog: "Видалити запис?",
    deleteConfirmFood: "Видалити страву з бази?"
  },
  es: {
    flag: "es", name: "Español",
    title: "Rastreador de calorías",
    unitKcal: "kcal",
    eaten: "Consumido",
    remaining: "Restante",
    today: "Hoy",
    myFoods: "Mis platos",
    history: "Historial",
    profile: "Perfil",
    addMeal: "+ Añadir comida",
    foodNamePlaceholder: "Nombre del plato",
    caloriesPlaceholder: "Calorías",
    proteins: "Proteínas",
    fats: "Grasas",
    carbs: "Carbohidratos",
    proteinsPlaceholder: "Proteínas (g)",
    fatsPlaceholder: "Grasas (g)",
    carbsPlaceholder: "Carbohidratos (g)",
    addFoodToBase: "Añadir a la base",
    quickAdd: "Añadir rápido",
    whatDidYouEat: "¿Qué comiste?",
    calories: "Calorías",
    add: "Añadir",
    ageLabel: "Edad",
    agePlaceholder: "Edad",
    genderMale: "Masculino",
    genderFemale: "Femenino",
    unitsMetric: "Métrica",
    unitsImperial: "Imperial",
    heightMetric: "Altura (cm)",
    heightImperial: "Altura (pulgadas)",
    weightMetric: "Peso (kg)",
    weightImperial: "Peso (libras)",
    activityLabel: "Nivel de actividad",
    activitySedentary: "Sedentario",
    activityLight: "Ligero",
    activityModerate: "Moderado",
    activityHigh: "Alto",
    activityVeryHigh: "Muy alto",
    goalLabel: "Objetivo",
    goalMaintain: "Mantenimiento",
    goalDeficit: "Déficit",
    goalSurplus: "Superávit",
    goalPercentLabel: "Porcentaje",
    goalPercentPlaceholder: "%",
    saveProfile: "Guardar perfil",
    fillFields: "Rellene todos los campos",
    dishAdded: "Plato añadido a la base",
    recordAdded: "Registro añadido",
    profileSaved: "Perfil guardado",
    addedTemplate: "{name} ({calories} kcal) añadido",
    deleteConfirmLog: "¿Eliminar registro?",
    deleteConfirmFood: "¿Eliminar plato de la base?"
  },
  de: {
    flag: "de", name: "Deutsch",
    title: "Kalorien-Tracker",
    unitKcal: "kcal",
    eaten: "Verzehrt",
    remaining: "Übrig",
    today: "Heute",
    myFoods: "Meine Gerichte",
    history: "Verlauf",
    profile: "Profil",
    addMeal: "+ Mahlzeit hinzufügen",
    foodNamePlaceholder: "Gerichtname",
    caloriesPlaceholder: "Kalorien",
    proteins: "Proteine",
    fats: "Fette",
    carbs: "Kohlenhydrate",
    proteinsPlaceholder: "Proteine (g)",
    fatsPlaceholder: "Fette (g)",
    carbsPlaceholder: "Kohlenhydrate (g)",
    addFoodToBase: "Zur Datenbank hinzufügen",
    quickAdd: "Schnell hinzufügen",
    whatDidYouEat: "Was hast du gegessen?",
    calories: "Kalorien",
    add: "Hinzufügen",
    ageLabel: "Alter",
    agePlaceholder: "Alter",
    genderMale: "Männlich",
    genderFemale: "Weiblich",
    unitsMetric: "Metrisch",
    unitsImperial: "Imperial",
    heightMetric: "Größe (cm)",
    heightImperial: "Größe (Zoll)",
    weightMetric: "Gewicht (kg)",
    weightImperial: "Gewicht (Pfund)",
    activityLabel: "Aktivitätslevel",
    activitySedentary: "Sitzend",
    activityLight: "Leicht",
    activityModerate: "Mittel",
    activityHigh: "Hoch",
    activityVeryHigh: "Sehr hoch",
    goalLabel: "Ziel",
    goalMaintain: "Erhaltung",
    goalDeficit: "Defizit",
    goalSurplus: "Überschuss",
    goalPercentLabel: "Prozent",
    goalPercentPlaceholder: "%",
    saveProfile: "Profil speichern",
    fillFields: "Bitte alle Felder ausfüllen",
    dishAdded: "Gericht zur Datenbank hinzugefügt",
    recordAdded: "Eintrag hinzugefügt",
    profileSaved: "Profil gespeichert",
    addedTemplate: "{name} ({calories} kcal) hinzugefügt",
    deleteConfirmLog: "Eintrag löschen?",
    deleteConfirmFood: "Gericht aus Datenbank löschen?"
  },
  fr: {
    flag: "fr", name: "Français",
    title: "Suivi des calories",
    unitKcal: "kcal",
    eaten: "Consommé",
    remaining: "Restant",
    today: "Aujourd'hui",
    myFoods: "Mes plats",
    history: "Historique",
    profile: "Profil",
    addMeal: "+ Ajouter un repas",
    foodNamePlaceholder: "Nom du plat",
    caloriesPlaceholder: "Calories",
    proteins: "Protéines",
    fats: "Lipides",
    carbs: "Glucides",
    proteinsPlaceholder: "Protéines (g)",
    fatsPlaceholder: "Lipides (g)",
    carbsPlaceholder: "Glucides (g)",
    addFoodToBase: "Ajouter à la base",
    quickAdd: "Ajout rapide",
    whatDidYouEat: "Qu'as-tu mangé ?",
    calories: "Calories",
    add: "Ajouter",
    ageLabel: "Âge",
    agePlaceholder: "Âge",
    genderMale: "Masculin",
    genderFemale: "Féminin",
    unitsMetric: "Métrique",
    unitsImperial: "Impérial",
    heightMetric: "Taille (cm)",
    heightImperial: "Taille (pouces)",
    weightMetric: "Poids (kg)",
    weightImperial: "Poids (livres)",
    activityLabel: "Niveau d'activité",
    activitySedentary: "Sédentaire",
    activityLight: "Léger",
    activityModerate: "Modéré",
    activityHigh: "Élevé",
    activityVeryHigh: "Très élevé",
    goalLabel: "Objectif",
    goalMaintain: "Maintien",
    goalDeficit: "Déficit",
    goalSurplus: "Surplus",
    goalPercentLabel: "Pourcentage",
    goalPercentPlaceholder: "%",
    saveProfile: "Enregistrer le profil",
    fillFields: "Veuillez remplir tous les champs",
    dishAdded: "Plat ajouté à la base",
    recordAdded: "Enregistrement ajouté",
    profileSaved: "Profil enregistré",
    addedTemplate: "{name} ({calories} kcal) ajouté",
    deleteConfirmLog: "Supprimer l'enregistrement ?",
    deleteConfirmFood: "Supprimer le plat de la base ?"
  },
  be: {
    flag: "by", name: "Беларуская",
    title: "Трэкер калорый",
    unitKcal: "ккал",
    eaten: "З'едзена",
    remaining: "Засталося",
    today: "Сёння",
    myFoods: "Мае стравы",
    history: "Гісторыя",
    profile: "Профіль",
    addMeal: "+ Дадаць прыём ежы",
    foodNamePlaceholder: "Назва стравы",
    caloriesPlaceholder: "Калорыі",
    proteins: "Бялкі",
    fats: "Тлушчы",
    carbs: "Вуглеводы",
    proteinsPlaceholder: "Бялкі (г)",
    fatsPlaceholder: "Тлушчы (г)",
    carbsPlaceholder: "Вуглеводы (г)",
    addFoodToBase: "Дадаць у базу",
    quickAdd: "Хуткае даданне",
    whatDidYouEat: "Што ты з'еў?",
    calories: "Калорыі",
    add: "Дадаць",
    ageLabel: "Узрост",
    agePlaceholder: "Узрост",
    genderMale: "Мужчынскі",
    genderFemale: "Жаночы",
    unitsMetric: "Метрычная",
    unitsImperial: "Імперская",
    heightMetric: "Рост (см)",
    heightImperial: "Рост (дюймы)",
    weightMetric: "Вага (кг)",
    weightImperial: "Вага (фунты)",
    activityLabel: "Узровень актыўнасці",
    activitySedentary: "Сядзячы",
    activityLight: "Лёгкі",
    activityModerate: "Умераны",
    activityHigh: "Высокі",
    activityVeryHigh: "Вельмі высокі",
    goalLabel: "Мэта",
    goalMaintain: "Падтрымка",
    goalDeficit: "Дэфіцыт",
    goalSurplus: "Прафіцыт",
    goalPercentLabel: "Працэнт",
    goalPercentPlaceholder: "%",
    saveProfile: "Захаваць профіль",
    fillFields: "Запоўніце ўсе палі",
    dishAdded: "Страва дададзена ў базу",
    recordAdded: "Запіс дададзены",
    profileSaved: "Профіль захаваны",
    addedTemplate: "{name} ({calories} ккал) дададзена",
    deleteConfirmLog: "Выдаліць запіс?",
    deleteConfirmFood: "Выдаліць страву з базы?"
  }
};

/**
 * Current language code (default: 'ru')
 * @type {string}
 */
let currentLang = localStorage.getItem('lang') || 'ru';

/**
 * Translate a key to the current language
 * @param {string} key - Translation key from the translations object
 * @returns {string} Translated string or the key itself if not found
 */
function translate(key) {
  return translations[currentLang][key] || key;
}

/**
 * Get full URL for the country flag SVG (circle-flags CDN)
 * @param {string} lang - Language code
 * @returns {string} Full URL to the flag image
 */
function getFlagUrl(lang) {
  return `https://circle-flags.cdn.skk.moe/flags/${translations[lang].flag}.svg`;
}

/**
 * Switch the current language and refresh all UI texts
 * @param {string} lang - Language code to set
 */
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  renderAllTexts();
  updateLanguageButton();
  toggleDropdown();
}

/**
 * Update the current language flag in the header
 */
function updateLanguageButton() {
  const flagEl = document.getElementById('current-lang-flag');
  flagEl.src = getFlagUrl(currentLang);
}

/**
 * Toggle the language dropdown visibility
 */
function toggleDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  dropdown.classList.toggle('hidden');
  if (!dropdown.classList.contains('hidden')) renderLanguageDropdown();
}

/**
 * Render all available languages inside the dropdown
 */
function renderLanguageDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  dropdown.innerHTML = '';
  Object.keys(translations).forEach(lang => {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-3 px-4 py-3 hover:bg-zinc-800 cursor-pointer';
    div.innerHTML = `
      <img src="${getFlagUrl(lang)}" class="w-6 h-6 rounded-full" alt="${translations[lang].name}">
      <span>${translations[lang].name}</span>
    `;
    div.onclick = () => setLanguage(lang);
    dropdown.appendChild(div);
  });
}

/**
 * Update all translatable texts and placeholders on the page
 * Called automatically on language change and unit change
 */
function renderAllTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang][key]) el.placeholder = translations[currentLang][key];
  });
}

/**
 * Initialize i18n on page load
 * Forces Russian as default if no language was saved
 */
window.onload = () => {
  if (!localStorage.getItem('lang')) {
    currentLang = 'ru';
    localStorage.setItem('lang', 'ru');
  }
  updateLanguageButton();
  renderAllTexts();
  renderLanguageDropdown();
};