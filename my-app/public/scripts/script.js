// List of subjects
const subjects = [
    "PSD",
    "Data Fundamentals",
    "Systems Programming",
    "Operating Systems",
    "Programming Languages",
    "Networked Systems",
    "Cyber Fundamentals"
  ];
  
  
  // DOM references
  const subjectsContainer = document.getElementById("subjects-container");
  const subjectTemplate = document.getElementById("subject-template");
  const taskTemplate = document.getElementById("task-template");
  const overallProgress = document.getElementById("overallProgress");
  
  // Load from localStorage or start fresh
  let revisionData = JSON.parse(localStorage.getItem("revisionData")) || {};
  
  // Setup greeting
  const greeting = document.getElementById("greeting");
  const hour = new Date().getHours();
  const timeOfDay =
    hour > 4 && hour < 12 ? "Good morning" : hour >= 12 && hour <= 18 ? "Good afternoon" : "Good evening";
  greeting.textContent = `${timeOfDay}, Ollie`;

  
  // Initialise the tracker
  function init() {
    subjects.forEach((subject) => {
      if (!revisionData[subject]) revisionData[subject] = [];
      const subjectClone = subjectTemplate.content.cloneNode(true);
      const section = subjectClone.querySelector(".subject");
      const title = subjectClone.querySelector(".subject-title");
      const taskList = subjectClone.querySelector(".task-list");
      const addTaskBtn = subjectClone.querySelector(".add-task");
      const progressBar = subjectClone.querySelector(".progress-bar");
  
      title.querySelector(".subject-name").textContent = subject;
      
      addTaskBtn.addEventListener("click", () => {
        const task = createTask(subject);
        taskList.appendChild(task);
        saveData();
        updateProgress();
      });
  
      revisionData[subject].forEach((taskData) => {
        const task = createTask(subject, taskData);
        taskList.appendChild(task);
      });
  
      section.dataset.subject = subject;
      section.querySelector(".progress-bar").value = getSubjectProgress(subject);
      subjectsContainer.appendChild(section);
    });
  
    updateProgress();
  }
  
  // Create a task element
  function createTask(subject, taskData = { note: "", date: "", complete: false }) {
    const task = taskTemplate.content.cloneNode(true);
    const taskDiv = task.querySelector(".task");
    const checkbox = task.querySelector(".task-complete");
    const note = task.querySelector(".task-note");
    const date = task.querySelector(".task-date");
  
    checkbox.checked = taskData.complete;
    note.value = taskData.note;
    date.value = taskData.date;
  
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-task");
    deleteBtn.addEventListener("click", () => {
      taskDiv.remove();
      const allTasks = [...document.querySelectorAll(
        `[data-subject='${subject}'] .task`
      )].map((taskEl) => {
        return {
          complete: taskEl.querySelector(".task-complete").checked,
          note: taskEl.querySelector(".task-note").value,
          date: taskEl.querySelector(".task-date").value,
        };
      });
      revisionData[subject] = allTasks;
      saveData();
      updateProgress();
    });
  
    taskDiv.appendChild(deleteBtn);
  
    const update = () => {
      const allTasks = [...document.querySelectorAll(
        `[data-subject='${subject}'] .task`
      )].map((taskEl) => {
        return {
          complete: taskEl.querySelector(".task-complete").checked,
          note: taskEl.querySelector(".task-note").value,
          date: taskEl.querySelector(".task-date").value,
        };
      });
      revisionData[subject] = allTasks;
      saveData();
      updateProgress();
    };
  
    checkbox.addEventListener("change", update);
    note.addEventListener("input", update);
    date.addEventListener("input", update);
  
    return task;
  }
  
  function getSubjectProgress(subject) {
    const tasks = revisionData[subject];
    if (!tasks.length) return 0;
    const completed = tasks.filter((t) => t.complete).length;
    return Math.round((completed / tasks.length) * 100);
  }
  
  function updateProgress() {
    let totalTasks = 0;
    let totalCompleted = 0;
  
    subjects.forEach((subject) => {
      const progress = getSubjectProgress(subject);
  
      // Update the subject's progress bar
      const bar = document.querySelector(`[data-subject='${subject}'] .progress-bar`);
      if (bar) bar.value = progress;
  
      // Update the "0% Complete" text under subject title
      const percentageSpan = document.querySelector(
        `[data-subject='${subject}'] .subject-percentage`
      );
      if (percentageSpan) percentageSpan.textContent = `${progress}% Complete`;
  
      // ✅ Update the number beside the inline progress bar
      const percentLabel = document.querySelector(
        `[data-subject='${subject}'] .subject-inline-percentage`
      );
      if (percentLabel) percentLabel.textContent = `${progress}%`;
  
      // Update total progress tracking
      const tasks = revisionData[subject];
      totalTasks += tasks.length;
      totalCompleted += tasks.filter((t) => t.complete).length;
    });
  
    // ✅ Update the overall progress bar and its label
    const overall = totalTasks ? ((totalCompleted / totalTasks) * 100).toFixed(1) : "0.0";
    overallProgress.value = overall;
  
    const overallLabel = document.getElementById("overall-percentage");
    if (overallLabel) overallLabel.textContent = `${overall}%`;
  }
  
  
  function saveData() {
    localStorage.setItem("revisionData", JSON.stringify(revisionData));
  }
  
  init();
  