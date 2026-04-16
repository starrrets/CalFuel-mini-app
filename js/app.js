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

async function apiFetch(endpoint, method = "GET", body = null) {
  const options = { method, headers: { "Content-Type": "application/json" } };
  if (body) options.body = JSON.stringify(body);
  const res = await fetch(API_URL + endpoint, options);
  if (!res.ok) throw new Error("Ошибка API");
  return res.json();
}

async function loadProfile() {
  try {
    const data = await apiFetch(`/api/profile/${tgId}`);
    dailyNorm = data.daily_norm || 2000;
    document.getElementById("dailyNorm").textContent = Math.round(dailyNorm);
    updateProgress();
  } catch(e) {}
}

async function loadFoods() {
  const data = await apiFetch(`/api/foods/${tgId}`);
  foods = data;
  renderFoods();
}

async function loadTodayLogs() {
  const data = await apiFetch(`/api/logs/today/${tgId}`);
  logs = data.logs;
  totalToday = data.total_today || 0;
  document.getElementById("totalToday").textContent = Math.round(totalToday);
  renderLogs();
  updateProgress();
}

async function loadHistory() {
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

function updateProgress() {
  const percent = Math.min((totalToday / dailyNorm) * 100, 100);
  document.getElementById("progressBar").style.width = percent + "%";
  document.getElementById("remaining").textContent = Math.max(0, Math.round(dailyNorm - totalToday)) + " ккал";
}

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

async function addLogFromFood(name, calories) {
  await apiFetch("/api/log", "POST", { tg_id: tgId, food_name: name, calories });
  loadTodayLogs();
  if (tg) tg.showAlert(`Добавлено: ${name} — ${calories} ккал`);
}

async function deleteLog(id) {
  if (confirm("Удалить запись?")) {
    await apiFetch(`/api/log/${id}`, "DELETE");
    loadTodayLogs();
  }
}

async function deleteFood(id) {
  if (confirm("Удалить блюдо?")) {
    await apiFetch(`/api/foods/${id}`, "DELETE");
    loadFoods();
  }
}

async function saveProfile() {
  const data = {
    tg_id: tgId,
    gender: document.getElementById("gender").value,
    age: document.getElementById("age").value,
    height: document.getElementById("height").value,
    weight: document.getElementById("weight").value,
    activity: parseFloat(document.getElementById("activity").value),
    goal_type: document.getElementById("goalType").value,
    goal_percent: parseFloat(document.getElementById("goalPercent").value) || 0
  };
  await apiFetch("/api/profile", "POST", data);
  if (tg) tg.showAlert("Профиль сохранён! Норма пересчитана.");
  loadProfile();
}

async function addNewFood() {
  const name = document.getElementById("newFoodName").value;
  const calories = parseFloat(document.getElementById("newFoodCalories").value);
  if (!name || !calories) return alert("Заполни все поля");
  await apiFetch("/api/foods", "POST", { tg_id: tgId, name, calories });
  document.getElementById("newFoodName").value = "";
  document.getElementById("newFoodCalories").value = "";
  loadFoods();
  if (tg) tg.showAlert("Блюдо добавлено!");
}

async function quickAddLog() {
  const name = document.getElementById("quickFoodName").value;
  const calories = parseFloat(document.getElementById("quickCalories").value);
  if (!name || !calories) return;
  await apiFetch("/api/log", "POST", { tg_id: tgId, food_name: name, calories });
  document.getElementById("addLogModal").classList.add("hidden");
  loadTodayLogs();
  if (tg) tg.showAlert("Запись добавлена!");
}

document.addEventListener("DOMContentLoaded", async () => {
  renderLanguageDropdown();
  renderAllTexts();
  updateLanguageButton();

  await loadProfile();
  await loadFoods();
  await loadTodayLogs();
  await loadHistory();

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