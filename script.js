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
  logo.src = document.body.classList.contains("night-mode")
    ? "msa_logo_white.png"
    : "msa_logo.png";
});

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

loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=31970795&single=true&output=csv", rows => {
  const container = document.getElementById("task-container");
  container.innerHTML = "";
  const headers = rows[0].map(h => h.trim().toLowerCase());

  const idx = name => headers.indexOf(name);

  const tasksByCycle = {};

  rows.slice(1).forEach(row => {
    const cycle = row[idx("cycle")] || "Unassigned Cycle";
    if (!tasksByCycle[cycle]) tasksByCycle[cycle] = [];
    tasksByCycle[cycle].push({
      task: row[idx("task name")],
      assignedTo: row[idx("assigned to")],
      due: row[idx("due date")],
      progress: row[idx("progress")],
      dept: row[idx("department")],
      details: row[idx("details")],
      category: row[idx("category")],
      priority: row[idx("priority")]
    });
  });

  for (const cycle in tasksByCycle) {
    const section = document.createElement("div");
    section.innerHTML = `<h4>${cycle}</h4>`;
    tasksByCycle[cycle].forEach(task => {
      section.innerHTML += `
        <div class="task-card">
          <strong>${task.task}</strong><br>
          <em>Department:</em> ${task.dept}<br>
          <em>Category:</em> ${task.category} | <strong>Priority:</strong> ${task.priority}<br>
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

loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=553348135&single=true&output=csv", rows => {
  const container = document.getElementById("team-roles");
  container.innerHTML = "";
  rows.slice(1).forEach(([name, role]) => {
    const div = document.createElement("div");
    div.innerHTML = `👤 <strong>${name}</strong>: ${role}`;
    container.appendChild(div);
  });
});
