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

// ── Theme ─────────────────────────────────────────────────────────

function initTheme() {
  // If running inside Telegram, respect its color scheme; otherwise use saved or default dark.
  let theme = localStorage.getItem("theme");
  if (!theme) {
    theme = (tg && tg.colorScheme === "light") ? "light" : "dark";
  }
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  document.getElementById("theme-btn").textContent = theme === "dark" ? "🌙" : "☀️";
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

async function loadProfile() {
  try {
    const data = await apiFetch(`/api/profile/${tgId}`);
    if (!data) return;
    dailyNorm = data.daily_norm || 2000;
    currentUnits = data.units || "metric";

    if (data.height) document.getElementById("height").value = convertHeight(data.height, "metric", currentUnits);
    if (data.weight) document.getElementById("weight").value = convertWeight(data.weight, "metric", currentUnits);
    if (data.gender) document.getElementById("gender").value = data.gender;
    if (data.age)    document.getElementById("age").value = data.age;
    if (data.activity) document.getElementById("activity").value = data.activity;
    if (data.goal_type) {
      document.getElementById("goalType").value = data.goal_type;
      if (data.goal_percent) document.getElementById("goalPercent").value = data.goal_percent;
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
  document.getElementById("goal-percent-row").style.display = goalType === "maintain" ? "none" : "block";
}

async function saveProfile() {
  const heightMetric = convertHeight(parseFloat(document.getElementById("height").value) || 0, currentUnits, "metric");
  const weightMetric = convertWeight(parseFloat(document.getElementById("weight").value) || 0, currentUnits, "metric");
  const goalType = document.getElementById("goalType").value;
  const data = {
    tg_id: tgId,
    gender: document.getElementById("gender").value,
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
  const percent = Math.min((totalToday / dailyNorm) * 100, 100);
  document.getElementById("progressBar").style.width = percent + "%";
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
      <button onclick="deleteLog(${log.id})" class="btn-delete">✕</button>
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
  // hide add button on fixed tab (tap-to-add); show for quick and per100g
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

function setFoodType(type) {
  newFoodType = type;
  document.getElementById("food-type-fixed").classList.toggle("active", type === "fixed");
  document.getElementById("food-type-per100g").classList.toggle("active", type === "per100g");
  const label = document.getElementById("cal-unit-label");
  label.setAttribute("data-i18n", type === "per100g" ? "per100gLabel" : "unitKcal");
  label.textContent = translate(type === "per100g" ? "per100gLabel" : "unitKcal");
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
      <button onclick="deleteFood(${food.id})" class="btn-delete">🗑</button>
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

// historyData: { "YYYY-MM-DD": totalKcal, ... } — populated once on load
let historyData = {};
// calOffset: months back from current month (0 = this month, -1 = prev, etc.)
// We keep it ≥ 0 so the user can go back but not forward past today's month.
let calOffset = 0;

async function loadHistory() {
  const data = await apiFetch(`/api/history/${tgId}`);
  if (!data) return;
  historyData = data;
  renderCalendar();
}

function renderCalendar() {
  const today = new Date();
  // target month = today minus calOffset months
  const target = new Date(today.getFullYear(), today.getMonth() - calOffset, 1);
  const year  = target.getFullYear();
  const month = target.getMonth(); // 0-based

  // update month label
  const months = translations[currentLang]?.months || translations.ru.months;
  document.getElementById("calMonthLabel").textContent = `${months[month]} ${year}`;

  // disable forward nav when already at current month
  document.querySelector(".cal-nav:last-child").disabled = calOffset === 0;

  // day-of-week header (Monday-first)
  const dow = translations[currentLang]?.dow || translations.ru.dow;
  const dowRow = document.getElementById("calDowRow");
  dowRow.innerHTML = "";
  dow.forEach(d => {
    const cell = document.createElement("div");
    cell.className = "cal-dow";
    cell.textContent = d;
    dowRow.appendChild(cell);
  });

  // build grid
  const grid = document.getElementById("calGrid");
  grid.innerHTML = "";

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // JS getDay(): 0=Sun,1=Mon...6=Sat  →  convert to Mon-first (0=Mon...6=Sun)
  let startDow = new Date(year, month, 1).getDay();
  startDow = (startDow + 6) % 7; // Mon-first offset

  // 30-day window boundary
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() - 29);
  cutoff.setHours(0, 0, 0, 0);

  // empty leading cells
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
      const pct  = dailyNorm > 0 ? kcal / dailyNorm : 0;

      let fillClass = "";
      if (kcal > 0) {
        if (pct >= 1.0)       fillClass = "fill-over";
        else if (pct >= 0.75) fillClass = "fill-high";
        else if (pct >= 0.4)  fillClass = "fill-mid";
        else                  fillClass = "fill-low";
      }

      cell.className = `cal-day has-data ${fillClass}`;
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
  // dir: -1 = go back, +1 = go forward
  const newOffset = calOffset - dir; // -1 means go back → offset increases
  if (newOffset < 0) return; // can't go into the future
  calOffset = newOffset;
  // clear selected state when navigating
  document.getElementById("dayDetail").classList.add("hidden");
  document.querySelectorAll(".cal-day.selected").forEach(el => el.classList.remove("selected"));
  renderCalendar();
}

async function selectDay(dateStr, cellEl) {
  // toggle selected visual
  document.querySelectorAll(".cal-day.selected").forEach(el => el.classList.remove("selected"));
  cellEl.classList.add("selected");

  const detail = document.getElementById("dayDetail");
  const logsContainer = document.getElementById("dayDetailLogs");
  detail.classList.remove("hidden");
  logsContainer.innerHTML = `<p class="empty-hint">…</p>`;

  const data = await apiFetch(`/api/logs/day/${tgId}/${dateStr}`);
  if (!data) { detail.classList.add("hidden"); return; }

  const kcal = translate("unitKcal");
  // format date for display
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
  initTheme();
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
        loadTodayLogs();
        loadHistory();
      }
    });
  });

  // close language dropdown on outside click
  document.addEventListener("click", e => {
    const wrapper = document.querySelector(".lang-wrapper");
    if (wrapper && !wrapper.contains(e.target)) {
      document.getElementById("lang-dropdown").classList.remove("open");
    }
  });
});
