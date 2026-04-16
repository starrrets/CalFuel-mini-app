let tg = null;
if (window.Telegram && window.Telegram.WebApp) {
  tg = window.Telegram.WebApp;
  tg.ready();
  tg.expand();
}

const tgId = tg ? (tg.initDataUnsafe?.user?.id || 123456789) : 123456789;
const API_URL = "https://ВАШ_RAILWAY_URL.up.railway.app";

let dailyNorm = 2000;
let totalToday = 0;
let foods = [];
let logs = [];
let currentUnits = "metric";

/**
 * Convert height between metric and imperial
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 * @returns {number}
 */
function convertHeight(value, fromUnit, toUnit) {
  if (fromUnit === toUnit || !value) return value;
  return fromUnit === "metric" 
    ? Math.round(value * 0.393701) 
    : Math.round(value / 0.393701);
}

/**
 * Convert weight between metric and imperial
 * @param {number} value
 * @param {string} fromUnit
 * @param {string} toUnit
 * @returns {number}
 */
function convertWeight(value, fromUnit, toUnit) {
  if (fromUnit === toUnit || !value) return value;
  return fromUnit === "metric" 
    ? Math.round(value * 2.20462 * 10) / 10 
    : Math.round(value / 2.20462 * 10) / 10;
}

/**
 * Loads user profile and daily calorie norm
 */
async function loadProfile() {
  if (!tg) return;
  try {
    const data = await apiFetch(`/api/profile/${tgId}`);
    dailyNorm = data.daily_norm || 2000;
    currentUnits = data.units || "metric";

    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");

    if (data.height) heightInput.value = convertHeight(data.height, "metric", currentUnits);
    if (data.weight) weightInput.value = convertWeight(data.weight, "metric", currentUnits);

    document.getElementById("dailyNorm").textContent = Math.round(dailyNorm);
    updateProgress();
    updateUnitUI();
    toggleGoalPercent();   // скрываем/показываем процент при загрузке
  } catch(e) {}
}

/**
 * Updates unit labels, placeholders and button states
 */
function updateUnitUI() {
  const isMetric = currentUnits === "metric";

  document.getElementById("unit-metric").classList.toggle("active", isMetric);
  document.getElementById("unit-imperial").classList.toggle("active", !isMetric);

  document.getElementById("height-label").textContent = translate(isMetric ? "heightMetric" : "heightImperial");
  document.getElementById("weight-label").textContent = translate(isMetric ? "weightMetric" : "weightImperial");

  const heightInput = document.getElementById("height");
  const weightInput = document.getElementById("weight");
  heightInput.placeholder = translate(isMetric ? "heightMetric" : "heightImperial");
  weightInput.placeholder = translate(isMetric ? "weightMetric" : "weightImperial");
}

/**
 * Sets unit system and converts current values
 * @param {"metric"|"imperial"} unit
 */
function setUnits(unit) {
  if (currentUnits === unit) return;

  const heightInput = document.getElementById("height");
  const weightInput = document.getElementById("weight");

  const h = parseFloat(heightInput.value);
  const w = parseFloat(weightInput.value);

  if (!isNaN(h)) heightInput.value = convertHeight(h, currentUnits, unit);
  if (!isNaN(w)) weightInput.value = convertWeight(w, currentUnits, unit);

  currentUnits = unit;
  updateUnitUI();
}

/**
 * Shows or hides the goal percent field depending on goal type
 */
function toggleGoalPercent() {
  const goalType = document.getElementById("goalType").value;
  const percentRow = document.getElementById("goal-percent-row");
  percentRow.style.display = (goalType === "maintain") ? "none" : "block";
}

/**
 * Loads list of user's custom foods
 */
async function loadFoods() {
  if (!tg) return;
  const data = await apiFetch(`/api/foods/${tgId}`);
  foods = data;
  renderFoods();
}

/**
 * Loads today's food logs
 */
async function loadTodayLogs() {
  if (!tg) return;
  const data = await apiFetch(`/api/logs/today/${tgId}`);
  logs = data.logs;
  totalToday = data.total_today || 0;
  document.getElementById("totalToday").textContent = Math.round(totalToday);
  renderLogs();
  updateProgress();
}

/**
 * Loads history of calories by day
 */
async function loadHistory() {
  if (!tg) return;
  const data = await apiFetch(`/api/history/${tgId}`);
  const container = document.getElementById("historyContainer");
  container.innerHTML = "";
  Object.keys(data).sort().reverse().forEach(date => {
    const div = document.createElement("div");
    div.className = "flex justify-between bg-zinc-900 p-3 rounded-2xl mb-2";
    div.innerHTML = `<span>${date}</span><span class="font-bold">${Math.round(data[date])} ккал</span>`;
    container.appendChild(div);
  });
}

/**
 * Updates progress bar and remaining calories
 */
function updateProgress() {
  const percent = Math.min((totalToday / dailyNorm) * 100, 100);
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("remaining").textContent = Math.max(0, Math.round(dailyNorm - totalToday)) + " ккал";
}

/**
 * Renders today's food logs
 */
function renderLogs() {
  const container = document.getElementById("todayLogs");
  container.innerHTML = "";
  logs.forEach(log => {
    const div = document.createElement("div");
    div.className = "flex justify-between items-center bg-zinc-900 p-4 rounded-3xl mb-3";
    div.innerHTML = `
      <div>
        <div class="font-medium">${log.food_name}</div>
        <div class="text-sm text-zinc-400">${log.calories} ккал</div>
      </div>
      <button onclick="deleteLog(${log.id});" class="text-red-500 text-xl">✕</button>
    `;
    container.appendChild(div);
  });
}

/**
 * Renders user's custom foods list
 */
function renderFoods() {
  const container = document.getElementById("foodsList");
  container.innerHTML = "";
  foods.forEach(food => {
    const div = document.createElement("div");
    div.className = "flex justify-between bg-zinc-900 p-4 rounded-3xl mb-3";
    div.innerHTML = `
      <div class="flex-1">
        <div onclick="addLogFromFood('${food.name}', ${food.calories})" class="cursor-pointer font-medium">${food.name}</div>
        <div class="text-sm text-emerald-400">${food.calories} ккал</div>
      </div>
      <button onclick="deleteFood(${food.id});" class="text-red-500">🗑</button>
    `;
    container.appendChild(div);
  });
}

/**
 * Adds a food from database to today's log
 * @param {string} name
 * @param {number} calories
 */
async function addLogFromFood(name, calories) {
  if (!tg) return;
  await apiFetch("/api/log", "POST", { tg_id: tgId, food_name: name, calories });
  loadTodayLogs();
  if (tg) tg.showAlert(translate('addedTemplate').replace('{name}', name).replace('{calories}', calories));
}

/**
 * Deletes a log entry
 * @param {number} id
 */
async function deleteLog(id) {
  if (!tg) return;
  if (confirm(translate('deleteConfirmLog'))) {
    await apiFetch(`/api/log/${id}`, "DELETE");
    loadTodayLogs();
  }
}

/**
 * Deletes a food from user's database
 * @param {number} id
 */
async function deleteFood(id) {
  if (!tg) return;
  if (confirm(translate('deleteConfirmFood'))) {
    await apiFetch(`/api/foods/${id}`, "DELETE");
    loadFoods();
  }
}

/**
 * Saves profile and recalculates daily norm
 */
async function saveProfile() {
  if (!tg) return;
  const heightMetric = convertHeight(parseFloat(document.getElementById("height").value) || 0, currentUnits, "metric");
  const weightMetric = convertWeight(parseFloat(document.getElementById("weight").value) || 0, currentUnits, "metric");
  const data = {
    tg_id: tgId,
    gender: document.getElementById("gender").value,
    age: document.getElementById("age").value,
    height: heightMetric,
    weight: weightMetric,
    activity: parseFloat(document.getElementById("activity").value),
    goal_type: document.getElementById("goalType").value,
    goal_percent: document.getElementById("goalType").value === "maintain" ? 0 : parseFloat(document.getElementById("goalPercent").value) || 0,
    units: currentUnits
  };
  await apiFetch("/api/profile", "POST", data);
  if (tg) tg.showAlert(translate('profileSaved'));
  loadProfile();
}

/**
 * Adds a new food to user's database
 */
async function addNewFood() {
  if (!tg) return;
  const name = document.getElementById("newFoodName").value;
  const calories = parseFloat(document.getElementById("newFoodCalories").value);
  if (!name || !calories) {
    alert(translate('fillFields'));
    return;
  }
  await apiFetch("/api/foods", "POST", { tg_id: tgId, name, calories });
  document.getElementById("newFoodName").value = "";
  document.getElementById("newFoodCalories").value = "";
  loadFoods();
  if (tg) tg.showAlert(translate('dishAdded'));
}

/**
 * Quick add of a meal
 */
async function quickAddLog() {
  if (!tg) return;
  const name = document.getElementById("quickFoodName").value;
  const calories = parseFloat(document.getElementById("quickCalories").value);
  if (!name || !calories) return;
  await apiFetch("/api/log", "POST", { tg_id: tgId, food_name: name, calories });
  document.getElementById("addLogModal").classList.add("hidden");
  loadTodayLogs();
  if (tg) tg.showAlert(translate('recordAdded'));
}

document.addEventListener("DOMContentLoaded", async () => {
  renderLanguageDropdown();
  renderAllTexts();
  updateLanguageButton();

  if (tg) {
    await loadProfile();
    await loadFoods();
    await loadTodayLogs();
    await loadHistory();
  } else {
    updateUnitUI();
    toggleGoalPercent();
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      document.getElementById(btn.dataset.tab).classList.remove('hidden');
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
});

window.onload = () => {
  setTimeout(() => {
    renderLanguageDropdown();
    updateLanguageButton();
  }, 100);
};