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
