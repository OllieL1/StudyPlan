function formatTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  } else {
    return `${mins}m`;
  }
}

const totalTimeDisplay = document.getElementById("total-time");
const sessionList = document.getElementById("session-list");

const sessions = JSON.parse(localStorage.getItem("studySessions")) || [];

if (sessions.length === 0) {
  sessionList.innerHTML = "<p>No study sessions logged yet.</p>";
} else {
  let totalMinutes = 0;

  // Reverse to show most recent first
  sessions.reverse().forEach((session) => {
    totalMinutes += session.duration;

    const container = document.createElement("div");
    container.className = "session-entry";

    const date = new Date(session.start);
    const dateStr = date.toLocaleDateString("en-UK", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("en-UK", {
      hour: "2-digit",
      minute: "2-digit",
    });

    container.innerHTML = `
    <div class="session-header">
        <h3>${session.topic}</h3>
        <button class="delete-session" title="Delete Session">×</button>
    </div>
    <p><strong>Location:</strong> ${session.location}</p>
    <p><strong>Duration:</strong> ${formatTime(session.duration)}</p>
    <p><strong>Date:</strong> ${dateStr} at ${timeStr}</p>
    `;

    const deleteBtn = container.querySelector(".delete-session");
    deleteBtn.addEventListener("click", () => {
        // Find the index in the original (non-reversed) array
        const originalIndex = sessions.length - 1 - sessionList.childNodes.length + Array.from(sessionList.childNodes).indexOf(container);
        const storedSessions = JSON.parse(localStorage.getItem("studySessions")) || [];
        storedSessions.splice(originalIndex, 1);
        localStorage.setItem("studySessions", JSON.stringify(storedSessions));
        location.reload(); // Refresh to re-render
    });



    sessionList.appendChild(container);
  });

  totalTimeDisplay.textContent = `Total Time Studied: ${formatTime(totalMinutes)}`;
}
