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

// Toggle night mode and switch logo
document.getElementById("toggle-mode").addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  const logo = document.getElementById("logo");
  logo.src = document.body.classList.contains("night-mode")
    ? "msa_logo_white.png"
    : "msa_logo.png";
});

// Helper to fetch and parse CSV
function loadCSV(url, callback) {
  fetch(url)
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").map(row => {
        const values = [];
        let insideQuotes = false, cell = '';
        for (let char of row) {
          if (char === '"') insideQuotes = !insideQuotes;
          else if (char === ',' && !insideQuotes) {
            values.push(cell.trim());
            cell = '';
          } else cell += char;
        }
        values.push(cell.trim());
        return values;
      });
      callback(rows);
    });
}

// === Load TASKS ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=31970795&single=true&output=csv", rows => {
  const container = document.getElementById("task-container");
  container.innerHTML = "";
  const headers = rows[0].map(h => h.trim().toLowerCase());

  const idx = name => headers.indexOf(name.toLowerCase());

  const groupByCycle = {};

  rows.slice(1).forEach((row, i) => {
    const cycle = row[idx("Cycle")] || "Uncategorized";
    if (!groupByCycle[cycle]) groupByCycle[cycle] = [];
    groupByCycle[cycle].push({ row, index: i });
  });

  for (const cycle in groupByCycle) {
    const section = document.createElement("div");
    section.innerHTML = `<h4>${cycle}</h4>`;

    groupByCycle[cycle].forEach(({ row, index }) => {
      const priority = (row[idx("Priority")] || "").toLowerCase();
      let badgeClass = "";
      if (priority === "high") badgeClass = "priority-high";
      else if (priority === "medium") badgeClass = "priority-medium";
      else if (priority === "low") badgeClass = "priority-low";

      const card = document.createElement("div");
      card.className = `task-card ${index % 2 === 0 ? "even" : "odd"}`;
      card.innerHTML = `
        <strong>${row[idx("Task Name")]}</strong><br>
        <em>Category:</em> ${row[idx("Category")]}<br>
        Assigned to: ${row[idx("Assigned To")]}<br>
        Due: ${row[idx("Due Date")]}<br>
        Progress: ${row[idx("Progress")]}<br>
        Cycle: ${row[idx("Cycle")]}<br>
        <em>Details:</em> ${row[idx("Details")]}<br>
        <span class="priority-badge ${badgeClass}">Priority: ${priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
      `;
      section.appendChild(card);
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
    div.textContent = `${event}: ${daysLeft} day(s) remaining`;
    container.appendChild(div);
  });
});

// === Load TEAM ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=553348135&single=true&output=csv", rows => {
  const container = document.getElementById("team-roles");
  container.innerHTML = "";
  rows.slice(1).forEach(([name, role]) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${name}</strong>: ${role}`;
    container.appendChild(div);
  });
});

// === Quick Links ===
const links = [
  ["📸 LensBridge", "https://www.lensbridge.tech/"],
  ["📒 MSA Notion", "https://www.notion.so/utmmsa2023-24/25-26-20793a1f50b3802fa699ea4681c955b5"],
  ["🧠 Marketing Notion", "https://www.notion.so/utmmsa2023-24/Marketing-20793a1f50b38177a868e8bf46ba31ad"],
  ["📅 UTM Important Dates", "https://www.utm.utoronto.ca/registrar/dates"],
  ["📆 Shared Marketing Calendar", "https://calendar.google.com/calendar/u/0?cid=MWQwNDI2ODYwNzkwZWE5ODk1ZGQ3OWZjZTk5MTg0MmFlOWFhNDkyODM1NDJiNzJmMzg2MzJjM2Y3OWZmYjI5ZkBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"]
];
const quickLinksContainer = document.getElementById("quick-links");
quickLinksContainer.innerHTML = links.map(([text, url]) => `<a class="link-button" href="${url}" target="_blank">${text}</a>`).join("");
