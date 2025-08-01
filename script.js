// Toggle collapsible sections
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

// Toggle night mode + switch logo
document.getElementById("toggle-mode").addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  const logo = document.getElementById("logo");
  logo.src = document.body.classList.contains("night-mode")
    ? "msa_logo_white.png"
    : "msa_logo.png";
});

// Helper to fetch and parse CSV rows
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

// === Load TASKS grouped by cycle ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=31970795&single=true&output=csv", rows => {
  const container = document.getElementById("task-container");
  container.innerHTML = "";
  const headers = rows[0].map(h => h.trim().toLowerCase());

  const indices = {
    task: headers.indexOf("task name"),
    assignedTo: headers.indexOf("assigned to"),
    due: headers.indexOf("due date"),
    progress: headers.indexOf("progress"),
    dept: headers.indexOf("department"),
    details: headers.indexOf("details"),
    category: headers.indexOf("category"),
    priority: headers.indexOf("priority"),
    cycle: headers.indexOf("cycle")
  };

  const tasksByCycle = {};

  rows.slice(1).forEach(row => {
    const cycle = row[indices.cycle] || "Cycle: Unassigned";
    if (!tasksByCycle[cycle]) tasksByCycle[cycle] = [];
    tasksByCycle[cycle].push({
      task: row[indices.task],
      assignedTo: row[indices.assignedTo],
      due: row[indices.due],
      progress: row[indices.progress],
      dept: row[indices.dept],
      details: row[indices.details],
      category: row[indices.category],
      priority: row[indices.priority]
    });
  });

  for (const cycle in tasksByCycle) {
    const section = document.createElement("div");
    section.innerHTML = `<h4>${cycle}</h4>`;
    tasksByCycle[cycle].forEach(task => {
      section.innerHTML += `
        <div class="task-card">
          <strong>${task.task}</strong><br>
          <em>Category:</em> ${task.category} | <em>Priority:</em> ${task.priority}<br>
          <strong>Department:</strong> ${task.dept}<br>
          Assigned to: ${task.assignedTo}<br>
          Due: ${task.due}<br>
          Progress: ${task.progress}<br>
          <em>Details:</em> ${task.details}
        </div>
      `;
    });
    container.appendChild(section);
  }
});

// === Load COUNTDOWNS ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=234415343&single=true&output=csv", rows => {
  const container = document.getElementById("countdowns");
  container.innerHTML = "";
  rows.slice(1).forEach(([event, dateStr]) => {
    const daysLeft = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    const div = document.createElement("div");
    div.textContent = `📌 ${event}: ${daysLeft} day(s) remaining`;
    container.appendChild(div);
  });
});

// === Load TEAM ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=553348135&single=true&output=csv", rows => {
  const container = document.getElementById("team-roles");
  container.innerHTML = "";
  rows.slice(1).forEach(([name, role]) => {
    const div = document.createElement("div");
    div.innerHTML = `👤 <strong>${name}</strong>: ${role}`;
    container.appendChild(div);
  });
});
