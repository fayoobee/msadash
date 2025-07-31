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

// Toggle night mode + switch logos
document.getElementById("toggle-mode").addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  const logo = document.getElementById("logo");
  logo.src = document.body.classList.contains("night-mode")
    ? "msa_logo_white.png"
    : "msa_logo.png";
});

// Helper to fetch CSV and parse rows
function loadCSV(url, callback) {
  fetch(url)
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").map(row => {
        // Respect commas inside quotes
        const values = [];
        let insideQuote = false;
        let current = '';
        for (const char of row) {
          if (char === '"') insideQuote = !insideQuote;
          else if (char === ',' && !insideQuote) {
            values.push(current.trim());
            current = '';
          } else {
            current += char;
          }
        }
        values.push(current.trim());
        return values;
      });
      callback(rows);
    });
}

// Load Tasks from Sheet
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vRlIhPrQcMZgTxrn8iNI5tVgLhpdph4w_bQshFWV3s5ui5LD2JYu2N9ix9_wBdcf3MxPcaHf56vDFzI/pub?gid=887791163&single=true&output=csv", rows => {
  const container = document.getElementById("task-container");
  container.innerHTML = "";
  const headers = rows[0];
  const tasksByDept = {};

  rows.slice(1).forEach(row => {
    const taskObj = {};
    headers.forEach((header, i) => taskObj[header] = row[i]);
    const dept = taskObj["Department"] || "Other";
    if (!tasksByDept[dept]) tasksByDept[dept] = [];
    tasksByDept[dept].push(taskObj);
  });

  for (const dept in tasksByDept) {
    const section = document.createElement("div");
    section.innerHTML = `<h4>${dept}</h4>`;
    tasksByDept[dept].forEach(task => {
      section.innerHTML += `
        <div class="task-card">
          <strong>${task["Task Name"]}</strong><br>
          Assigned to: ${task["Assigned To"]}<br>
          Due: ${task["Due Date"]}<br>
          Progress: ${task["Progress"]}
        </div>
      `;
    });
    container.appendChild(section);
  }
});

// Load Countdowns from Sheet
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vRlIhPrQcMZgTxrn8iNI5tVgLhpdph4w_bQshFWV3s5ui5LD2JYu2N9ix9_wBdcf3MxPcaHf56vDFzI/pub?gid=1268651007&single=true&output=csv", rows => {
  const container = document.getElementById("countdowns");
  container.innerHTML = "";
  rows.slice(1).forEach(([event, dateStr]) => {
    const daysLeft = Math.ceil((new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24));
    const div = document.createElement("div");
    div.textContent = `${event}: ${daysLeft} day(s) remaining`;
    container.appendChild(div);
  });
});

// Load Team Roles from Sheet
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vRlIhPrQcMZgTxrn8iNI5tVgLhpdph4w_bQshFWV3s5ui5LD2JYu2N9ix9_wBdcf3MxPcaHf56vDFzI/pub?gid=1103280760&single=true&output=csv", rows => {
  const container = document.getElementById("team-roles");
  container.innerHTML = "";
  rows.slice(1).forEach(([name, role]) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${name}</strong>: ${role}`;
    container.appendChild(div);
  });
});
