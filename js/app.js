// ── Telegram WebApp ───────────────────────────────────────────────
let tg = null;
if (window.Telegram && window.Telegram.WebApp) {
  tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
}

const tgId = tg ? (tg.initDataUnsafe?.user?.id || 123456789) : 123456789;
const API_BASE = "https://web-production-fcefd.up.railway.app";

let dailyNorm = 2000;
let totalToday = 0;
let foods = [];
let logs = [];
let currentUnits = "metric";
let newFoodType = "fixed";

// ── New clean stable SVG icons (different from previous version) ──

const MOON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
</svg>`;

const SUN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="5"/>
  <line x1="12" y1="1" x2="12" y2="3"/>
  <line x1="12" y1="21" x2="12" y2="23"/>
  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
  <line x1="1" y1="12" x2="3" y2="12"/>
  <line x1="21" y1="12" x2="23" y2="12"/>
  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
</svg>`;

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

  const btn = document.getElementById("theme-btn");
  btn.innerHTML = theme === "dark" ? MOON_SVG : SUN_SVG;
}

function toggleTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
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
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (body) options.body = JSON.stringify(body);
  const response = await fetch(url, options);
  if (!response.ok) {
    console.error("[apiFetch] error", response.status, url);
    return null;
  }
  return response.json();
}

// ── Profile ───────────────────────────────────────────────────────

let currentGender = "male";

function setGender(gender) {
  currentGender = gender;
  document.getElementById("gender-male").classList.toggle("active", gender === "male");
  document.getElementById("gender-female").classList.toggle("active", gender === "female");
}

async function loadProfile() {
  try {
    const data = await apiFetch(`/api/profile/${tgId}`);
    if (!data) return;
    dailyNorm = data.daily_norm || 2000;
    currentUnits = data.units || "metric";

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
    tg_id: tgId,
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
  dailyNorm = result.daily_norm;
  document.getElementById("dailyNorm").textContent = Math.round(dailyNorm);
  updateProgress();
  const msg = translate("profileSaved");
  if (tg) tg.showAlert(msg); else alert(msg);
}

// ── Today logs ────────────────────────────────────────────────────

async function loadTodayLogs() {
  const data = await apiFetch(`/api/logs/today/${tgId}`);
  if (!data) return;
  logs = data.logs || [];
  totalToday = data.total_today || 0;
  document.getElementById("totalToday").textContent = Math.round(totalToday);
  renderLogs();
  updateProgress();
}

function updateProgress() {
  const R = 85;
  const cx = 100, cy = 100;
  // 240° arc: starts bottom-left (150°), sweeps clockwise to bottom-right (30°)
  const START_DEG = 150;
  const SWEEP_DEG = 240;
  const toRad = d => d * Math.PI / 180;

  function arcPoint(deg) {
    return {
      x: cx + R * Math.cos(toRad(deg)),
      y: cy + R * Math.sin(toRad(deg))
    };
  }

  function arcPath(sweepDeg) {
    const s = arcPoint(START_DEG);
    const e = arcPoint(START_DEG + sweepDeg);
    const large = sweepDeg > 180 ? 1 : 0;
    return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${R} ${R} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`;
  }

  const totalLen = toRad(SWEEP_DEG) * R;
  const track = document.getElementById("gaugeTrack");
  const fill  = document.getElementById("gaugeFill");

  if (track) track.setAttribute("d", arcPath(SWEEP_DEG));

  if (fill) {
    fill.setAttribute("d", arcPath(SWEEP_DEG));
    const pct = dailyNorm > 0 ? Math.min(totalToday / dailyNorm, 1) : 0;
    const filled = pct * totalLen;
    fill.style.strokeDasharray  = `${filled.toFixed(2)} ${totalLen.toFixed(2)}`;
    fill.style.strokeDashoffset = "0";
    fill.style.visibility = pct === 0 ? "hidden" : "visible";
  }

  const rem = Math.max(0, Math.round(dailyNorm - totalToday));
  document.getElementById("remaining").textContent = rem;
}

function renderLogs() {
  const container = document.getElementById("todayLogs");
  container.innerHTML = "";
  const kcal = translate("unitKcal");
  logs.forEach(log => {
    const div = document.createElement("div");
    div.className = "list-row";
    div.innerHTML = `
      <div>
        <div class="list-row-name">${log.food_name}</div>
        <div class="list-row-sub">${Math.round(log.calories)} ${kcal}</div>
      </div>
      <button onclick="deleteLog(${log.id})" class="btn-delete" aria-label="delete">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    `;
    container.appendChild(div);
  });
}

async function deleteLog(id) {
  const msg = translate("deleteConfirmLog");
  if (tg ? await new Promise(r => tg.showConfirm(msg, r)) : confirm(msg)) {
    await apiFetch(`/api/log/${id}`, "DELETE");
    await loadTodayLogs();
  }
}

// ── Add meal modal ────────────────────────────────────────────────

function openAddModal() {
  document.getElementById("addLogModal").classList.add("open");
  setModalTab("quick");
}

function closeAddModal() {
  document.getElementById("addLogModal").classList.remove("open");
}

let activeModalTab = "quick";

function setModalTab(tab) {
  activeModalTab = tab;
  ["quick", "fixed", "per100g"].forEach(t => {
    document.getElementById(`modal-${t}`).classList.toggle("hidden", t !== tab);
    document.getElementById(`mtab-${t}`).classList.toggle("active", t === tab);
  });
  document.getElementById("modal-add-btn-wrap").classList.toggle("hidden", tab === "fixed");
  if (tab === "fixed")  renderFixedDishesList();
  if (tab === "per100g") renderPer100gDishesList();
}

function modalAddAction() {
  if (activeModalTab === "quick") quickAddLog();
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
  fixed.forEach(food => {
    const div = document.createElement("div");
    div.className = "dish-row";
    div.innerHTML = `
      <span class="list-row-name">${food.name}</span>
      <span class="dish-row-cal">${Math.round(food.calories)} ${kcal}</span>
    `;
    div.onclick = () => logFixedDish(food);
    container.appendChild(div);
  });
}

function renderPer100gDishesList() {
  const container = document.getElementById("per100gDishesList");
  container.innerHTML = "";
  const byWeight = foods.filter(f => f.per100g);
  if (!byWeight.length) {
    container.innerHTML = `<p class="empty-hint">${translate("noPer100gDishes")}</p>`;
    return;
  }
  const kcal = translate("unitKcal");
  const gLabel = translate("per100gLabel");
  byWeight.forEach(food => {
    const div = document.createElement("div");
    div.className = "dish-weight-row";
    div.innerHTML = `
      <div class="dish-weight-row-header">
        <span class="list-row-name">${food.name}</span>
        <span class="dish-weight-row-sub">${Math.round(food.calories)} ${kcal}/${gLabel}</span>
      </div>
      <div class="dish-weight-input-row">
        <input type="number" id="weight-${food.id}" placeholder="${translate("weightGPlaceholder")}">
        <button onclick="logPer100gDish(${food.id})" class="btn-add">${translate("add")}</button>
      </div>
    `;
    container.appendChild(div);
  });
}

async function logFixedDish(food) {
  await apiFetch("/api/log", "POST", { tg_id: tgId, food_name: food.name, calories: food.calories });
  closeAddModal();
  await loadTodayLogs();
}

async function logPer100gDish(foodId) {
  const food = foods.find(f => f.id === foodId);
  if (!food) return;
  const grams = parseFloat(document.getElementById(`weight-${foodId}`).value);
  if (!grams || grams <= 0) return;
  const calories = Math.round(food.calories * grams / 100);
  await apiFetch("/api/log", "POST", { tg_id: tgId, food_name: `${food.name} (${grams}g)`, calories });
  closeAddModal();
  await loadTodayLogs();
}

async function quickAddLog() {
  const name = document.getElementById("quickFoodName").value.trim() || translate("whatDidYouEat");
  const calories = parseFloat(document.getElementById("quickCalories").value);
  if (!calories || calories <= 0) return;
  await apiFetch("/api/log", "POST", { tg_id: tgId, food_name: name, calories });
  document.getElementById("quickFoodName").value = "";
  document.getElementById("quickCalories").value = "";
  closeAddModal();
  await loadTodayLogs();
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
  label.setAttribute("data-i18n", type === "per100g" ? "per100gLabel" : "unitKcal");
  label.textContent = translate(type === "per100g" ? "per100gLabel" : "unitKcal");

  const btn = document.getElementById("foods-cta-btn");
  const btnLabel = document.getElementById("foods-cta-label");
  if (isBuilder) {
    btn.onclick = saveBuilderDish;
    btnLabel.removeAttribute("data-i18n");
    btnLabel.textContent = translate("builderSave");
  } else {
    btn.onclick = addNewFood;
    btnLabel.setAttribute("data-i18n", "addFoodToBase");
    btnLabel.textContent = translate("addFoodToBase");
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
    row.onclick = () => { addBuilderIngredient(ing.name, ing.kcal, false); document.getElementById("builderSearch").value = ""; box.innerHTML = ""; };
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

  const wrap = document.createElement("div");
  wrap.className = "builder-custom-form grouped-card";
  wrap.innerHTML = `
    <div class="form-row labeled">
      <span class="row-label" style="max-width:50%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${name}</span>
      <div class="input-suffix-wrap" style="flex:1">
        <input id="builderCustomKcal" type="number" placeholder="${kcalLabel}" style="text-align:right;padding-right:3.5rem">
        <span class="input-suffix">kcal</span>
      </div>
    </div>`;

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
  addBuilderIngredient(name, kcal, true);
  document.getElementById("builderSuggestions").innerHTML = "";
}

function addBuilderIngredient(name, kcalPer100g, isCustom) {
  builderIngredients.push({ name, kcalPer100g, grams: 0, isCustom });
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
  const totalKcal = builderIngredients.reduce((s, i) => s + i.kcalPer100g * i.grams / 100, 0);
  const totalEl = document.getElementById("builderTotal");
  if (totalEl) totalEl.textContent = `${Math.round(totalKcal)} ${translate("unitKcal")}`;
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
    row.innerHTML = `
      <span class="builder-ing-name">${displayName}</span>
      <span class="builder-ing-meta">${ing.kcalPer100g} ${kcal}/100g</span>
      <input class="builder-ing-weight" type="number" value="${ing.grams || ""}" placeholder="g"
        oninput="updateBuilderGrams(${idx}, this.value)">
      <span class="builder-ing-meta" id="ing-total-${idx}">${rowKcal > 0 ? rowKcal + " " + kcal : ""}</span>
      <button onclick="removeBuilderIngredient(${idx})" class="btn-delete" aria-label="delete">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>`;
    container.appendChild(row);
  });

  const totalKcal = builderIngredients.reduce((s, i) => s + i.kcalPer100g * i.grams / 100, 0);
  const totalRow = document.createElement("div");
  totalRow.className = "builder-total-row";
  totalRow.innerHTML = `<span>${translate("builderTotal")}</span><span id="builderTotal">${Math.round(totalKcal)} ${kcal}</span>`;
  container.appendChild(totalRow);

  document.getElementById("builderWeightRow").style.display = "flex";
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
    const msg = translate("fillFields");
    if (tg) tg.showAlert(msg); else alert(msg);
    return;
  }
  const totalKcal = builderIngredients.reduce((s, i) => s + i.kcalPer100g * i.grams / 100, 0);
  const kcalPer100g = Math.round(totalKcal / dishWeight * 100);
  await apiFetch("/api/foods", "POST", { tg_id: tgId, name, calories: kcalPer100g, per100g: true });
  resetBuilder();
  await loadFoods();
  const msg = translate("dishAdded");
  if (tg) tg.showAlert(msg); else alert(msg);
}

async function loadFoods() {
  const data = await apiFetch(`/api/foods/${tgId}`);
  if (!data) return;
  foods = data;
  renderFoods();
}

function renderFoods() {
  const container = document.getElementById("foodsList");
  container.innerHTML = "";
  const kcal = translate("unitKcal");
  const per100 = translate("per100gLabel");
  foods.forEach(food => {
    const calLabel = food.per100g
      ? `${Math.round(food.calories)} ${kcal}/${per100}`
      : `${Math.round(food.calories)} ${kcal}`;
    const badge = food.per100g
      ? `<span class="badge">${translate("foodTypePer100g")}</span>`
      : "";
    const div = document.createElement("div");
    div.className = "list-row";
    div.innerHTML = `
      <div style="flex:1;min-width:0;">
        <div class="list-row-name" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${food.name}${badge}</div>
        <div class="list-row-cal">${calLabel}</div>
      </div>
      <button onclick="deleteFood(${food.id})" class="btn-delete" aria-label="delete">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
      </button>
    `;
    container.appendChild(div);
  });
}

async function addNewFood() {
  const name = document.getElementById("newFoodName").value.trim();
  const calories = parseFloat(document.getElementById("newFoodCalories").value);
  if (!name || !calories || calories <= 0) {
    alert(translate("fillFields"));
    return;
  }
  await apiFetch("/api/foods", "POST", { tg_id: tgId, name, calories, per100g: newFoodType === "per100g" });
  document.getElementById("newFoodName").value = "";
  document.getElementById("newFoodCalories").value = "";
  await loadFoods();
  const msg = translate("dishAdded");
  if (tg) tg.showAlert(msg); else alert(msg);
}

async function deleteFood(id) {
  const msg = translate("deleteConfirmFood");
  if (tg ? await new Promise(r => tg.showConfirm(msg, r)) : confirm(msg)) {
    await apiFetch(`/api/foods/${id}`, "DELETE");
    await loadFoods();
  }
}

// ── History / Calendar ────────────────────────────────────────────

let historyData = {};
let calOffset = 0;

async function loadHistory() {
  const data = await apiFetch(`/api/history/${tgId}`);
  if (!data) return;
  historyData = data;
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

  const data = await apiFetch(`/api/logs/day/${tgId}/${dateStr}`);
  if (!data) { detail.classList.add("hidden"); return; }

  const kcal = translate("unitKcal");
  const [y, m, d] = dateStr.split("-").map(Number);
  const months = translations[currentLang]?.months || translations.ru.months;
  document.getElementById("dayDetailDate").textContent = `${d} ${months[m - 1]} ${y}`;
  document.getElementById("dayDetailTotal").textContent = `${Math.round(data.total)} ${kcal}`;

  logsContainer.innerHTML = "";
  if (!data.logs.length) {
    logsContainer.innerHTML = `<p class="empty-hint">${translate("noLogsForDay")}</p>`;
    return;
  }
  data.logs.forEach(log => {
    const row = document.createElement("div");
    row.className = "day-log-row";
    row.innerHTML = `<span>${log.food_name}</span><span class="day-log-cal">${Math.round(log.calories)} ${kcal}</span>`;
    logsContainer.appendChild(row);
  });
}

function toISODate(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

// ── Init ──────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();                    // ← 32px button + new clean SVGs
  renderLanguageDropdown();
  renderAllTexts();
  updateLanguageButton();
  updateUnitUI();
  toggleGoalPercent();

  await loadProfile();
  await Promise.all([loadFoods(), loadTodayLogs(), loadHistory()]);

  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-content").forEach(c => c.classList.add("hidden"));
      document.getElementById(btn.dataset.tab).classList.remove("hidden");
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (btn.dataset.tab === "tab-history") {
        calOffset = 0;
        loadHistory().then(() => {
          const todayStr = toISODate(new Date());
          const todayCell = document.querySelector(`.cal-day[data-date="${todayStr}"]`);
          if (todayCell) selectDay(todayStr, todayCell);
        });
      }
    });
  });

  document.addEventListener("click", e => {
    const wrapper = document.querySelector(".lang-wrapper");
    if (wrapper && !wrapper.contains(e.target)) {
      document.getElementById("lang-dropdown").classList.remove("open");
    }
  });
});