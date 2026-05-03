// ── Telegram WebApp ───────────────────────────────────────────────
let tg = null;
if (window.Telegram && window.Telegram.WebApp) {
  tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
}
const GAUGE_R = 108;
const GAUGE_CIRCUMFERENCE = 2 * Math.PI * GAUGE_R;

// initData is the signed payload the backend uses to authenticate requests.
// In a real Telegram WebApp this is always non-empty; an empty string here
// means the app was opened outside Telegram (development/testing only).
const initData = tg ? (tg.initData || "") : "";
const API_BASE = "https://web-production-fcefd.up.railway.app";

let dailyNorm = 2000;
let proteinTarget = null;
let fatTarget = null;
let carbsTarget = null;
let totalToday = 0;
let foods = [];
let logs = [];
let currentUnits = "metric";
let newFoodType = "fixed";
let foodsLoaded = false;
let historyLoaded = false;
let gaugeHideZeroTimer = null;

// "simple" = calories only  |  "full" = calories + macros
// Stored in localStorage as a pure UI preference (not nutrition data)
let trackingMode = localStorage.getItem("trackingMode") || "simple";
let lastTodayData = null;
let isBootstrapping = true;

// ── Tracking mode toggle ──────────────────────────────────────────

function setTrackingMode(mode) {
  trackingMode = mode;
  localStorage.setItem("trackingMode", mode);
  document.getElementById("tracking-mode-simple").classList.toggle("active", mode === "simple");
  document.getElementById("tracking-mode-full").classList.toggle("active", mode === "full");
  updateTrackingModeUI();
}

function updateTrackingModeUI() {
  const isFull = trackingMode === "full";

  // Today tab macro bars
  const macroBarsToday = document.getElementById("macroBarsToday");
  if (macroBarsToday) macroBarsToday.classList.toggle("hidden", !isFull);

  // Quick add macro inputs
  const quickMacros = document.getElementById("quickMacros");
  if (quickMacros) quickMacros.classList.toggle("hidden", !isFull);

  // New food macro inputs
  const newFoodMacros = document.getElementById("newFoodMacros");
  if (newFoodMacros) newFoodMacros.classList.toggle("hidden", !isFull);

  if (isFull && !isBootstrapping) {
    if (lastTodayData) {
      updateMacroBars(lastTodayData);
    } else {
      loadTodayLogs();
    }
  }
}

// ── New clean stable SVG icons (different from previous version) ──

const MOON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 18 18" fill="currentColor">
<path d="M13.4912 11.6367C8.8418 11.6367 5.88867 8.75391 5.88867 4.13086C5.88867 3.12012 6.12598 1.77539 6.44238 1.06348C6.54785 0.834961 6.57422 0.676758 6.57422 0.553711C6.57422 0.272461 6.37207 0 6.01172 0C5.87988 0 5.66895 0.0351562 5.44922 0.114258C2.17969 1.42383 0 4.87793 0 8.54297C0 13.7021 3.90234 17.4023 9.04395 17.4023C12.7705 17.4023 16.0312 15.1523 17.1826 12.2168C17.2793 11.9883 17.3057 11.7598 17.3057 11.6367C17.3057 11.2939 17.042 11.0654 16.7607 11.0654C16.6113 11.0654 16.4707 11.1006 16.2686 11.1885C15.6094 11.417 14.5459 11.6367 13.4912 11.6367Z"/>
</svg>`;

const SUN_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
<path d="M10.7051 0.896484C10.7051 0.413086 10.292 0 9.80859 0C9.3252 0 8.9209 0.413086 8.9209 0.896484V2.68066C8.9209 3.16406 9.3252 3.56836 9.80859 3.56836C10.292 3.56836 10.7051 3.16406 10.7051 2.68066V0.896484ZM14.2207 4.16602C13.8779 4.50879 13.8779 5.08008 14.2295 5.42285C14.5635 5.76562 15.1436 5.76562 15.4863 5.41406L16.752 4.14844C17.0947 3.81445 17.0947 3.22559 16.752 2.88281C16.4092 2.54883 15.8379 2.54883 15.4951 2.8916L14.2207 4.16602ZM4.13086 5.41406C4.46484 5.76562 5.04492 5.76562 5.3877 5.42285C5.73047 5.08887 5.73047 4.5 5.39648 4.16602L4.13086 2.8916C3.79688 2.55762 3.2168 2.54883 2.87402 2.88281C2.53125 3.22559 2.53125 3.81445 2.86523 4.13965L4.13086 5.41406ZM9.80859 5.19434C7.27734 5.19434 5.17676 7.28613 5.17676 9.82617C5.17676 12.3662 7.27734 14.458 9.80859 14.458C12.3398 14.458 14.4316 12.3662 14.4316 9.82617C14.4316 7.28613 12.3398 5.19434 9.80859 5.19434ZM9.80859 6.85547C11.4258 6.85547 12.7793 8.2002 12.7793 9.82617C12.7793 11.4521 11.4258 12.7969 9.80859 12.7969C8.18262 12.7969 6.8291 11.4521 6.8291 9.82617C6.8291 8.2002 8.18262 6.85547 9.80859 6.85547ZM18.7295 10.7227C19.2129 10.7227 19.6172 10.3096 19.6172 9.82617C19.6172 9.34277 19.2129 8.93848 18.7295 8.93848H16.9453C16.4619 8.93848 16.0576 9.34277 16.0576 9.82617C16.0576 10.3096 16.4619 10.7227 16.9453 10.7227H18.7295ZM0.896484 8.93848C0.404297 8.93848 0 9.34277 0 9.82617C0 10.3096 0.404297 10.7227 0.896484 10.7227H2.67188C3.15527 10.7227 3.56836 10.3096 3.56836 9.82617C3.56836 9.34277 3.15527 8.93848 2.67188 8.93848H0.896484ZM15.4775 14.2383C15.1348 13.8955 14.5635 13.9043 14.2207 14.2471C13.8779 14.5811 13.8779 15.1523 14.2295 15.5039L15.5039 16.7695C15.8379 17.1123 16.418 17.1035 16.7607 16.7607C17.0947 16.418 17.0947 15.8467 16.752 15.5039L15.4775 14.2383ZM2.86523 15.4951C2.52246 15.8379 2.51367 16.418 2.84766 16.752C3.19043 17.0947 3.7793 17.1035 4.11328 16.7695L5.3877 15.5039C5.73047 15.1611 5.73047 14.5811 5.39648 14.2471C5.05371 13.9043 4.47363 13.9043 4.13086 14.2383L2.86523 15.4951ZM10.7051 16.9717C10.7051 16.4883 10.292 16.084 9.80859 16.084C9.3252 16.084 8.9209 16.4883 8.9209 16.9717V18.7559C8.9209 19.2393 9.3252 19.6523 9.80859 19.6523C10.292 19.6523 10.7051 19.2393 10.7051 18.7559V16.9717Z"/>
</svg>`;

// ── Today header ──────────────────────────────────────────────────

const GREETINGS = {
  ru: {
    morning: [
      "Доброе утро! ☀️", "Подъём!", "Как спалось?", "Время кофе! ☕️",
      "Бодрого утра!", "Просыпаемся!", "В планах подвиги?", "Утро!",
      "Погнали?", "Начнем день!"
    ],
    afternoon: [
      "Добрый день!", "Обед? 🍕", "Как успехи?", "Пора поесть!",
      "Как дела?", "Время паузы", "Держим ритм!", "Приятного!",
      "Нужен перерыв?", "Привет!"
    ],
    evening: [
      "Добрый вечер!", "Время выдохнуть", "Как прошёл день?", "Ужинаем? 🍷",
      "Пора отдыхать", "Уютного вечера", "День - всё!", "Заслуженный отдых",
      "Расслабляемся!", "Вечер!"
    ],
  },
  en: {
    morning: [
      "Good morning! ☀️", "Rise and shine!", "Sleep well?", "Need coffee? ☕️",
      "Morning vibes", "Wakey wakey!", "Let's do this!", "Ready?",
      "Top of the morning", "Hey there!"
    ],
    afternoon: [
      "Good afternoon!", "Lunch time? 🍕", "How’s it going?", "Stay hydrated!",
      "Take a break", "On track?", "Looking good!", "Enjoy your meal!",
      "Halfway there!", "Hi!"
    ],
    evening: [
      "Good evening!", "Unwind time", "How was today?", "Dinner? 🍷",
      "Time to rest", "Cozy vibes", "Day is done!", "Well earned",
      "Relax mode", "Evening!"
    ],
  },
  uk: {
    morning: [
      "Доброго ранку! ☀️", "Прокидаємося!", "Як спалося?", "Час кави! ☕️",
      "Бадьорого ранку!", "Поїхали!", "Як плани?", "Ранок!",
      "Вже на ногах?", "Почнемо?"
    ],
    afternoon: [
      "Добрий день!", "Час обіду? 🍕", "Як успіхи?", "Смачного!",
      "Як справи?", "Час паузи", "Тримаємо ритм!", "Привіт!",
      "Треба перерва?", "Все за планом?"
    ],
    evening: [
      "Добрий вечір!", "Час видихнути", "Як минув день?", "Вечеряємо? 🍷",
      "Пора відпочити", "Затишного вечора", "День - все!", "Заслужений спокій",
      "Розслабляємося!", "Вечір!"
    ],
  },
  es: {
    morning: [
      "¡Buenos días! ☀️", "¡Arriba!", "¿Café? ☕️", "¿Qué tal el sueño?",
      "¡A por el día!", "Hola, sol", "¡A despertar!", "¿Todo listo?",
      "Energía pura", "¡Vamos!"
    ],
    afternoon: [
      "¡Buenas tardes!", "¿Comemos? 🍕", "¿Cómo va todo?", "¡Buen provecho!",
      "Toma un respiro", "A tope", "¿Todo bien?", "¡Dale!",
      "Pausa necesaria", "¡Hola!"
    ],
    evening: [
      "¡Buenas noches!", "A descansar", "¿Qué tal el día?", "¿Cenamos? 🍷",
      "Momento relax", "Noche acogedora", "Día - fin!", "Desconecta",
      "Paz total", "¡Hasta mañana!"
    ],
  },
  de: {
    morning: [
      "Guten Morgen! ☀️", "Wach auf!", "Kaffee? ☕️", "Gut geschlafen?",
      "Los geht's!", "Moin moin!", "Startklar?", "Morgen!",
      "Energie!", "Bereit?"
    ],
    afternoon: [
      "Mahlzeit! 🍕", "Pause?", "Läuft's?", "Guten Appetit!",
      "Wie läuft der Tag?", "Dranbleiben!", "Alles klar?", "Hallo!",
      "Kurzes Break?", "Halbzeit!"
    ],
    evening: [
      "Guten Abend!", "Feierabend!", "Wie war's heute?", "Essen? 🍷",
      "Zeit für Ruhe", "Gemütlich machen", "Tag - geschafft!", "Entspannung",
      "Beine hoch!", "Abend!"
    ],
  },
  fr: {
    morning: [
      "Salut! ☀️", "Réveil!", "Café? ☕️", "Bien dormi?",
      "En forme?", "C'est parti!", "Bonne journée!", "Matin!",
      "Allez hop!", "On y va?"
    ],
    afternoon: [
      "Bonjour!", "Bon app! 🍕", "Ça roule?", "Un break?",
      "On lâche rien!", "Ça avance?", "Pause café?", "Salut!",
      "La forme?", "On continue?"
    ],
    evening: [
      "Bonsoir!", "Enfin!", "Le bilan? ✨", "À table! 🍷",
      "On décompresse", "Soirée zen", "Journée - finie!", "Repos",
      "Détente!", "Douce nuit"
    ],
  },
  be: {
    morning: [
      "Добрай раніцы! ☀️", "Устаём!", "Як спалася?", "Час кавы! ☕️",
      "Бадзёрасці!", "Наперад!", "Як настрой?", "Раніца!",
      "Гатоўнасць?", "Пагналі!"
    ],
    afternoon: [
      "Добры дзень!", "Смачна есці! 🍕", "Як справы?", "Час абеду!",
      "Трэба перадых", "Трымаем рытм!", "Усё добра?", "Прывіт!",
      "Паўза?", "Экватар!"
    ],
    evening: [
      "Добры вечір!", "Выдыхаем!", "Як прайшоў дзень?", "Вечараем? 🍷",
      "Час адпачыць", "Зацішнага вечара", "Дзень - усё!", "Адпачынак",
      "Дабранач!", "Вечар!"
    ],
  }
};

const _sessionGreeting = {};

function renderTodayHeader() {
  const now = new Date();
  const hour = now.getHours();
  const period = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";
  const lang = typeof currentLang !== "undefined" ? currentLang : "ru";
  const pool = (GREETINGS[lang] || GREETINGS.en)[period];
  const cacheKey = lang + "_" + period;

  if (!_sessionGreeting[cacheKey]) {
    _sessionGreeting[cacheKey] = pool[Math.floor(Math.random() * pool.length)];
  }

  const greetEl = document.getElementById("today-greeting");
  const dateEl  = document.getElementById("today-date-label");
  if (greetEl) greetEl.textContent = _sessionGreeting[cacheKey];
  if (dateEl) {
    const months = translations[lang]?.months || translations.ru.months;
    dateEl.textContent = `${now.getDate()} ${months[now.getMonth()]}`;
  }
}

// ── Theme ─────────────────────────────────────────────────────────

function initTheme() {
  let theme = localStorage.getItem("theme");
  if (!theme) {
    theme = (tg && tg.colorScheme === "light") ? "light" : "dark";
  }
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);

  const iconWrap = document.getElementById("theme-icon-wrap");
  if (iconWrap) iconWrap.innerHTML = theme === "dark" ? MOON_SVG : SUN_SVG;
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
}

// ── Toast / Confirm ───────────────────────────────────────────────

function showToast(msg, duration = 2400) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  container.appendChild(el);
  const remove = () => {
    el.classList.add("toast-out");
    el.addEventListener("animationend", () => el.remove(), { once: true });
  };
  setTimeout(remove, duration);
}

function showConfirm(msg) {
  return new Promise(resolve => {
    const container = document.getElementById("toast-container");
    if (!container) { resolve(confirm(msg)); return; }
    const el = document.createElement("div");
    el.className = "toast toast-confirm";
    el.innerHTML = `
      <p class="toast-confirm-msg">${msg}</p>
      <div class="toast-confirm-btns">
        <button class="toast-btn-cancel">${translate("cancel")}</button>
        <button class="toast-btn-ok">${translate("confirmOk")}</button>
      </div>`;
    const close = (val) => { el.classList.add("toast-out"); el.addEventListener("animationend", () => el.remove(), { once: true }); resolve(val); };
    el.querySelector(".toast-btn-cancel").onclick = () => close(false);
    el.querySelector(".toast-btn-ok").onclick     = () => close(true);
    container.appendChild(el);
  });
}

// ── Helpers ───────────────────────────────────────────────────────

function convertHeight(value, fromUnit, toUnit) {
  if (fromUnit === toUnit || !value) return value;
  return fromUnit === "metric"
    ? Math.round(value * 0.393701)
    : Math.round(value / 0.393701);
}

function convertWeight(value, fromUnit, toUnit) {
  if (fromUnit === toUnit || !value) return value;
  return fromUnit === "metric"
    ? Math.round(value * 2.20462 * 10) / 10
    : Math.round(value / 2.20462 * 10) / 10;
}

async function apiFetch(endpoint, method = "GET", body = null) {
  const url = API_BASE + endpoint;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Telegram-InitData": initData,
    },
  };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(url, options);
  if (!response.ok) {
    console.error("[apiFetch] error", response.status, url);
    return null;
  }
  return response.json();
}

function getTransitionMs(el) {
  if (!el) return 0;

  const style = window.getComputedStyle(el);

  const toMs = value => {
    const v = value.trim();
    if (!v) return 0;
    return v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000;
  };

  const durations = style.transitionDuration.split(",").map(toMs);
  const delays = style.transitionDelay.split(",").map(toMs);

  const count = Math.max(durations.length, delays.length);
  let max = 0;

  for (let i = 0; i < count; i++) {
    const duration = durations[i] ?? durations[durations.length - 1] ?? 0;
    const delay = delays[i] ?? delays[delays.length - 1] ?? 0;
    max = Math.max(max, duration + delay);
  }

  return max;
}

function setAppBusy(active, subtitleKey = "busySyncing") {
  const overlay = document.getElementById("app-busy-overlay");

  if (overlay) {
    overlay.classList.toggle("open", active);
    overlay.setAttribute("aria-hidden", active ? "false" : "true");

    const titleEl = overlay.querySelector(".app-busy-title");
    const subtitleEl = overlay.querySelector(".app-busy-subtitle");

    if (titleEl) {
      titleEl.textContent =
        typeof translate === "function"
          ? translate("busyLoading")
          : "Loading…";
    }

    if (subtitleEl) {
      subtitleEl.textContent =
        typeof translate === "function"
          ? translate(subtitleKey)
          : "Syncing your data";
    }
  }

  document.body.classList.toggle("is-busy", active);
  document.body.setAttribute("aria-busy", active ? "true" : "false");
}

function applyBootstrapProfile(profile) {
  if (!profile) return;

  dailyNorm = profile.daily_norm || 2000;
  proteinTarget = profile.protein_target || null;
  fatTarget = profile.fat_target || null;
  carbsTarget = profile.carbs_target || null;
  currentUnits = profile.units || "metric";

  if (profile.language) {
    currentLang = profile.language;
    localStorage.setItem("lang", profile.language);
    renderAllTexts();
    updateLanguageButton();
  }

  if (profile.height) {
    document.getElementById("height").value = Math.round(
      convertHeight(profile.height, "metric", currentUnits)
    );
  }

  if (profile.weight) {
    document.getElementById("weight").value =
      Math.round(convertWeight(profile.weight, "metric", currentUnits) * 10) /
      10;
  }

  if (profile.gender) setGender(profile.gender);
  if (profile.age) document.getElementById("age").value = profile.age;

  if (profile.activity) {
    const activityOptions = ["1.2", "1.375", "1.55", "1.725", "1.9"];
    const closest = activityOptions.reduce((a, b) =>
      Math.abs(parseFloat(b) - profile.activity) <
      Math.abs(parseFloat(a) - profile.activity)
        ? b
        : a
    );
    document.getElementById("activity").value = closest;
  }

  if (profile.goal_type) {
    document.getElementById("goalType").value = profile.goal_type;
    if (profile.goal_percent) {
      document.getElementById("goalPercent").value =
        Math.round(profile.goal_percent * 10) / 10;
    }
  }

  document.getElementById("dailyNorm").textContent = Math.round(dailyNorm);
  updateUnitUI();
  toggleGoalPercent();
}

function applyBootstrapToday(today) {
  if (!today) return;

  logs = today.logs || [];
  totalToday = today.total_calories ?? 0;

  lastTodayData = {
    total_calories: today.total_calories ?? 0,
    total_protein: today.total_protein ?? 0,
    total_fat: today.total_fat ?? 0,
    total_carbs: today.total_carbs ?? 0,
    protein_target: proteinTarget,
    fat_target: fatTarget,
    carbs_target: carbsTarget,
    daily_norm: dailyNorm,
    logs,
  };

  document.getElementById("totalToday").textContent = Math.round(totalToday);
  renderLogs();
  updateProgress();

  if (trackingMode === "full") {
    updateMacroBars(lastTodayData);
  }
}

function applyBootstrapHistory(history) {
  historyData = history || {};
  historyLoaded = true;
}

function applyBootstrapFoods(items) {
  foods = items || [];
  foodsLoaded = true;
}

async function bootstrapApp() {
  const data = await apiFetch("/api/bootstrap");
  if (!data) return false;

  applyBootstrapProfile(data.profile);
  applyBootstrapToday(data.today);
  applyBootstrapHistory(data.history);
  applyBootstrapFoods(data.foods);

  return true;
}

async function sendTimezoneInBackground() {
  try {
    await apiFetch("/api/profile/timezone", "POST", {
      utc_offset: -new Date().getTimezoneOffset(),
    });
  } catch (e) {
    console.error("[timezone sync]", e);
  }
}

// ── Profile ───────────────────────────────────────────────────────

let currentGender = "male";

function setGender(gender) {
  currentGender = gender;
  document.getElementById("gender-male").classList.toggle("active", gender === "male");
  document.getElementById("gender-female").classList.toggle("active", gender === "female");
}

function applyProfileData(data) {
  dailyNorm = data.daily_norm || 2000;
  proteinTarget = data.protein_target || null;
  fatTarget = data.fat_target || null;
  carbsTarget = data.carbs_target || null;
  currentUnits = data.units || "metric";
}

async function loadProfile() {
  try {
    const data = await apiFetch("/api/profile");
    if (!data) return;
    applyProfileData(data);

    if (data.language) {
      currentLang = data.language;
      localStorage.setItem('lang', data.language);
      renderAllTexts();
      updateLanguageButton();
    }

    if (data.height) document.getElementById("height").value = Math.round(convertHeight(data.height, "metric", currentUnits));
    if (data.weight) document.getElementById("weight").value = Math.round(convertWeight(data.weight, "metric", currentUnits) * 10) / 10;
    if (data.gender) setGender(data.gender);
    if (data.age)    document.getElementById("age").value = data.age;
    if (data.activity) {
      const activityOptions = ["1.2", "1.375", "1.55", "1.725", "1.9"];
      const closest = activityOptions.reduce((a, b) =>
        Math.abs(parseFloat(b) - data.activity) < Math.abs(parseFloat(a) - data.activity) ? b : a
      );
      document.getElementById("activity").value = closest;
    }
    if (data.goal_type) {
      document.getElementById("goalType").value = data.goal_type;
      if (data.goal_percent) document.getElementById("goalPercent").value = Math.round(data.goal_percent * 10) / 10;
    }
    document.getElementById("dailyNorm").textContent = Math.round(dailyNorm);
    updateProgress();
    updateUnitUI();
    toggleGoalPercent();
  } catch (e) {
    console.error("[loadProfile]", e);
  }
}

function updateUnitUI() {
  const isMetric = currentUnits === "metric";
  document.getElementById("unit-metric").classList.toggle("active", isMetric);
  document.getElementById("unit-imperial").classList.toggle("active", !isMetric);
  document.getElementById("height-label").textContent = translate(isMetric ? "heightMetric" : "heightImperial");
  document.getElementById("weight-label").textContent = translate(isMetric ? "weightMetric" : "weightImperial");
  document.getElementById("height").placeholder = translate(isMetric ? "heightMetric" : "heightImperial");
  document.getElementById("weight").placeholder = translate(isMetric ? "weightMetric" : "weightImperial");
}

function setUnits(unit) {
  if (currentUnits === unit) return;
  const h = parseFloat(document.getElementById("height").value);
  const w = parseFloat(document.getElementById("weight").value);
  if (!isNaN(h)) document.getElementById("height").value = convertHeight(h, currentUnits, unit);
  if (!isNaN(w)) document.getElementById("weight").value = convertWeight(w, currentUnits, unit);
  currentUnits = unit;
  updateUnitUI();
}

function toggleGoalPercent() {
  const goalType = document.getElementById("goalType").value;
  document.getElementById("goal-percent-row").style.display = goalType === "maintain" ? "none" : "flex";
}

async function saveProfile() {
  const heightMetric = convertHeight(parseFloat(document.getElementById("height").value) || 0, currentUnits, "metric");
  const weightMetric = convertWeight(parseFloat(document.getElementById("weight").value) || 0, currentUnits, "metric");
  const goalType = document.getElementById("goalType").value;
  const data = {
    gender: currentGender,
    age: parseInt(document.getElementById("age").value, 10),
    height: heightMetric,
    weight: weightMetric,
    activity: parseFloat(document.getElementById("activity").value),
    goal_type: goalType,
    goal_percent: goalType === "maintain" ? 0 : (parseFloat(document.getElementById("goalPercent").value) || 0),
    units: currentUnits,
  };
  const result = await apiFetch("/api/profile", "POST", data);
  if (!result) return;
  applyProfileData(result);
  document.getElementById("dailyNorm").textContent = Math.round(dailyNorm);
  updateProgress();
  showToast(translate("profileSaved"));
}

// ── Today logs ────────────────────────────────────────────────────

async function loadTodayLogs() {
  const todayStr = toISODate(new Date());
  const data = await apiFetch(`/api/logs/day/${todayStr}`);
  if (!data) return;
  lastTodayData = data;
  logs = data.logs || [];
  totalToday = data.total_calories ?? data.total ?? 0;
  // Refresh macro targets from the day response (keeps them in sync)
  if (data.protein_target != null) proteinTarget = data.protein_target;
  if (data.fat_target != null) fatTarget = data.fat_target;
  if (data.carbs_target != null) carbsTarget = data.carbs_target;
  document.getElementById("totalToday").textContent = Math.round(totalToday);
  renderLogs();
  updateProgress();
  if (trackingMode === "full") updateMacroBars(lastTodayData);
}

function updateProgress() {
  const track = document.getElementById("gaugeTrack");
  const fill = document.getElementById("gaugeFill");
  const pct = dailyNorm > 0 ? Math.max(0, Math.min(totalToday / dailyNorm, 1)) : 0;
  const targetOffset = GAUGE_CIRCUMFERENCE * (1 - pct);

  if (track) {
    track.style.strokeDasharray = `${GAUGE_CIRCUMFERENCE} ${GAUGE_CIRCUMFERENCE}`;
    track.style.strokeDashoffset = "0";
  }

  if (fill) {
    if (gaugeHideZeroTimer) {
      clearTimeout(gaugeHideZeroTimer);
      gaugeHideZeroTimer = null;
    }

    fill.style.strokeDasharray = `${GAUGE_CIRCUMFERENCE} ${GAUGE_CIRCUMFERENCE}`;

    if (pct <= 0) {
      fill.style.opacity = "1";
      fill.style.strokeDashoffset = `${GAUGE_CIRCUMFERENCE}`;

      const hideIfStillZero = () => {
        const currentPct =
          dailyNorm > 0 ? Math.max(0, Math.min(totalToday / dailyNorm, 1)) : 0;

        if (currentPct <= 0) {
          fill.style.opacity = "0";
        }
      };

      if (isBootstrapping) {
        hideIfStillZero();
      } else {
        const waitMs = getTransitionMs(fill);
        if (waitMs > 0) {
          gaugeHideZeroTimer = window.setTimeout(hideIfStillZero, waitMs);
        } else {
          hideIfStillZero();
        }
      }
    } else {
      fill.style.opacity = "1";
      fill.style.strokeDashoffset = isBootstrapping
        ? `${GAUGE_CIRCUMFERENCE}`
        : `${targetOffset.toFixed(2)}`;
    }
  }

  const rem = Math.round(dailyNorm - totalToday);
  document.getElementById("remaining").textContent = rem;
}

// dayData is the full response object from /api/logs/day (has total_protein etc.)
function updateMacroBars(dayData) {
  if (!dayData) return;
  const g = translate("unitGrams") || "g";

  const totP = dayData.total_protein || 0;
  const totF = dayData.total_fat || 0;
  const totC = dayData.total_carbs || 0;

  // Targets come from backend; fall back to simple percentage if profile not set yet
  const refP = proteinTarget || Math.max(dailyNorm * 0.075, 50);
  const refF = fatTarget     || Math.max(dailyNorm * 0.033, 30);
  const refC = carbsTarget   || Math.max(dailyNorm * 0.125, 100);

  const barP = document.getElementById("macroBarProtein");
  const barF = document.getElementById("macroBarFat");
  const barC = document.getElementById("macroBarCarbs");
  const valP = document.getElementById("macroValProtein");
  const valF = document.getElementById("macroValFat");
  const valC = document.getElementById("macroValCarbs");

  if (barP) barP.style.width = `${Math.min(totP / refP * 100, 100).toFixed(1)}%`;
  if (barF) barF.style.width = `${Math.min(totF / refF * 100, 100).toFixed(1)}%`;
  if (barC) barC.style.width = `${Math.min(totC / refC * 100, 100).toFixed(1)}%`;
  if (valP) valP.textContent = `${Math.round(totP)} / ${Math.round(refP)} ${g}`;
  if (valF) valF.textContent = `${Math.round(totF)} / ${Math.round(refF)} ${g}`;
  if (valC) valC.textContent = `${Math.round(totC)} / ${Math.round(refC)} ${g}`;
}

function renderLogs() {
  const container = document.getElementById("todayLogs");
  container.innerHTML = "";
  const kcal = translate("unitKcal");

  if (!logs.length) {
    container.innerHTML = `
      <div class="empty-today">
        <div class="empty-today-icon">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 11h18M3 11c0 4 3.5 7 9 7s9-3 9-7"/>
            <path d="M12 4v3M8 5.5c0 0 1 1.5 1 2.5M16 5.5c0 0-1 1.5-1 2.5"/>
          </svg>
        </div>
        <p class="empty-today-title" data-i18n="emptyTodayTitle"></p>
        <p class="empty-today-sub" data-i18n="emptyTodaySub"></p>
      </div>`;
    renderAllTexts();
    return;
  }

  logs.forEach(log => {
    const hasMacros = log.protein != null || log.fat != null || log.carbs != null;
    const g = translate("unitGrams") || "г";

    let macroHtml = "";
    if (hasMacros && (log.protein > 0 || log.fat > 0 || log.carbs > 0)) {
      macroHtml = `
          <span class="macro-pill macro-pill-p">${translate("proteinsShort")} ${Math.round(log.protein || 0)}${g}</span>
          <span class="macro-pill macro-pill-f">${translate("fatsShort")} ${Math.round(log.fat || 0)}${g}</span>
          <span class="macro-pill macro-pill-c">${translate("carbsShort")} ${Math.round(log.carbs || 0)}${g}</span>`;
    }

    const div = document.createElement("div");
    div.className = "list-row";
    div.innerHTML = `
      <div>
        <div class="list-row-name">${log.food_name}</div>
        <div class="list-row-sub-row">
          <span class="list-row-cal">${Math.round(log.calories)} ${kcal}</span>
          ${macroHtml}
        </div>
      </div>
      <button onclick="deleteLog(${log.id})" class="btn-delete" aria-label="delete">
        <svg width="15" height="15" viewBox="0 0 15 15" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.282358 12.4728C-0.0867825 12.8419 -0.104361 13.5011 0.291147 13.8878C0.677866 14.2745 1.33705 14.2658 1.70619 13.8966L7.08509 8.50892L12.4728 13.8966C12.8507 14.2745 13.5011 14.2745 13.8878 13.8878C14.2658 13.4923 14.2745 12.8507 13.8878 12.4728L8.50892 7.08509L13.8878 1.70619C14.2745 1.32826 14.2745 0.677866 13.8878 0.291147C13.4923 -0.0867825 12.8507 -0.0955716 12.4728 0.282358L7.08509 5.67005L1.70619 0.282358C1.33705 -0.0867825 0.669077 -0.104361 0.291147 0.291147C-0.0955716 0.677866 -0.0867825 1.33705 0.282358 1.70619L5.67005 7.08509L0.282358 12.4728Z"/>
        </svg>
      </button>
    `;
    container.appendChild(div);
  });
}

async function deleteLog(id) {
  const msg = translate("deleteConfirmLog");
  if (await showConfirm(msg)) {
    await apiFetch(`/api/log/${id}`, "DELETE");
    await Promise.all([loadTodayLogs(), loadHistory(true)]);
  }
}

// ── Add meal modal ────────────────────────────────────────────────

function openAddModal() {
  document.getElementById("addLogModal").classList.add("open");
  setModalTab("quick");
  const quickMacros = document.getElementById("quickMacros");
  if (quickMacros) quickMacros.classList.toggle("hidden", trackingMode !== "full");
}

function closeAddModal() {
  document.getElementById("addLogModal").classList.remove("open");
}

function openAddFoodModal() {
  document.getElementById("addFoodModal").classList.add("open");
  setFoodType("fixed");
  const newFoodMacros = document.getElementById("newFoodMacros");
  if (newFoodMacros) newFoodMacros.classList.toggle("hidden", trackingMode !== "full");
}

function closeAddFoodModal() {
  document.getElementById("addFoodModal").classList.remove("open");
  resetBuilder();
}

async function addFoodAction() {
  if (newFoodType === "builder") {
    await saveBuilderDish();
  } else {
    await addNewFood();
  }
}

let activeModalTab = "quick";

function setModalTab(tab) {
  activeModalTab = tab;
  ["quick", "fixed", "per100g"].forEach(t => {
    document.getElementById(`modal-${t}`).classList.toggle("hidden", t !== tab);
    document.getElementById(`mtab-${t}`).classList.toggle("active", t === tab);
  });
  document.getElementById("modal-add-btn-wrap").classList.toggle("hidden", tab === "fixed");
  const btn = document.getElementById("modal-add-btn");
  if (btn) btn.textContent = translate("add");
  if (tab === "fixed")   renderFixedDishesList();
  if (tab === "per100g") renderPer100gDishesList();
}

function modalAddAction() {
  if (activeModalTab === "quick") quickAddLog();
  if (activeModalTab === "per100g") bulkLogPer100g();
}

function renderFixedDishesList() {
  const container = document.getElementById("fixedDishesList");
  container.innerHTML = "";
  const fixed = foods.filter(f => !f.per100g);
  if (!fixed.length) {
    container.innerHTML = `<p class="empty-hint">${translate("noFixedDishes")}</p>`;
    return;
  }
  const kcal = translate("unitKcal");
  const g = translate("unitGrams") || "g";
  fixed.forEach(food => {
    const hasMacros = food.protein != null || food.fat != null || food.carbs != null;
    let macroHtml = "";
    if (hasMacros && (food.protein > 0 || food.fat > 0 || food.carbs > 0)) {
      macroHtml = `
          <span class="macro-pill macro-pill-p">${translate("proteinsShort")} ${Math.round(food.protein || 0)}${g}</span>
          <span class="macro-pill macro-pill-f">${translate("fatsShort")} ${Math.round(food.fat || 0)}${g}</span>
          <span class="macro-pill macro-pill-c">${translate("carbsShort")} ${Math.round(food.carbs || 0)}${g}</span>`;
    }
    const div = document.createElement("div");
    div.className = "dish-row";
    div.dataset.name = food.name.toLowerCase();
    div.innerHTML = `
      <div>
        <span class="list-row-name">${food.name}</span>
        <div class="list-row-sub-row" style="margin-top:6px">
          <span class="dish-row-cal">${Math.round(food.calories)} ${kcal}</span>
          ${macroHtml}
        </div>
      </div>
    `;
    div.onclick = () => logFixedDish(food);
    container.appendChild(div);
  });
  const searchEl = document.getElementById("fixedSearch");
  if (searchEl && searchEl.value) filterFixedDishes(searchEl.value);
}

function filterFixedDishes(query) {
  const q = query.toLowerCase().trim();
  document.querySelectorAll("#fixedDishesList .dish-row").forEach(row => {
    row.classList.toggle("hidden", q.length > 0 && !row.dataset.name.includes(q));
  });
}

function renderPer100gDishesList() {
  const container = document.getElementById("per100gDishesList");
  container.innerHTML = "";
  const byWeight = foods.filter(f => f.per100g);
  if (!byWeight.length) {
    container.innerHTML = `<p class="empty-hint">${translate("noPer100gDishes")}</p>`;
    updateBulkAddBtn();
    return;
  }
  const kcal = translate("unitKcal");
  const gLabel = translate("per100gLabel");
  const g = translate("unitGrams") || "g";
  byWeight.forEach(food => {
    let macroHtml = "";
    if (food.protein != null || food.fat != null || food.carbs != null) {
      if (food.protein > 0 || food.fat > 0 || food.carbs > 0) {
        macroHtml = `
          <span class="macro-pill macro-pill-p">${translate("proteinsShort")} ${Math.round(food.protein || 0)}${g}</span>
          <span class="macro-pill macro-pill-f">${translate("fatsShort")} ${Math.round(food.fat || 0)}${g}</span>
          <span class="macro-pill macro-pill-c">${translate("carbsShort")} ${Math.round(food.carbs || 0)}${g}</span>`;
      }
    }
    const div = document.createElement("div");
    div.className = "dish-weight-row";
    div.dataset.foodId = food.id;
    div.innerHTML = `
      <div class="dish-weight-row-header">
        <span class="list-row-name">${food.name}</span>
        <div class="list-row-sub-row" style="margin-top:6px">
          <span class="dish-row-cal" style="font-size:0.72rem">${Math.round(food.calories)} ${kcal}/${gLabel}</span>
          ${macroHtml}
        </div>
      </div>
      <input type="number" id="weight-${food.id}" class="dish-weight-inline-input" placeholder="${translate("weightGPlaceholder")}"
        oninput="onBulkWeightInput(${food.id}, this)">
    `;
    container.appendChild(div);
  });
  updateBulkAddBtn();
}

function onBulkWeightInput(foodId, inputEl) {
  const row = inputEl.closest(".dish-weight-row");
  const hasValue = inputEl.value && parseFloat(inputEl.value) > 0;
  row.classList.toggle("has-weight", hasValue);
  updateBulkAddBtn();
}

function updateBulkAddBtn() {
  const btn = document.getElementById("modal-add-btn");
  if (!btn) return;
  const byWeight = foods.filter(f => f.per100g);
  const filled = byWeight.filter(food => {
    const el = document.getElementById(`weight-${food.id}`);
    return el && parseFloat(el.value) > 0;
  });
  if (filled.length === 0) {
    btn.textContent = translate("add");
    return;
  }
  const totalCal = filled.reduce((sum, food) => {
    const g = parseFloat(document.getElementById(`weight-${food.id}`).value) || 0;
    return sum + Math.round(food.calories * g / 100);
  }, 0);
  const kcal = translate("unitKcal");
  btn.textContent = `${translate("add")} (${filled.length}) · ${totalCal} ${kcal}`;
}

async function logFixedDish(food) {
  const date = toISODate(new Date());
  await apiFetch("/api/log", "POST", { food_id: food.id, date });
  closeAddModal();
  await Promise.all([loadTodayLogs(), loadHistory(true)]);
}

async function bulkLogPer100g() {
  const byWeight = foods.filter(f => f.per100g);
  const toLog = byWeight.filter(food => {
    const el = document.getElementById(`weight-${food.id}`);
    return el && parseFloat(el.value) > 0;
  });
  if (!toLog.length) return;

  const date = toISODate(new Date());
  await Promise.all(
    toLog.map(async food => {
      const grams = parseFloat(document.getElementById(`weight-${food.id}`).value);
      await apiFetch("/api/log", "POST", { food_id: food.id, grams, date });
    })
  );

  closeAddModal();
  await Promise.all([loadTodayLogs(), loadHistory(true)]);
}

async function quickAddLog() {
  const name =
    document.getElementById("quickFoodName").value.trim() ||
    translate("whatDidYouEat");
  const calories = parseFloat(document.getElementById("quickCalories").value);
  if (!calories || calories <= 0) return;

  const date = toISODate(new Date());
  const body = { food_name: name, calories, date };

  if (trackingMode === "full") {
    const protein = parseFloat(document.getElementById("quickProtein").value) || null;
    const fat = parseFloat(document.getElementById("quickFat").value) || null;
    const carbs = parseFloat(document.getElementById("quickCarbs").value) || null;
    if (protein != null) body.protein = protein;
    if (fat != null) body.fat = fat;
    if (carbs != null) body.carbs = carbs;
  }

  await apiFetch("/api/log", "POST", body);

  document.getElementById("quickFoodName").value = "";
  document.getElementById("quickCalories").value = "";
  document.getElementById("quickProtein").value = "";
  document.getElementById("quickFat").value = "";
  document.getElementById("quickCarbs").value = "";
  closeAddModal();

  await Promise.all([loadTodayLogs(), loadHistory(true)]);
}

// ── My foods ──────────────────────────────────────────────────────

let builderIngredients = [];

function setFoodType(type) {
  newFoodType = type;
  document.getElementById("food-type-fixed").classList.toggle("active", type === "fixed");
  document.getElementById("food-type-per100g").classList.toggle("active", type === "per100g");
  document.getElementById("food-type-builder").classList.toggle("active", type === "builder");

  const isBuilder = type === "builder";
  document.getElementById("food-form-rows").classList.toggle("hidden", isBuilder);
  document.getElementById("builder-panel").classList.toggle("hidden", !isBuilder);

  const label = document.getElementById("cal-unit-label");
  if (label) {
    label.setAttribute("data-i18n", type === "per100g" ? "per100gLabel" : "unitKcal");
    label.textContent = translate(type === "per100g" ? "per100gLabel" : "unitKcal");
  }

  const btnLabel = document.getElementById("foods-cta-label");
  if (btnLabel) {
    if (isBuilder) {
      btnLabel.removeAttribute("data-i18n");
      btnLabel.textContent = translate("builderSave");
    } else {
      btnLabel.setAttribute("data-i18n", "addFoodToBase");
      btnLabel.textContent = translate("addFoodToBase");
    }
  }
}

// ── Builder ───────────────────────────────────────────────────────

function onBuilderSearch(q) {
  const box = document.getElementById("builderSuggestions");
  if (!q.trim()) { box.innerHTML = ""; return; }
  const matches = searchIngredients(q);
  const kcal = translate("unitKcal");
  box.innerHTML = "";

  const wrap = document.createElement("div");
  wrap.className = "builder-suggestions";

  matches.forEach(ing => {
    const row = document.createElement("div");
    row.className = "builder-suggestion-row";
    row.innerHTML = `<span>${getIngredientName(ing)}</span><span class="builder-suggestion-kcal">${ing.kcal} ${kcal}/100g</span>`;
    row.onclick = () => { addBuilderIngredient(ing.name, ing.kcal, false, { protein: ing.protein || 0, fat: ing.fat || 0, carbs: ing.carbs || 0 }); document.getElementById("builderSearch").value = ""; box.innerHTML = ""; };
    wrap.appendChild(row);
  });

  // custom option
  const custom = document.createElement("div");
  custom.className = "builder-suggestion-row";
  custom.innerHTML = `<span>${translate("builderCustom")}: <strong>${q}</strong></span>`;
  custom.onclick = () => { document.getElementById("builderSearch").value = ""; showBuilderCustomForm(q); };
  wrap.appendChild(custom);

  box.appendChild(wrap);
}

function showBuilderCustomForm(name) {
  const box = document.getElementById("builderSuggestions");
  const kcalLabel = translate("builderCustomKcalPh");
  const addLabel  = translate("add");
  const isFull    = trackingMode === "full";

  const wrap = document.createElement("div");
  wrap.className = "builder-custom-form grouped-card";

  let macroFields = "";
  if (isFull) {
    const g = translate("unitGrams") || "g";
    macroFields = `
      <div class="form-row labeled">
        <span class="row-label">${translate("proteins")}</span>
        <div class="input-suffix-wrap">
          <input id="builderCustomProtein" type="number" step="0.1" placeholder="${translate("proteinsPlaceholder")}">
          <span class="input-suffix">${g}</span>
        </div>
      </div>
      <div class="form-row labeled">
        <span class="row-label">${translate("fats")}</span>
        <div class="input-suffix-wrap">
          <input id="builderCustomFat" type="number" step="0.1" placeholder="${translate("fatsPlaceholder")}">
          <span class="input-suffix">${g}</span>
        </div>
      </div>
      <div class="form-row labeled" style="border-bottom:none">
        <span class="row-label">${translate("carbs")}</span>
        <div class="input-suffix-wrap">
          <input id="builderCustomCarbs" type="number" step="0.1" placeholder="${translate("carbsPlaceholder")}">
          <span class="input-suffix">${g}</span>
        </div>
      </div>`;
  }

  wrap.innerHTML = `
    <div class="form-row labeled">
      <span class="row-label" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0;flex:0 1 auto">${name}</span>
      <div class="input-suffix-wrap">
        <input id="builderCustomKcal" type="number" placeholder="${kcalLabel}">
        <span class="input-suffix">${translate("unitKcal")}</span>
      </div>
    </div>${macroFields}`;

  const btn = document.createElement("button");
  btn.className = "btn-cta";
  btn.style.cssText = "margin:0.5rem 1rem;width:calc(100% - 2rem)";
  btn.textContent = addLabel;
  btn.onclick = () => confirmBuilderCustom(name);
  wrap.appendChild(btn);

  box.innerHTML = "";
  box.appendChild(wrap);
}

function confirmBuilderCustom(name) {
  const kcal = parseFloat(document.getElementById("builderCustomKcal").value);
  if (!kcal || kcal <= 0) return;
  const protein = parseFloat(document.getElementById("builderCustomProtein")?.value) || 0;
  const fat     = parseFloat(document.getElementById("builderCustomFat")?.value) || 0;
  const carbs   = parseFloat(document.getElementById("builderCustomCarbs")?.value) || 0;
  addBuilderIngredient(name, kcal, true, { protein, fat, carbs });
  document.getElementById("builderSuggestions").innerHTML = "";
}

function addBuilderIngredient(name, kcalPer100g, isCustom, macros = null) {
  builderIngredients.push({ name, kcalPer100g, grams: 0, isCustom, macros });
  renderBuilderIngredients();
}

function removeBuilderIngredient(idx) {
  builderIngredients.splice(idx, 1);
  renderBuilderIngredients();
}

function updateBuilderGrams(idx, val) {
  builderIngredients[idx].grams = parseFloat(val) || 0;
  updateBuilderTotals();
}

function updateBuilderTotals() {
  const kcal = translate("unitKcal");
  builderIngredients.forEach((ing, idx) => {
    const rowKcal = Math.round(ing.kcalPer100g * ing.grams / 100);
    const el = document.getElementById(`ing-total-${idx}`);
    if (el) el.textContent = rowKcal > 0 ? `${rowKcal} ${kcal}` : "—";
  });
  const totalKcal = builderIngredients.reduce((s, i) => s + i.kcalPer100g * i.grams / 100, 0);
  const totalEl = document.getElementById("builderTotal");
  if (totalEl) totalEl.textContent = `${Math.round(totalKcal)} ${kcal}`;
}

function renderBuilderIngredients() {
  const container = document.getElementById("builderIngredients");
  const kcal = translate("unitKcal");
  container.innerHTML = "";

  if (!builderIngredients.length) {
    document.getElementById("builderWeightRow").style.display = "none";
    return;
  }

  builderIngredients.forEach((ing, idx) => {
    const rowKcal = Math.round(ing.kcalPer100g * ing.grams / 100);
    const row = document.createElement("div");
    row.className = "builder-ing-row";
    const displayName = ing.isCustom ? ing.name : (getIngredientName({ name: ing.name }) || ing.name);
    const g = translate("unitGrams") || "г";
    const kcalPerLabel = `${ing.kcalPer100g} ${kcal}/100${g}`;

    let pillsHtml = `<span class="macro-pill">${kcalPerLabel}</span>`;
    if (ing.macros && (ing.macros.protein > 0 || ing.macros.fat > 0 || ing.macros.carbs > 0)) {
      pillsHtml += `
        <span class="macro-pill macro-pill-p">${translate("proteinsShort")} ${Math.round(ing.macros.protein)}${g}</span>
        <span class="macro-pill macro-pill-f">${translate("fatsShort")} ${Math.round(ing.macros.fat)}${g}</span>
        <span class="macro-pill macro-pill-c">${translate("carbsShort")} ${Math.round(ing.macros.carbs)}${g}</span>`;
    }

    row.innerHTML = `
      <div class="builder-ing-info">
        <span class="builder-ing-name">${displayName}</span>
        <div class="builder-ing-pills">${pillsHtml}</div>
      </div>
      <div class="builder-ing-controls">
        <input class="builder-ing-weight" type="number" value="${ing.grams || ""}" placeholder="${g}"
          oninput="updateBuilderGrams(${idx}, this.value)">
        <span class="builder-ing-total" id="ing-total-${idx}">${rowKcal > 0 ? rowKcal + " " + kcal : "—"}</span>
        <button onclick="removeBuilderIngredient(${idx})" class="btn-delete" aria-label="delete">
          <svg width="20" height="17" viewBox="0 0 20 17" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.2949 16.4092C18.1934 16.4092 19.1777 15.5039 19.1777 13.623V2.85645C19.1777 0.975586 18.1934 0 16.2949 0H8.69238C7.51465 0 6.65332 0.290039 5.8623 1.15137L0.887695 6.43359C0.246094 7.12793 0 7.6377 0 8.19141C0 8.74512 0.246094 9.26367 0.887695 9.94922L5.87109 15.2051C6.66211 16.0664 7.52344 16.4004 8.69238 16.4004L16.2949 16.4092ZM16.1895 14.6865H8.62207C8.00684 14.6865 7.61133 14.5283 7.18066 14.0801L2.23242 8.85938C1.96875 8.58691 1.88965 8.39355 1.88965 8.19141C1.88965 7.98926 1.97754 7.80469 2.23242 7.53223L7.17188 2.28516C7.60254 1.83691 8.00684 1.72266 8.61328 1.72266H16.1895C17.0068 1.72266 17.4551 2.14453 17.4551 2.99707V13.4033C17.4551 14.2559 17.0068 14.6865 16.1895 14.6865ZM8.32324 11.8916C8.55176 11.8916 8.74512 11.8125 8.89453 11.6543L11.2148 9.33398L13.5352 11.6543C13.6846 11.8037 13.8779 11.8916 14.1152 11.8916C14.5547 11.8916 14.9062 11.54 14.9062 11.0918C14.9062 10.8721 14.8184 10.6875 14.6689 10.5381L12.3398 8.20898L14.6689 5.87109C14.8359 5.71289 14.915 5.52832 14.915 5.31738C14.915 4.87793 14.5635 4.52637 14.1152 4.52637C13.9043 4.52637 13.7285 4.60547 13.5615 4.77246L11.2148 7.10156L8.88574 4.77246C8.72754 4.61426 8.55176 4.54395 8.32324 4.54395C7.88379 4.54395 7.53223 4.88672 7.53223 5.32617C7.53223 5.53711 7.62012 5.73047 7.76953 5.87988L10.0986 8.20898L7.76953 10.5469C7.62012 10.6875 7.53223 10.8809 7.53223 11.0918C7.53223 11.54 7.88379 11.8916 8.32324 11.8916Z"/>
          </svg>
        </button>
      </div>`;
    container.appendChild(row);
  });

  const totalKcal = builderIngredients.reduce((s, i) => s + i.kcalPer100g * i.grams / 100, 0);
  const totalRow = document.createElement("div");
  totalRow.className = "builder-total-row";
  totalRow.innerHTML = `<span>${translate("builderTotal")}</span><span id="builderTotal">${Math.round(totalKcal)} ${kcal}</span>`;
  container.appendChild(totalRow);

  document.getElementById("builderWeightRow").style.display = "block";
}

function resetBuilder() {
  builderIngredients = [];
  document.getElementById("builderDishName").value = "";
  document.getElementById("builderSearch").value = "";
  document.getElementById("builderDishWeight").value = "";
  document.getElementById("builderSuggestions").innerHTML = "";
  renderBuilderIngredients();
}

async function saveBuilderDish() {
  const name = document.getElementById("builderDishName").value.trim();
  const dishWeight = parseFloat(document.getElementById("builderDishWeight").value);
  if (!name || !builderIngredients.length || !dishWeight || dishWeight <= 0) {
    showToast(translate("fillFields"));
    return;
  }
  const totalKcal = builderIngredients.reduce((s, i) => s + i.kcalPer100g * i.grams / 100, 0);
  const kcalPer100g = Math.round(totalKcal / dishWeight * 100);

  // Calculate per-100g macros for the saved Food template
  const totalP = builderIngredients.reduce((s, i) => s + (i.macros?.protein || 0) * i.grams / 100, 0);
  const totalF = builderIngredients.reduce((s, i) => s + (i.macros?.fat || 0) * i.grams / 100, 0);
  const totalC = builderIngredients.reduce((s, i) => s + (i.macros?.carbs || 0) * i.grams / 100, 0);
  const pPer100 = totalP > 0 ? totalP / dishWeight * 100 : null;
  const fPer100 = totalF > 0 ? totalF / dishWeight * 100 : null;
  const cPer100 = totalC > 0 ? totalC / dishWeight * 100 : null;

  await apiFetch("/api/foods", "POST", {
    name,
    calories: kcalPer100g,
    per100g: true,
    protein: pPer100,
    fat: fPer100,
    carbs: cPer100,
  });

  resetBuilder();
  closeAddFoodModal();
  foodsLoaded = false;
  await loadFoods();
  showToast(translate("dishAdded"));
}

async function loadFoods(force = false) {
  if (foodsLoaded && !force) return;

  const data = await apiFetch("/api/foods");
  if (!data) return;

  foods = data;
  foodsLoaded = true;
  renderFoods();
}

function renderFoods() {
  const container = document.getElementById("foodsList");
  container.innerHTML = "";
  const kcal = translate("unitKcal");
  const per100 = translate("per100gLabel");
  const g = translate("unitGrams") || "г";
  foods.forEach(food => {
    const calLabel = food.per100g
      ? `${Math.round(food.calories)} ${kcal}/${per100}`
      : `${Math.round(food.calories)} ${kcal}`;
    const badge = food.per100g
      ? `<div style="display: flex;margin-bottom:6px;"><span class="badge">${translate("foodTypePer100g")}</span></div>`
      : "";
    let macroHtml = "";
    if (food.protein != null || food.fat != null || food.carbs != null) {
      if (food.protein > 0 || food.fat > 0 || food.carbs > 0) {
        macroHtml = `
          <span class="macro-pill macro-pill-p">${translate("proteinsShort")} ${Math.round(food.protein || 0)}${g}</span>
          <span class="macro-pill macro-pill-f">${translate("fatsShort")} ${Math.round(food.fat || 0)}${g}</span>
          <span class="macro-pill macro-pill-c">${translate("carbsShort")} ${Math.round(food.carbs || 0)}${g}</span>`;
      }
    }
    const div = document.createElement("div");
    div.className = "list-row";
    div.innerHTML = `
      <div style="flex:1;min-width:0;">
        ${badge}
        <div class="list-row-name" style="text-overflow:ellipsis;">${food.name}</div>
        <div class="list-row-sub-row">
          <span class="list-row-cal">${calLabel}</span>
          ${macroHtml}
        </div>
      </div>
      <button onclick="deleteFood(${food.id})" class="btn-delete" aria-label="delete">
        <svg width="18" height="20" viewBox="0 0 18 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.64941 19.8545H12.7266C14.0801 19.8545 14.9502 19.0371 15.0205 17.6836L15.6094 5.02734H16.5762C17.0244 5.02734 17.3672 4.67578 17.3672 4.23633C17.3672 3.79688 17.0156 3.46289 16.5762 3.46289H12.6738V2.14453C12.6738 0.791016 11.8125 0 10.3447 0H7.00488C5.53711 0 4.67578 0.791016 4.67578 2.14453V3.46289H0.791016C0.351562 3.46289 0 3.80566 0 4.23633C0 4.68457 0.351562 5.02734 0.791016 5.02734H1.75781L2.34668 17.6836C2.41699 19.0459 3.27832 19.8545 4.64941 19.8545ZM6.31934 2.22363C6.31934 1.77539 6.63574 1.48535 7.11914 1.48535H10.2305C10.7139 1.48535 11.0303 1.77539 11.0303 2.22363V3.46289H6.31934V2.22363ZM4.8252 18.2812C4.3418 18.2812 3.99023 17.9209 3.96387 17.4023L3.375 5.02734H13.9658L13.3945 17.4023C13.377 17.9297 13.0342 18.2812 12.5332 18.2812H4.8252ZM6.09082 16.8662C6.46875 16.8662 6.70605 16.6289 6.69727 16.2773L6.43359 7.08398C6.4248 6.73242 6.17871 6.50391 5.81836 6.50391C5.44922 6.50391 5.21191 6.74121 5.2207 7.09277L5.48438 16.2861C5.49316 16.6377 5.73926 16.8662 6.09082 16.8662ZM8.68359 16.8662C9.05273 16.8662 9.30762 16.6377 9.30762 16.2861V7.09277C9.30762 6.74121 9.05273 6.50391 8.68359 6.50391C8.31445 6.50391 8.06836 6.74121 8.06836 7.09277V16.2861C8.06836 16.6377 8.31445 16.8662 8.68359 16.8662ZM11.2764 16.875C11.6279 16.875 11.874 16.6377 11.8828 16.2861L12.1465 7.09277C12.1553 6.74121 11.918 6.5127 11.5488 6.5127C11.1885 6.5127 10.9424 6.74121 10.9336 7.09277L10.6699 16.2861C10.6611 16.6289 10.8984 16.875 11.2764 16.875Z"/>
        </svg>
      </button>
    `;
    container.appendChild(div);
  });
}

async function addNewFood() {
  const name = document.getElementById("newFoodName").value.trim();
  const calories = parseFloat(document.getElementById("newFoodCalories").value);
  if (!name || !calories || calories <= 0) {
    showToast(translate("fillFields"));
    return;
  }
  const body = { name, calories, per100g: newFoodType === "per100g" };
  if (trackingMode === "full") {
    const protein = parseFloat(document.getElementById("newFoodProtein").value) || null;
    const fat     = parseFloat(document.getElementById("newFoodFat").value) || null;
    const carbs   = parseFloat(document.getElementById("newFoodCarbs").value) || null;
    if (protein != null) body.protein = protein;
    if (fat != null)     body.fat = fat;
    if (carbs != null)   body.carbs = carbs;
  }
  await apiFetch("/api/foods", "POST", body);
  document.getElementById("newFoodName").value = "";
  document.getElementById("newFoodCalories").value = "";
  document.getElementById("newFoodProtein").value = "";
  document.getElementById("newFoodFat").value = "";
  document.getElementById("newFoodCarbs").value = "";
  closeAddFoodModal();
  foodsLoaded = false;
  await loadFoods();
  showToast(translate("dishAdded"));
}

async function deleteFood(id) {
  const msg = translate("deleteConfirmFood");
  if (await showConfirm(msg)) {
    await apiFetch(`/api/foods/${id}`, "DELETE");
    foodsLoaded = false;
    await loadFoods();
  }
}

// ── History / Calendar ────────────────────────────────────────────

let historyData = {};
let calOffset = 0;

async function loadHistory(force = false) {
  if (!historyLoaded || force) {
    const data = await apiFetch("/api/history");
    if (!data) return;

    historyData = data;
    historyLoaded = true;
  }

  renderCalendar();
}

function renderCalendar() {
  const today = new Date();
  const target = new Date(today.getFullYear(), today.getMonth() - calOffset, 1);
  const year  = target.getFullYear();
  const month = target.getMonth();

  const months = translations[currentLang]?.months || translations.ru.months;
  document.getElementById("calMonthLabel").textContent = `${months[month]} ${year}`;

  document.querySelector(".cal-nav:last-child").disabled = calOffset === 0;

  const dow = translations[currentLang]?.dow || translations.ru.dow;
  const dowRow = document.getElementById("calDowRow");
  dowRow.innerHTML = "";
  dow.forEach(d => {
    const cell = document.createElement("div");
    cell.className = "cal-dow";
    cell.textContent = d;
    dowRow.appendChild(cell);
  });

  const grid = document.getElementById("calGrid");
  grid.innerHTML = "";

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  let startDow = new Date(year, month, 1).getDay();
  startDow = (startDow + 6) % 7;

  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() - 29);
  cutoff.setHours(0, 0, 0, 0);

  for (let i = 0; i < startDow; i++) {
    const blank = document.createElement("div");
    blank.className = "cal-day empty";
    grid.appendChild(blank);
  }

  const todayStr = toISODate(today);

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    const dateStr  = toISODate(cellDate);
    const cell = document.createElement("div");

    const inRange = cellDate >= cutoff && cellDate <= today;
    const isFuture = cellDate > today;

    const num = document.createElement("span");
    num.className = "cal-day-num";
    num.textContent = d;
    cell.appendChild(num);

    if (isFuture || !inRange) {
      cell.className = "cal-day out-of-range";
    } else {
      const kcal = historyData[dateStr] || 0;

      cell.className = `cal-day has-data`;
      cell.dataset.date = dateStr;

      if (kcal > 0) {
        const dot = document.createElement("span");
        dot.className = "cal-day-dot";
        dot.classList.add(kcal <= dailyNorm ? "dot-green" : "dot-red");
        cell.appendChild(dot);
      }

      cell.addEventListener("click", () => selectDay(dateStr, cell));
    }

    if (dateStr === todayStr) cell.classList.add("today");
    grid.appendChild(cell);
  }
}

function calShift(dir) {
  const newOffset = calOffset - dir;
  if (newOffset < 0) return;
  calOffset = newOffset;
  document.getElementById("dayDetail").classList.add("hidden");
  document.querySelectorAll(".cal-day.selected").forEach(el => el.classList.remove("selected"));
  renderCalendar();
}

async function selectDay(dateStr, cellEl) {
  document.querySelectorAll(".cal-day.selected").forEach(el => el.classList.remove("selected"));
  cellEl.classList.add("selected");

  const detail = document.getElementById("dayDetail");
  const logsContainer = document.getElementById("dayDetailLogs");
  detail.classList.remove("hidden");
  logsContainer.innerHTML = `<p class="empty-hint">…</p>`;

  const data = await apiFetch(`/api/logs/day/${dateStr}`);
  if (!data) { detail.classList.add("hidden"); return; }

  const kcal = translate("unitKcal");
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = translations[currentLang]?.months || translations.ru.months;
  document.getElementById("dayDetailDate").textContent = `${d} ${months[m - 1]} ${y}`;
  // total_calories is the new field name; fall back to legacy "total" if backend not yet deployed
  const dayTotal = data.total_calories ?? data.total ?? 0;
  const rem = Math.round(data.daily_norm - dayTotal);
  document.getElementById("dayDetailEaten").textContent = `${Math.round(dayTotal)} ${kcal}`;
  document.getElementById("dayDetailRemaining").textContent = `${rem} ${kcal}`;

  // Macro bars in history — data comes fully from backend
  const macroSection = document.getElementById("dayDetailMacros");
  if (macroSection) {
    if (trackingMode === "full") {
      macroSection.classList.remove("hidden");
      renderHistoryMacroBars(data);
    } else {
      macroSection.classList.add("hidden");
    }
  }

  logsContainer.innerHTML = "";
  if (!data.logs.length) {
    logsContainer.innerHTML = `<p class="empty-hint">${translate("noLogsForDay")}</p>`;
    return;
  }
  const g = translate("unitGrams") || "г";
  data.logs.forEach(log => {
    const row = document.createElement("div");
    row.className = "day-log-row";
    let macroHtml = "";
    if (log.protein != null || log.fat != null || log.carbs != null) {
      if (log.protein > 0 || log.fat > 0 || log.carbs > 0) {
        macroHtml = `
          <span class="macro-pill macro-pill-p">${translate("proteinsShort")} ${Math.round(log.protein || 0)}${g}</span>
          <span class="macro-pill macro-pill-f">${translate("fatsShort")} ${Math.round(log.fat || 0)}${g}</span>
          <span class="macro-pill macro-pill-c">${translate("carbsShort")} ${Math.round(log.carbs || 0)}${g}</span>`;
      }
    }
    row.innerHTML = `
      <div>
        <span>${log.food_name}</span>
        ${macroHtml ? `<div class="list-row-sub-row" style="margin-top:6px">${macroHtml}</div>` : ""}
      </div>
      <span class="day-log-cal">${Math.round(log.calories)} ${kcal}</span>`;
    logsContainer.appendChild(row);
  });
}

function renderHistoryMacroBars(data) {
  const g = translate("unitGrams") || "g";
  const totP = data.total_protein || 0;
  const totF = data.total_fat || 0;
  const totC = data.total_carbs || 0;
  const norm = data.daily_norm || 2000;
  const refP = data.protein_target || proteinTarget || Math.max(norm * 0.075, 50);
  const refF = data.fat_target     || fatTarget     || Math.max(norm * 0.033, 30);
  const refC = data.carbs_target   || carbsTarget   || Math.max(norm * 0.125, 100);

  const barP = document.getElementById("histMacroBarProtein");
  const barF = document.getElementById("histMacroBarFat");
  const barC = document.getElementById("histMacroBarCarbs");
  const valP = document.getElementById("histMacroValProtein");
  const valF = document.getElementById("histMacroValFat");
  const valC = document.getElementById("histMacroValCarbs");

  if (barP) barP.style.width = `${Math.min(totP / refP * 100, 100).toFixed(1)}%`;
  if (barF) barF.style.width = `${Math.min(totF / refF * 100, 100).toFixed(1)}%`;
  if (barC) barC.style.width = `${Math.min(totC / refC * 100, 100).toFixed(1)}%`;
  if (valP) valP.textContent = `${Math.round(totP)} / ${Math.round(refP)} ${g}`;
  if (valF) valF.textContent = `${Math.round(totF)} / ${Math.round(refF)} ${g}`;
  if (valC) valC.textContent = `${Math.round(totC)} / ${Math.round(refC)} ${g}`;
}

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function initGauge() {
  const track = document.getElementById("gaugeTrack");
  const fill = document.getElementById("gaugeFill");
  if (!track || !fill) return;

  track.style.strokeDasharray = `${GAUGE_CIRCUMFERENCE} ${GAUGE_CIRCUMFERENCE}`;
  track.style.strokeDashoffset = "0";

  fill.style.strokeDasharray = `${GAUGE_CIRCUMFERENCE} ${GAUGE_CIRCUMFERENCE}`;
  fill.style.strokeDashoffset = `${GAUGE_CIRCUMFERENCE}`;
  fill.style.opacity = "0";
}

// ── Init ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  setAppBusy(true);

  const gaugeWrap = document.querySelector(".gauge-wrap");
  if (gaugeWrap) gaugeWrap.classList.add("gauge-loading");

  initGauge();

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      document.querySelectorAll(".tab-content").forEach(c =>
        c.classList.add("hidden")
      );
      document.getElementById(btn.dataset.tab).classList.remove("hidden");
      document.querySelectorAll(".tab-btn").forEach(b =>
        b.classList.remove("active")
      );
      btn.classList.add("active");

      const fab = document.getElementById("fab-add");
      if (fab) fab.classList.toggle("hidden", btn.dataset.tab !== "tab-today");

      const fabFood = document.getElementById("fab-add-food");
      if (fabFood) {
        fabFood.classList.toggle("hidden", btn.dataset.tab !== "tab-foods");
      }

      if (btn.dataset.tab === "tab-foods") {
        if (!foodsLoaded) {
          await loadFoods();
        } else {
          renderFoods();
        }
      }

      if (btn.dataset.tab === "tab-history") {
        calOffset = 0;
        await loadHistory();

        const todayStr = toISODate(new Date());
        const todayCell = document.querySelector(
          `.cal-day[data-date="${todayStr}"]`
        );
        if (todayCell) {
          await selectDay(todayStr, todayCell);
        }
      }
    });
  });

  document.addEventListener("click", e => {
    const wrapper = document.querySelector(".lang-wrapper");
    if (wrapper && !wrapper.contains(e.target)) {
      document.getElementById("lang-dropdown").classList.remove("open");
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      loadTodayLogs();
    }
  });

  try {
    initTheme();
    renderLanguageDropdown();
    renderAllTexts();
    updateLanguageButton();
    updateUnitUI();
    toggleGoalPercent();
    renderTodayHeader();

    document.getElementById("tracking-mode-simple").classList.toggle(
      "active",
      trackingMode === "simple"
    );
    document.getElementById("tracking-mode-full").classList.toggle(
      "active",
      trackingMode === "full"
    );
    updateTrackingModeUI();

    const ok = await bootstrapApp();

    if (ok) {
      renderCalendar();
    }

    if (!ok) {
      await Promise.all([loadProfile(), loadTodayLogs(), loadHistory(true)]);
    }

    sendTimezoneInBackground();
  } catch (e) {
    console.error("[bootstrap]", e);
  } finally {
    isBootstrapping = false;
    if (gaugeWrap) gaugeWrap.classList.remove("gauge-loading");
    setAppBusy(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateProgress();
        if (trackingMode === "full" && lastTodayData) {
          updateMacroBars(lastTodayData);
        }
      });
    });
  }
});
