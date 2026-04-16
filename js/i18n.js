/**
 * @type {Object.<string, Object>}
 */
const translations = {
  ru: { flag: "ru", name: "Русский", title: "Трекер калорий", normToday: "Норма сегодня", eaten: "Съедено", remaining: "Осталось", today: "Сегодня", myFoods: "Мои блюда", history: "История", profile: "Профиль", addMeal: "+ Добавить приём пищи", quickAdd: "Быстрое добавление", whatDidYouEat: "Что съел?", calories: "Калории", add: "Добавить", saveProfile: "Сохранить и пересчитать", unitKcal: "ккал", foodNamePlaceholder: "Название блюда", caloriesPlaceholder: "Калории", addFoodToBase: "Добавить блюдо в базу", genderMale: "Мужчина", genderFemale: "Женщина", agePlaceholder: "Возраст", heightMetric: "Рост (см)", heightImperial: "Рост (дюймы)", weightMetric: "Вес (кг)", weightImperial: "Вес (фунты)", activityLabel: "Уровень активности", activitySedentary: "Сидячий", activityLight: "Лёгкая активность", activityModerate: "Средняя", activityHigh: "Высокая", activityVeryHigh: "Очень высокая", goalLabel: "Цель", goalMaintain: "Поддержание", goalDeficit: "Дефицит", goalSurplus: "Профицит", goalPercentLabel: "Процент", goalPercentPlaceholder: "Процент (%)", deleteConfirmLog: "Удалить запись?", deleteConfirmFood: "Удалить блюдо?", fillFields: "Заполни все поля", dishAdded: "Блюдо добавлено!", recordAdded: "Запись добавлена!", profileSaved: "Профиль сохранён! Норма пересчитана.", addedTemplate: "Добавлено: {name} — {calories} ккал", unitsMetric: "Метрическая", unitsImperial: "Имперская" },
  en: { flag: "gb", name: "English", title: "Calorie Tracker", normToday: "Daily norm", eaten: "Eaten", remaining: "Remaining", today: "Today", myFoods: "My foods", history: "History", profile: "Profile", addMeal: "+ Add meal", quickAdd: "Quick add", whatDidYouEat: "What did you eat?", calories: "Calories", add: "Add", saveProfile: "Save & recalculate", unitKcal: "kcal", foodNamePlaceholder: "Dish name", caloriesPlaceholder: "Calories", addFoodToBase: "Add dish to database", genderMale: "Male", genderFemale: "Female", agePlaceholder: "Age", heightMetric: "Height (cm)", heightImperial: "Height (in)", weightMetric: "Weight (kg)", weightImperial: "Weight (lbs)", activityLabel: "Activity level", activitySedentary: "Sedentary", activityLight: "Light activity", activityModerate: "Moderate", activityHigh: "High", activityVeryHigh: "Very high", goalLabel: "Goal", goalMaintain: "Maintain", goalDeficit: "Deficit", goalSurplus: "Surplus", goalPercentLabel: "Percent", goalPercentPlaceholder: "Percent (%)", deleteConfirmLog: "Delete record?", deleteConfirmFood: "Delete dish?", fillFields: "Fill all fields", dishAdded: "Dish added!", recordAdded: "Record added!", profileSaved: "Profile saved! Norm recalculated.", addedTemplate: "Added: {name} — {calories} kcal", unitsMetric: "Metric", unitsImperial: "Imperial" },
  uk: { flag: "ua", name: "Українська", title: "Трекер калорій", normToday: "Норма сьогодні", eaten: "З'їдено", remaining: "Залишилося", today: "Сьогодні", myFoods: "Мої страви", history: "Історія", profile: "Профіль", addMeal: "+ Додати прийом їжі", quickAdd: "Швидке додавання", whatDidYouEat: "Що ти з'їв?", calories: "Калорії", add: "Додати", saveProfile: "Зберегти та перерахувати", unitKcal: "ккал", foodNamePlaceholder: "Назва страви", caloriesPlaceholder: "Калорії", addFoodToBase: "Додати страву в базу", genderMale: "Чоловік", genderFemale: "Жінка", agePlaceholder: "Вік", heightMetric: "Зріст (см)", heightImperial: "Зріст (дюйми)", weightMetric: "Вага (кг)", weightImperial: "Вага (фунти)", activityLabel: "Рівень активності", activitySedentary: "Сидячий", activityLight: "Легка активність", activityModerate: "Середня", activityHigh: "Висока", activityVeryHigh: "Дуже висока", goalLabel: "Ціль", goalMaintain: "Підтримання", goalDeficit: "Дефіцит", goalSurplus: "Профіцит", goalPercentLabel: "Відсоток", goalPercentPlaceholder: "Відсоток (%)", deleteConfirmLog: "Видалити запис?", deleteConfirmFood: "Видалити страву?", fillFields: "Заповни всі поля", dishAdded: "Страва додана!", recordAdded: "Запис доданий!", profileSaved: "Профіль збережено! Норма перерахована.", addedTemplate: "Додано: {name} — {calories} ккал", unitsMetric: "Метрична", unitsImperial: "Імперська" },
  es: { flag: "es", name: "Español", title: "Rastreador de Calorías", normToday: "Norma de hoy", eaten: "Consumido", remaining: "Restante", today: "Hoy", myFoods: "Mis platos", history: "Historial", profile: "Perfil", addMeal: "+ Añadir comida", quickAdd: "Añadir rápido", whatDidYouEat: "¿Qué comiste?", calories: "Calorías", add: "Añadir", saveProfile: "Guardar y recalcular", unitKcal: "kcal", foodNamePlaceholder: "Nombre del plato", caloriesPlaceholder: "Calorías", addFoodToBase: "Añadir plato a la base", genderMale: "Hombre", genderFemale: "Mujer", agePlaceholder: "Edad", heightMetric: "Altura (cm)", heightImperial: "Altura (in)", weightMetric: "Peso (kg)", weightImperial: "Peso (lbs)", activityLabel: "Nivel de actividad", activitySedentary: "Sedentario", activityLight: "Actividad ligera", activityModerate: "Moderada", activityHigh: "Alta", activityVeryHigh: "Muy alta", goalLabel: "Objetivo", goalMaintain: "Mantener", goalDeficit: "Déficit", goalSurplus: "Superávit", goalPercentLabel: "Porcentaje", goalPercentPlaceholder: "Porcentaje (%)", deleteConfirmLog: "¿Eliminar registro?", deleteConfirmFood: "¿Eliminar plato?", fillFields: "Rellena todos los campos", dishAdded: "¡Plato añadido!", recordAdded: "¡Registro añadido!", profileSaved: "¡Perfil guardado! Norma recalculada.", addedTemplate: "Añadido: {name} — {calories} kcal", unitsMetric: "Métrica", unitsImperial: "Imperial" },
  de: { flag: "de", name: "Deutsch", title: "Kalorien-Tracker", normToday: "Tagesnorm", eaten: "Verzehrt", remaining: "Verbleibend", today: "Heute", myFoods: "Meine Gerichte", history: "Verlauf", profile: "Profil", addMeal: "+ Mahlzeit hinzufügen", quickAdd: "Schnell hinzufügen", whatDidYouEat: "Was hast du gegessen?", calories: "Kalorien", add: "Hinzufügen", saveProfile: "Speichern und neu berechnen", unitKcal: "kcal", foodNamePlaceholder: "Gerichtname", caloriesPlaceholder: "Kalorien", addFoodToBase: "Gericht zur Datenbank hinzufügen", genderMale: "Mann", genderFemale: "Frau", agePlaceholder: "Alter", heightMetric: "Größe (cm)", heightImperial: "Größe (in)", weightMetric: "Gewicht (kg)", weightImperial: "Gewicht (lbs)", activityLabel: "Aktivitätslevel", activitySedentary: "Sitzend", activityLight: "Leichte Aktivität", activityModerate: "Mittel", activityHigh: "Hoch", activityVeryHigh: "Sehr hoch", goalLabel: "Ziel", goalMaintain: "Erhalt", goalDeficit: "Defizit", goalSurplus: "Überschuss", goalPercentLabel: "Prozent", goalPercentPlaceholder: "Prozent (%)", deleteConfirmLog: "Eintrag löschen?", deleteConfirmFood: "Gericht löschen?", fillFields: "Alle Felder ausfüllen", dishAdded: "Gericht hinzugefügt!", recordAdded: "Eintrag hinzugefügt!", profileSaved: "Profil gespeichert! Norm neu berechnet.", addedTemplate: "Hinzugefügt: {name} — {calories} kcal", unitsMetric: "Metrisch", unitsImperial: "Imperial" },
  fr: { flag: "fr", name: "Français", title: "Suivi des calories", normToday: "Norme aujourd'hui", eaten: "Mangé", remaining: "Restant", today: "Aujourd'hui", myFoods: "Mes plats", history: "Historique", profile: "Profil", addMeal: "+ Ajouter un repas", quickAdd: "Ajout rapide", whatDidYouEat: "Qu'avez-vous mangé ?", calories: "Calories", add: "Ajouter", saveProfile: "Enregistrer et recalculer", unitKcal: "kcal", foodNamePlaceholder: "Nom du plat", caloriesPlaceholder: "Calories", addFoodToBase: "Ajouter le plat à la base", genderMale: "Homme", genderFemale: "Femme", agePlaceholder: "Âge", heightMetric: "Taille (cm)", heightImperial: "Taille (in)", weightMetric: "Poids (kg)", weightImperial: "Poids (lbs)", activityLabel: "Niveau d'activité", activitySedentary: "Sédentaire", activityLight: "Activité légère", activityModerate: "Modérée", activityHigh: "Élevée", activityVeryHigh: "Très élevée", goalLabel: "Objectif", goalMaintain: "Maintien", goalDeficit: "Déficit", goalSurplus: "Surplus", goalPercentLabel: "Pourcentage", goalPercentPlaceholder: "Pourcentage (%)", deleteConfirmLog: "Supprimer l'entrée ?", deleteConfirmFood: "Supprimer le plat ?", fillFields: "Remplissez tous les champs", dishAdded: "Plat ajouté !", recordAdded: "Entrée ajoutée !", profileSaved: "Profil enregistré ! Norme recalculée.", addedTemplate: "Ajouté : {name} — {calories} kcal", unitsMetric: "Métrique", unitsImperial: "Impérial" },
  be: { flag: "by", name: "Беларуская", title: "Трэкер калорый", normToday: "Норма сёння", eaten: "З'едзена", remaining: "Засталося", today: "Сёння", myFoods: "Мае стравы", history: "Гісторыя", profile: "Профіль", addMeal: "+ Дадаць прыём ежы", quickAdd: "Хуткае даданне", whatDidYouEat: "Што ты з'еў?", calories: "Калорыі", add: "Дадаць", saveProfile: "Захаваць і пералічыць", unitKcal: "ккал", foodNamePlaceholder: "Назва стравы", caloriesPlaceholder: "Калорыі", addFoodToBase: "Дадаць страву ў базу", genderMale: "Мужчына", genderFemale: "Жанчына", agePlaceholder: "Узрост", heightMetric: "Рост (см)", heightImperial: "Рост (дюймы)", weightMetric: "Вага (кг)", weightImperial: "Вага (фунты)", activityLabel: "Узровень актыўнасці", activitySedentary: "Седзячы", activityLight: "Лёгкая актыўнасць", activityModerate: "Сярэдняя", activityHigh: "Высокая", activityVeryHigh: "Вельмі высокая", goalLabel: "Мэта", goalMaintain: "Падтрыманне", goalDeficit: "Дэфіцыт", goalSurplus: "Профіцыт", goalPercentLabel: "Працэнт", goalPercentPlaceholder: "Працэнт (%)", deleteConfirmLog: "Выдаліць запіс?", deleteConfirmFood: "Выдаліць страву?", fillFields: "Запоўні ўсе палі", dishAdded: "Страва дададзена!", recordAdded: "Запіс дададзены!", profileSaved: "Профіль захаваны! Норма пералічана.", addedTemplate: "Дададзена: {name} — {calories} ккал", unitsMetric: "Метрычная", unitsImperial: "Імперская" }
};

let currentLang = localStorage.getItem('lang') || 'ru';

/**
 * Translates a key using the current language
 * @param {string} key
 * @returns {string}
 */
function translate(key) {
  return translations[currentLang]?.[key] || key;
}

/**
 * Returns the flag URL for the given language
 * @param {string} lang
 * @returns {string}
 */
function getFlagUrl(lang) {
  const code = translations[lang].flag;
  return `https://circle-flags.cdn.skk.moe/flags/${code}.svg`;
}

/**
 * Changes the current language and saves it to localStorage
 * @param {string} lang
 */
function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  renderAllTexts();
  updateLanguageButton();
}

/**
 * Updates all text and placeholders on the page
 */
function renderAllTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang]?.[key]) el.textContent = translations[currentLang][key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang]?.[key]) el.placeholder = translations[currentLang][key];
  });
}

/**
 * Updates the flag image in the header
 */
function updateLanguageButton() {
  const flagEl = document.getElementById('current-lang-flag');
  flagEl.src = getFlagUrl(currentLang);
}

/**
 * Toggles visibility of the language dropdown
 */
function toggleDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  dropdown.classList.toggle('hidden');
}

/**
 * Selects a language and closes the dropdown
 * @param {string} lang
 */
function selectLang(lang) {
  setLanguage(lang);
  toggleDropdown();
}

/**
 * Renders the list of available languages in the dropdown (sorted alphabetically by name)
 */
function renderLanguageDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  dropdown.innerHTML = '';

  const sortedLangs = Object.keys(translations).sort((a, b) =>
    translations[a].name.localeCompare(translations[b].name)
  );

  sortedLangs.forEach(lang => {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-4 px-6 py-4 hover:bg-zinc-800 cursor-pointer';
    div.innerHTML = `
      <img src="${getFlagUrl(lang)}" class="w-7 h-7 rounded-full" alt="">
      <span class="font-medium">${translations[lang].name}</span>
    `;
    div.onclick = () => selectLang(lang);
    dropdown.appendChild(div);
  });
}