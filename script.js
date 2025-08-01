// Collapsibles
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

// Night Mode
document.getElementById("toggle-mode").addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  const logo = document.getElementById("logo");
  logo.src = document.body.classList.contains("night-mode")
    ? "msa_logo_white.png"
    : "msa_logo.png";
});

// CSV Loader
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
          } else if (char === "," && !insideQuotes) {
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

// === TASKS ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=31970795&single=true&output=csv", rows => {
  const container = document.getElementById("task-container");
  container.innerHTML = "";
  const headers = rows[0].map(h => h.trim().toLowerCase());

  const idx = name => headers.indexOf(name.toLowerCase());
  const deptIdx = idx("department");

  const tasksByDept = {};

  rows.slice(1).forEach(row => {
    const dept = row[deptIdx] || "Other";
    if (!tasksByDept[dept]) tasksByDept[dept] = [];
    tasksByDept[dept].push({
      task: row[idx("task name")] || "",
      assignedTo: row[idx("assigned to")] || "",
      due: row[idx("due date")] || "",
      progress: row[idx("progress")] || "",
      details: row[idx("details")] || "",
      category: row[idx("category")] || "",
      priority: row[idx("priority")] || "Low",
      cycle: row[idx("cycle")] || "Unassigned"
    });
  });

  for (const dept in tasksByDept) {
    const section = document.createElement("div");
    section.innerHTML = `<h4>${dept}</h4>`;
    tasksByDept[dept].forEach(task => {
      const priorityClass = {
        "High": "priority-high",
        "Medium": "priority-medium",
        "Low": "priority-low"
      }[task.priority] || "priority-low";

      section.innerHTML += `
        <div class="task-card">
          <strong>${task.task}</strong><br>
          <em>Category:</em> ${task.category}<br>
          Assigned to: ${task.assignedTo}<br>
          Due: ${task.due}<br>
          Progress: ${task.progress}<br>
          Cycle: ${task.cycle}<br>
          <em>Details:</em> ${task.details}<br>
          <span class="${priorityClass}">Priority: ${task.priority}</span>
        </div>
      `;
    });
    container.appendChild(section);
  }
});

// === COUNTDOWNS ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=234415343&single=true&output=csv", rows => {
  const container = document.getElementById("countdowns");
  container.innerHTML = "";
  rows.slice(1).forEach(([event, dateStr]) => {
    const daysLeft = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    const div = document.createElement("div");
    div.textContent = `${event}: ${daysLeft} day(s) remaining`;
    container.appendChild(div);
  });
});

// === TEAM ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=553348135&single=true&output=csv", rows => {
  const container = document.getElementById("team-roles");
  container.innerHTML = "";
  rows.slice(1).forEach(([name, role]) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${name}</strong>: ${role}`;
    container.appendChild(div);
  });
});

