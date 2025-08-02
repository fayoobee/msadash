// Collapsible Sections
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

// Night Mode Toggle
document.getElementById("toggle-mode").addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  document.getElementById("logo").src = document.body.classList.contains("night-mode")
    ? "msa_logo_white.png"
    : "msa_logo.png";
});

// CSV Helper
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

// === Load TASKS + Group by Cycle ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=31970795&single=true&output=csv", rows => {
  const container = document.getElementById("task-container");
  const headers = rows[0].map(h => h.toLowerCase());
  const idx = key => headers.indexOf(key);

  const tasksByCycle = {};
  rows.slice(1).forEach(row => {
    const cycle = row[idx("cycle")] || "Other";
    if (!tasksByCycle[cycle]) tasksByCycle[cycle] = [];
    tasksByCycle[cycle].push({
      task: row[idx("task name")],
      assignedTo: row[idx("assigned to")],
      due: row[idx("due date")],
      progress: row[idx("progress")],
      details: row[idx("details")],
      priority: row[idx("priority")]
    });
  });

  container.innerHTML = "";
  for (const cycle in tasksByCycle) {
    const section = document.createElement("div");
    section.innerHTML = `<h4>${cycle}</h4>`;
    tasksByCycle[cycle].forEach(task => {
      const priorityClass = {
        High: "priority-high",
        Medium: "priority-medium",
        Low: "priority-low"
      }[task.priority] || "";

      section.innerHTML += `
        <div class="task-card">
          <strong>${task.task}</strong><br>
          Assigned to: ${task.assignedTo}<br>
          Due: ${task.due}<br>
          Progress: ${task.progress}<br>
          <em>${task.details}</em><br>
          <span class="priority ${priorityClass}">${task.priority}</span>
        </div>
      `;
    });
    container.appendChild(section);
  }

 // === Render Calendar ===
const calendarEl = document.getElementById("calendar");
if (calendarEl) {
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto',
    contentHeight: 600, // Ensures space
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listWeek'
    },
    events: Object.values(tasksByCycle).flat().map(task => ({
      title: `${task.task} (${task.assignedTo})`,
      start: new Date(task.due),
      description: task.details
    })),
    eventColor: "#0077b6",
    eventTextColor: "#fff"
  });
  calendar.render();
}

// === Load COUNTDOWNS ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=234415343&single=true&output=csv", rows => {
  const container = document.getElementById("countdowns");
  container.innerHTML = "";
  rows.slice(1).forEach(([event, date]) => {
    const daysLeft = Math.ceil((new Date(date) - new Date()) / (1000 * 60 * 60 * 24));
    const emoji = "📆";
    const div = document.createElement("div");
    div.innerHTML = `${emoji} ${event}: ${daysLeft} day(s) remaining`;
    container.appendChild(div);
  });
});

// === Load TEAM ROLES ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=553348135&single=true&output=csv", rows => {
  const container = document.getElementById("team-roles");
  container.innerHTML = "";
  rows.slice(1).forEach(([name, role]) => {
    const icon = "👤";
    const div = document.createElement("div");
    div.innerHTML = `${icon} <strong>${name}</strong>: ${role}`;
    container.appendChild(div);
  });
});
