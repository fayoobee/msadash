
function toggleCollapsibles() {
  document.querySelectorAll(".collapsible").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const content = btn.nextElementSibling;
      content.style.display = content.style.display === "block" ? "none" : "block";
    });
  });
}
toggleCollapsibles();

document.getElementById("toggle-mode").addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  const logo = document.getElementById("logo");
  logo.src = document.body.classList.contains("night-mode") ? "msa_logo_white.png" : "msa_logo.png";
});

function loadCSV(url, callback) {
  fetch(url)
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").map(r => r.split(","));
      callback(rows);
    });
}

// Load tasks
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vRlIhPrQcMZgTxrn8iNI5tVgLhpdph4w_bQshFWV3s5ui5LD2JYu2N9ix9_wBdcf3MxPcaHf56vDFzI/pub?gid=887791163&single=true&output=csv", rows => {
  const container = document.getElementById("task-container");
  const headers = rows[0];
  const departmentIndex = headers.indexOf("Department");
  const tasksByDept = {};

  rows.slice(1).forEach(row => {
    const dept = row[departmentIndex];
    if (!tasksByDept[dept]) tasksByDept[dept] = [];
    tasksByDept[dept].push(row);
  });

  for (const dept in tasksByDept) {
    const section = document.createElement("div");
    section.innerHTML = `<h4>${dept}</h4>`;
    tasksByDept[dept].forEach(task => {
      section.innerHTML += `<div><strong>${task[0]}</strong><br>Assigned to: ${task[1]}<br>Due: ${task[2]}<br>Progress: ${task[3]}</div>`;
    });
    container.appendChild(section);
  }
});

// Load countdowns
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vRlIhPrQcMZgTxrn8iNI5tVgLhpdph4w_bQshFWV3s5ui5LD2JYu2N9ix9_wBdcf3MxPcaHf56vDFzI/pub?gid=1268651007&single=true&output=csv", rows => {
  const container = document.getElementById("countdowns");
  container.innerHTML = "";
  rows.slice(1).forEach(row => {
    const [event, date] = row;
    const countdown = document.createElement("div");
    const remaining = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    countdown.textContent = `${event}: ${remaining} day(s) remaining`;
    container.appendChild(countdown);
  });
});

// Load team roles
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vRlIhPrQcMZgTxrn8iNI5tVgLhpdph4w_bQshFWV3s5ui5LD2JYu2N9ix9_wBdcf3MxPcaHf56vDFzI/pub?gid=1103280760&single=true&output=csv", rows => {
  const container = document.getElementById("team-roles");
  container.innerHTML = "";
  rows.slice(1).forEach(row => {
    const [name, role] = row;
    const div = document.createElement("div");
    div.innerHTML = `<strong>${name}</strong>: ${role}`;
    container.appendChild(div);
  });
});
