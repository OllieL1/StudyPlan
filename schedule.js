// Load from localStorage
const revisionData = JSON.parse(localStorage.getItem("revisionData")) || {};
const container = document.getElementById("schedule-container");

function shiftTaskDate(task, dayDelta) {
  const subjectTasks = revisionData[task.subject];
  const match = subjectTasks.find((t) => t.date === task.date && t.note === task.note);

  if (match) {
    const oldDate = new Date(task.date);
    const newDate = new Date(task.date);
    newDate.setDate(newDate.getDate() + dayDelta);
    newDate.setHours(newDate.getHours()+1)
    console.log(oldDate)
    console.log(newDate.toISOString());
    match.date = newDate.toISOString().split("T")[0];
    localStorage.setItem("revisionData", JSON.stringify(revisionData));
    location.reload();
  }
}


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
  
    // Move buttons container
    const moveButtons = document.createElement("div");
    moveButtons.className = "task-move-buttons";
  
    const moveUp = document.createElement("button");
    moveUp.textContent = "▲";
    moveUp.className = "move-up";
    moveUp.title = "Move to previous day";
  
    const moveDown = document.createElement("button");
    moveDown.textContent = "▼";
    moveDown.className = "move-down";
    moveDown.title = "Move to next day";
  
    moveButtons.appendChild(moveUp);
    moveButtons.appendChild(moveDown);
  
    moveUp.addEventListener("click", () => shiftTaskDate(task, -1));
    moveDown.addEventListener("click", () => shiftTaskDate(task, 1));
  
    checkbox.addEventListener("change", () => {
      task.complete = checkbox.checked;
  
      const subjectTasks = revisionData[task.subject];
      const match = subjectTasks.find((t) => t.date === task.date && t.note === task.note);
      if (match) match.complete = task.complete;
  
      localStorage.setItem("revisionData", JSON.stringify(revisionData));
      location.reload(); // Refresh to re-check for fully done days
    });
  
    taskEl.appendChild(checkbox);
    taskEl.appendChild(label);
    taskEl.appendChild(moveButtons);
    list.appendChild(taskEl);
  });
  

  section.appendChild(dateHeading);
  section.appendChild(list);
  container.appendChild(section);
});
  