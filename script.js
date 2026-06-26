// ============================================================
// API Data Dashboard
// Kisi bhi REST API se live data laata hai aur dashboard mein dikhata hai.
// Yahan demo ke liye free public API use ki hai (JSONPlaceholder).
// Apni API use karne ke liye bas API_URL badal do.
// ============================================================

const API_URL = "https://jsonplaceholder.typicode.com/users";

let allData = [];  // saara data yahan store hoga

// Page load hote hi data fetch karo
document.addEventListener("DOMContentLoaded", fetchData);

async function fetchData() {
  const status = document.getElementById("status");
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("API request failed");
    allData = await res.json();

    status.textContent = "● Live";
    status.style.background = "rgba(34,197,94,0.4)";

    renderCards(allData);
    renderChart(allData);
    renderTable(allData);
  } catch (err) {
    status.textContent = "⚠ Error loading data";
    console.error(err);
  }
}

// Stat cards banao
function renderCards(data) {
  const cards = document.getElementById("cards");
  const totalUsers = data.length;
  const totalCompanies = new Set(data.map(u => u.company?.name)).size;
  const totalCities = new Set(data.map(u => u.address?.city)).size;

  cards.innerHTML = `
    <div class="card"><div class="num">${totalUsers}</div><div class="label">Total Records</div></div>
    <div class="card"><div class="num">${totalCompanies}</div><div class="label">Companies</div></div>
    <div class="card"><div class="num">${totalCities}</div><div class="label">Cities</div></div>
  `;
}

// Chart banao (har company ke users count)
let chartInstance = null;
function renderChart(data) {
  const ctx = document.getElementById("dataChart").getContext("2d");
  const labels = data.map(u => u.name);
  const values = data.map(u => (u.name ? u.name.length : 0)); // demo metric

  if (chartInstance) chartInstance.destroy();
  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Name Length (demo metric)",
        data: values,
        backgroundColor: "#4F46E5",
        borderRadius: 6,
      }],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true } },
    },
  });
}

// Table banao
function renderTable(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = data.map(u => `
    <tr>
      <td>${u.id}</td>
      <td>${u.name || "-"}</td>
      <td>${u.email || "-"}</td>
      <td>${u.company?.name || "-"}</td>
      <td>${u.address?.city || "-"}</td>
    </tr>
  `).join("");
}

// Live search / filter
document.getElementById("search").addEventListener("input", (e) => {
  const term = e.target.value.toLowerCase();
  const filtered = allData.filter(u =>
    (u.name || "").toLowerCase().includes(term) ||
    (u.email || "").toLowerCase().includes(term) ||
    (u.company?.name || "").toLowerCase().includes(term) ||
    (u.address?.city || "").toLowerCase().includes(term)
  );
  renderTable(filtered);
});
