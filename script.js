// Toggle collapsibles
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

// Toggle dark mode and logo
document.getElementById("toggle-mode").addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  const logo = document.getElementById("logo");
  logo.src = document.body.classList.contains("night-mode")
    ? "msa_logo_white.png"
    : "msa_logo.png";
});

// Helper to fetch CSV
function loadCSV(url, callback) {
  fetch(url)
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").map(row => {
        const values = [];
        let insideQuotes = false;
        let cell = '';
        for (let char of row) {
          if (char === '"') {
            insideQuotes = !insideQuotes;
          } else if (char === ',' && !insideQuotes) {
            values.push(cell.trim());
            cell = '';
          } else {
            cell += char;
          }
        }
        values.push(cell.trim());
        return values;
      });
      callback(rows);
    });
}

// === Load the full document CSV ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vRlIhPrQcMZgTxrn8iNI5tVgLhpdph4w_bQshFWV3s5ui5LD2JYu2N9ix9_wBdcf3MxPcaHf56vDFzI/pub?output=csv", rows => {
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const taskNameIdx = headers.indexOf("task name");
  const assignedToIdx = headers.indexOf("assigned to");
  const dueDateIdx = headers.indexOf("due date");
  const progressIdx = headers.indexOf("progress");
  const deptIdx = headers.indexOf("department");
  const typeIdx = headers.indexOf("type");

  const tasksByDept = {};
  const countdowns = [];
  const teamRoles = [];

  rows.slice(1).forEach(row => {
    const type = row[typeIdx]?.toLowerCase();
    if (type === "task") {
      const dept = row[deptIdx] || "Other";
      if (!tasksByDept[dept]) tasksByDept[dept] = [];
      tasksByDept[dept].push({
        task: row[taskNameIdx] || "No Task",
        assignedTo: row[assignedToIdx] || "Unassigned",
        due: row[dueDateIdx] || "No Due Date",
        progress: row[progressIdx] || "Not started"
      });
    } else if (type === "countdown") {
      countdowns.push({ event: row[taskNameIdx], date: row[dueDateIdx] });
    } else if (type === "team") {
      teamRoles.push({ name: row[taskNameIdx], role: row[assignedToIdx] });
    }
  });

  // Render tasks
  const taskContainer = document.getElementById("task-container");
  taskContainer.innerHTML = "";
  for (const dept in tasksByDept) {
    const section = document.createElement("div");
    section.innerHTML = `<h4>${dept}</h4>`;
    tasksByDept[dept].forEach(task => {
      section.innerHTML += `
        <div class="task-card">
          <strong>${task.task}</strong><br>
          Assigned to: ${task.assignedTo}<br>
          Due: ${task.due}<br>
          Progress: ${task.progress}
        </div>
      `;
    });
    taskContainer.appendChild(section);
  }

  // Render countdowns
  const countdownContainer = document.getElementById("countdowns");
  countdownContainer.innerHTML = "";
  countdowns.forEach(c => {
    const daysLeft = Math.ceil((new Date(c.date) - new Date()) / (1000 * 60 * 60 * 24));
    const div = document.createElement("div");
    div.textContent = `${c.event}: ${daysLeft} day(s) remaining`;
    countdownContainer.appendChild(div);
  });

  // Render team roles
  const teamContainer = document.getElementById("team-roles");
  teamContainer.innerHTML = "";
  teamRoles.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${p.name}</strong>: ${p.role}`;
    teamContainer.appendChild(div);
  });
});
