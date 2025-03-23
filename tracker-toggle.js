let studyStart = null;
const toggleBtn = document.getElementById("study-toggle");
const modal = document.getElementById("study-modal");
const confirmBtn = document.getElementById("confirm-session");
const cancelBtn = document.getElementById("cancel-session");

// Check localStorage for tracker state
const storedState = JSON.parse(localStorage.getItem("studyActive"));
if (storedState?.active) {
  studyStart = new Date(storedState.start);
  toggleBtn.classList.add("active");
  toggleBtn.classList.add("green");
}

// Toggle logic
toggleBtn.addEventListener("click", () => {
  if (toggleBtn.classList.contains("active")) {
    // Stop studying
    toggleBtn.classList.remove("active", "green");
    modal.classList.remove("hidden");

    // Clear state temporarily
    localStorage.removeItem("studyActive");
  } else {
    // Start studying
    studyStart = new Date();
    toggleBtn.classList.add("active", "green");

    // Save to localStorage
    localStorage.setItem("studyActive", JSON.stringify({
      active: true,
      start: studyStart.toISOString()
    }));
  }
});

// Cancel modal
cancelBtn.addEventListener("click", () => {
  modal.classList.add("hidden");

  // Restart tracker in case of cancel
  toggleBtn.classList.add("active", "green");
  localStorage.setItem("studyActive", JSON.stringify({
    active: true,
    start: studyStart.toISOString()
  }));
});

// Confirm session
confirmBtn.addEventListener("click", () => {
  const studyLocation = document.getElementById("study-location").value;
  const topic = document.getElementById("study-topic").value.trim();
  const end = new Date();

  if (!studyStart || !topic) return alert("Please provide what you studied.");

  const duration = Math.round((end - studyStart) / 60000); // in minutes

  const session = {
    start: studyStart.toISOString(),
    end: end.toISOString(),
    duration,
    location : studyLocation,
    topic,
  };

  const stored = JSON.parse(localStorage.getItem("studySessions")) || [];
  stored.push(session);
  localStorage.setItem("studySessions", JSON.stringify(stored));

  // Reset everything
  modal.classList.add("hidden");
  studyStart = null;
  localStorage.removeItem("studyActive");
  toggleBtn.classList.remove("active", "green");
  document.getElementById("study-topic").value = "";

  if (window.location.pathname.includes("tracker.html")) {
    location.reload();
  }  
});
