// Wait for DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  toggleCollapsibles();
  setupModeToggle();
  loadTasks();
  loadCountdowns();
  loadTeamRoles();
});

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

// Toggle night mode + switch logo
function setupModeToggle() {
  const toggleButton = document.getElementById("toggle-mode");
  toggleButton.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    const logo = document.getElementById("logo");
    logo.src = document.body.classList.contains("night-mode")
      ? "msa_logo_white.png"
      : "msa_logo.png";
  });
}

// CSV Parser
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
function loadTasks() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=31970795&single=true&output=csv";
  loadCSV(url, rows => {
    const container = document.getElementById("task-container");
    container.innerHTML = "";
    const headers = rows[0].map(h => h.trim().toLowerCase());

    const taskNameIdx = headers.indexOf("task name");
    const assignedToIdx = headers.indexOf("assigned to");
    const dueDateIdx = headers.indexOf("due date");
    const progressIdx = headers.indexOf("progress");
    const deptIdx = headers.indexOf("department");
    const detailsIdx = headers.indexOf("details");
    const priorityIdx = headers.indexOf("priority");
    const cycleIdx = headers.indexOf("cycle");
    const categoryIdx = headers.indexOf("category");

    const tasksByCycle = {};

    rows.slice(1).forEach(row => {
      const cycle = row[cycleIdx] || "Uncategorized Cycle";
      if (!tasksByCycle[cycle]) tasksByCycle[cycle] = [];
      tasksByCycle[cycle].push({
        task: row[taskNameIdx] || "No Task",
        assignedTo: row[assignedToIdx] || "Unassigned",
        due: row[dueDateIdx] || "No Due Date",
        progress: row[progressIdx] || "Not started",
        dept: row[deptIdx] || "General",
        details: row[detailsIdx] || "No details",
        category: row[categoryIdx] || "Uncategorized",
        priority: row[priorityIdx] || "Medium",
        cycle: cycle
      });
    });

    for (const cycle in tasksByCycle) {
      const section = document.createElement("div");
      section.innerHTML = `<h3>${cycle}</h3>`;
      tasksByCycle[cycle].forEach(task => {
        const priorityClass =
          task.priority.toLowerCase() === "high"
            ? "priority-high"
            : task.priority.toLowerCase() === "medium"
            ? "priority-medium"
            : "priority-low";

        section.innerHTML += `
          <div class="task-card">
            <strong>${task.task}</strong><br>
            <em>Category:</em> ${task.category}<br>
            Assigned to: ${task.assignedTo}<br>
            Due: ${task.due}<br>
            Progress: ${task.progress}<br>
            Cycle: ${task.cycle}<br>
            <em>Details:</em> ${task.details}<br>
            <div class="priority-badge ${priorityClass}">Priority: ${task.priority}</div>
          </div>
        `;
      });
      container.appendChild(section);
    }
  });
}

// === Load COUNTDOWNS ===
function loadCountdowns() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=234415343&single=true&output=csv";
  loadCSV(url, rows => {
    const container = document.getElementById("countdowns");
    container.innerHTML = "";
    rows.slice(1).forEach(([event, dateStr]) => {
      const daysLeft = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
      const div = document.createElement("div");
      div.textContent = `${event}: ${daysLeft} day(s) remaining`;
      container.appendChild(div);
    });
  });
}

// === Load TEAM ===
function loadTeamRoles() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=553348135&single=true&output=csv";
  loadCSV(url, rows => {
    const container = document.getElementById("team-roles");
    container.innerHTML = "";
    rows.slice(1).forEach(([name, role]) => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${name}</strong>: ${role}`;
      container.appendChild(div);
    });
  });

  // === Render Calendar Events ===
const calendarEl = document.getElementById("calendar");
if (calendarEl) {
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    height: 'auto',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listWeek'
    },
    events: tasksByDept
      ? Object.values(tasksByDept).flat().map(task => ({
          title: `${task.task} (${task.assignedTo})`,
          start: new Date(task.due),
          description: task.details || '',
        }))
      : [],
    eventColor: "#0077b6",
    eventTextColor: "#ffffff",
    eventDisplay: 'block',
    eventDidMount: function(info) {
      const tooltip = document.createElement("div");
      tooltip.innerHTML = info.event.extendedProps.description;
      tooltip.className = "tooltip";
      info.el.appendChild(tooltip);
    }
  });

  calendar.render();
}

}
