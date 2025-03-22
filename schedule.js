// Load from localStorage
const revisionData = JSON.parse(localStorage.getItem("revisionData")) || {};
const container = document.getElementById("schedule-container");

// Flatten all tasks with date info
let allTasks = [];
Object.entries(revisionData).forEach(([subject, tasks]) => {
  tasks.forEach((task) => {
    if (task.date) {
      allTasks.push({
        subject,
        ...task,
      });
    }
  });
});

// Sort by date ascending
allTasks.sort((a, b) => new Date(a.date) - new Date(b.date));

// Group tasks by date
const tasksByDate = {};
allTasks.forEach((task) => {
  if (!tasksByDate[task.date]) {
    tasksByDate[task.date] = [];
  }
  tasksByDate[task.date].push(task);
});

// Render each date section
Object.entries(tasksByDate).forEach(([date, tasks]) => {
  const allDone = tasks.every((task) => task.complete);
  if (allDone) return; // ⬅️ Skip fully completed days

  const section = document.createElement("section");
  section.className = "schedule-day";

  const dateHeading = document.createElement("h2");
  const dateObj = new Date(date + "T00:00");
  dateHeading.textContent = dateObj.toLocaleDateString("en-UK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const list = document.createElement("div");
  list.className = "task-list";

  tasks.forEach((task) => {
    const taskEl = document.createElement("div");
    taskEl.className = "schedule-task";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.complete;
    checkbox.className = "schedule-checkbox";

    const label = document.createElement("span");
    label.innerHTML = `<strong>${task.subject}:</strong> ${task.note}`;

    checkbox.addEventListener("change", () => {
      task.complete = checkbox.checked;

      const subjectTasks = revisionData[task.subject];
      const match = subjectTasks.find((t) => t.date === task.date && t.note === task.note);
      if (match) match.complete = task.complete;

      localStorage.setItem("revisionData", JSON.stringify(revisionData));
      location.reload(); // Reload to re-check for fully done days
    });

    taskEl.appendChild(checkbox);
    taskEl.appendChild(label);
    list.appendChild(taskEl);
  });

  section.appendChild(dateHeading);
  section.appendChild(list);
  container.appendChild(section);
});
  