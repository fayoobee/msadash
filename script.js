document.getElementById("toggle-mode").addEventListener("click", () => {
  document.body.classList.toggle("night-mode");
  document.getElementById("logo").src = document.body.classList.contains("night-mode")
    ? "msa_logo_white.png"
    : "msa_logo.png";
});

// Collapse behavior
document.querySelectorAll(".collapsible").forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const content = btn.nextElementSibling;
    content.style.display = content.style.display === "block" ? "none" : "block";
  });
});

// CSV loader helper
function loadCSV(url, callback) {
  fetch(url)
    .then(res => res.text())
    .then(text => {
      const rows = text.trim().split("\n").map(row => {
        const values = [];
        let insideQuotes = false, cell = "";
        for (let char of row) {
          if (char === '"') insideQuotes = !insideQuotes;
          else if (char === "," && !insideQuotes) {
            values.push(cell.trim());
            cell = "";
          } else cell += char;
        }
        values.push(cell.trim());
        return values;
      });
      callback(rows);
    });
}

// Load Tasks into Calendar
const tasksCSV = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=31970795&single=true&output=csv";

loadCSV(tasksCSV, rows => {
  const headers = rows[0].map(h => h.trim().toLowerCase());
  const titleIdx = headers.indexOf("task name");
  const dueDateIdx = headers.indexOf("due date");

  const events = rows.slice(1).map(row => ({
    title: row[titleIdx],
    date: row[dueDateIdx]
  }));

  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    height: "auto",
    events: events,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,listWeek'
    }
  });
  calendar.render();
});
