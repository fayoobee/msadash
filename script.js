// === Load TASKS with Details and Category ===
loadCSV("https://docs.google.com/spreadsheets/d/e/2PACX-1vSGgYOn6rf3TCHQ0IWTBuGtjxLGNrSIgcXoxnOGT8bKN6c4BRmULTI-A7alSK1XtJVMFsFS3MEuKcs9/pub?gid=31970795&single=true&output=csv", rows => {
  const container = document.getElementById("task-container");
  container.innerHTML = "";
  const headers = rows[0].map(h => h.trim().toLowerCase());

  const taskNameIdx = headers.indexOf("task name");
  const assignedToIdx = headers.indexOf("assigned to");
  const dueDateIdx = headers.indexOf("due date");
  const progressIdx = headers.indexOf("progress");
  const deptIdx = headers.indexOf("department");
  const detailsIdx = headers.indexOf("details");
  const categoryIdx = headers.indexOf("category");

  const tasksByDept = {};

  rows.slice(1).forEach(row => {
    const dept = row[deptIdx] || "Other";
    if (!tasksByDept[dept]) tasksByDept[dept] = [];
    tasksByDept[dept].push({
      task: row[taskNameIdx] || "No Task",
      assignedTo: row[assignedToIdx] || "Unassigned",
      due: row[dueDateIdx] || "No Due Date",
      progress: row[progressIdx] || "Not started",
      details: row[detailsIdx] || "No details",
      category: row[categoryIdx] || "Uncategorized"
    });
  });

  for (const dept in tasksByDept) {
    const section = document.createElement("div");
    section.innerHTML = `<h4>${dept}</h4>`;
    tasksByDept[dept].forEach(task => {
      section.innerHTML += `
        <div class="task-card">
          <strong>${task.task}</strong><br>
          <em>Category:</em> ${task.category}<br>
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
