const subjectList = [
  "PSD",
  "Data Fundamentals",
  "Systems Programming",
  "Operating Systems",
  "Programming Languages",
  "Networked Systems",
  "Cyber Fundamentals"
];

let studyStart = null;

const toggleBtn = document.getElementById("study-toggle");
const modal = document.getElementById("study-modal");
const confirmBtn = document.getElementById("confirm-session");
const cancelBtn = document.getElementById("cancel-session");

const subjectOptions = document.getElementById("subject-options");
const multiTimeInputs = document.getElementById("multi-time-inputs");
const sessionLengthDisplay = document.getElementById("session-duration");

// Render subject checkboxes
subjectList.forEach(sub => {
  const label = document.createElement("label");
  label.className = "subject-option";

  const input = document.createElement("input");
  input.type = "checkbox";
  input.value = sub;
  input.name = "subject";

  label.appendChild(input);
  label.append(` ${sub}`);
  subjectOptions.appendChild(label);
});

// Restore active session if previously started
const storedState = JSON.parse(localStorage.getItem("studyActive"));
if (storedState?.active) {
  studyStart = new Date(storedState.start);
  toggleBtn.classList.add("active", "green");
}

// START session
toggleBtn.addEventListener("click", () => {
  if (toggleBtn.classList.contains("active")) {
    toggleBtn.classList.remove("active", "green");

    const duration = Math.round((new Date() - studyStart) / 60000);
    sessionLengthDisplay.textContent = `Total session duration: ${duration} min`;

    modal.classList.remove("hidden");
    localStorage.removeItem("studyActive");
  } else {
    studyStart = new Date();
    toggleBtn.classList.add("active", "green");
    localStorage.setItem("studyActive", JSON.stringify({ active: true, start: studyStart.toISOString() }));
  }
});

// CANCEL modal
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");
  toggleBtn.classList.add("active", "green");
  localStorage.setItem("studyActive", JSON.stringify({ active: true, start: studyStart.toISOString() }));
});

// WATCH subject checkboxes for multiple selection
subjectOptions.addEventListener("change", () => {
  const selected = [...document.querySelectorAll("input[name='subject']:checked")];
  multiTimeInputs.innerHTML = "";

  if (selected.length > 1) {
    multiTimeInputs.classList.remove("hidden");

    selected.forEach(input => {
      const div = document.createElement("div");
      div.className = "time-entry";

      div.innerHTML = `
        <label>${input.value} Time (hh:mm): 
          <input type="time" class="subject-time" data-subject="${input.value}" required>
        </label>
      `;
      multiTimeInputs.appendChild(div);
    });
  } else {
    multiTimeInputs.classList.add("hidden");
  }
});

// CONFIRM session
confirmBtn.addEventListener("click", () => {
  const locationInput = document.getElementById("study-location").value;
  const topic = document.getElementById("study-topic").value.trim();
  const selectedSubjects = [...document.querySelectorAll("input[name='subject']:checked")].map(i => i.value);
  const end = new Date();
  const duration = Math.round((end - studyStart) / 60000); // in minutes

  if (!studyStart) return alert("Study session not started.");
  if (!selectedSubjects.length) return alert("Please select at least one subject.");
  if (!topic) return alert("Please enter what you studied.");

  const session = {
    start: studyStart.toISOString(),
    end: end.toISOString(),
    duration,
    location: locationInput,
    topic,
    subjects: []
  };

  if (selectedSubjects.length === 1) {
    session.subjects.push({ name: selectedSubjects[0], time: duration });
  } else {
    const inputs = document.querySelectorAll(".subject-time");
    let totalInputTime = 0;

    inputs.forEach(input => {
      const timeVal = input.value;
      const [hrs, mins] = timeVal.split(":").map(Number);
      const total = hrs * 60 + mins;
      totalInputTime += total;

      session.subjects.push({ name: input.dataset.subject, time: total });
    });

    if (totalInputTime !== duration) {
      const confirmMismatch = confirm(`You entered ${totalInputTime} min, but total was ${duration} min. Continue?`);
      if (!confirmMismatch) return;
    }
  }

  // Save to localStorage
  const stored = JSON.parse(localStorage.getItem("studySessions")) || [];
  stored.push(session);
  localStorage.setItem("studySessions", JSON.stringify(stored));

  // Cleanup
  modal.classList.add("hidden");
  studyStart = null;
  localStorage.removeItem("studyActive");
  toggleBtn.classList.remove("active", "green");
  document.getElementById("study-topic").value = "";

  // Reload tracker.html if on that page
  if (window.location.pathname.includes("tracker.html") || window.location.pathname.includes("progress.html")) {
    location.reload();
  }
});
