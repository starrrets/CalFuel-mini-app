const translations = {
  ru: {
    title: "Трекер калорий",
    normToday: "Норма сегодня",
    eaten: "Съедено",
    remaining: "Осталось",
    today: "Сегодня",
    myFoods: "Мои блюда",
    history: "История",
    profile: "Профиль",
    addMeal: "+ Добавить приём пищи",
    quickAdd: "Быстрое добавление",
    whatDidYouEat: "Что съел?",
    calories: "Калории",
    add: "Добавить",
    saveProfile: "Сохранить и пересчитать",
    unitKcal: "ккал"
  },
  en: {
    title: "Calorie Tracker",
    normToday: "Daily norm",
    eaten: "Eaten",
    remaining: "Remaining",
    today: "Today",
    myFoods: "My foods",
    history: "History",
    profile: "Profile",
    addMeal: "+ Add meal",
    quickAdd: "Quick add",
    whatDidYouEat: "What did you eat?",
    calories: "Calories",
    add: "Add",
    saveProfile: "Save & recalculate",
    unitKcal: "kcal"
  }
};

let currentLang = localStorage.getItem('lang') || 'ru';

function t(key) {
  return translations[currentLang]?.[key] || key;
}

function getFlag(lang) {
  const flags = { ru: '🇷🇺', en: '🇬🇧' };
  return flags[lang] || '🌍';
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('lang', lang);
  renderAllTexts();
  updateLanguageButton();
}

function renderAllTexts() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang]?.[key]) el.textContent = translations[currentLang][key];
  });
}

function updateLanguageButton() {
  const flagEl = document.getElementById('current-lang-flag');
  flagEl.textContent = getFlag(currentLang);
}

function toggleDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  dropdown.classList.toggle('hidden');
}

function selectLang(lang) {
  setLanguage(lang);
  toggleDropdown();
}

function renderLanguageDropdown() {
  const dropdown = document.getElementById('lang-dropdown');
  dropdown.innerHTML = '';
  Object.keys(translations).forEach(lang => {
    const div = document.createElement('div');
    div.className = 'flex items-center gap-4 px-6 py-4 hover:bg-zinc-800 cursor-pointer';
    div.innerHTML = `
      <span class="text-3xl">${getFlag(lang)}</span>
      <span class="font-medium">${lang === 'ru' ? 'Русский' : 'English'}</span>
    `;
    div.onclick = () => selectLang(lang);
    dropdown.appendChild(div);
  });
}