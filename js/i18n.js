const translations = {
  ru: {
    flag: "ru",
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
    flag: "gb",
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

function translate(key) {
  return translations[currentLang]?.[key] || key;
}

function getFlagUrl(lang) {
  const code = translations[lang].flag;
  return `https://circle-flags.cdn.skk.moe/flags/${code}.svg`;
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
  flagEl.src = getFlagUrl(currentLang);
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
      <img src="${getFlagUrl(lang)}" class="w-7 h-7 rounded-full" alt="">
      <span class="font-medium">${lang === 'ru' ? 'Русский' : 'English'}</span>
    `;
    div.onclick = () => selectLang(lang);
    dropdown.appendChild(div);
  });
}