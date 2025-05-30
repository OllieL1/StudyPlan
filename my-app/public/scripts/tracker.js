const sessions = JSON.parse(localStorage.getItem("studySessions")) || [];
const sessionList = document.getElementById("session-list");
const totalTimeDisplay = document.getElementById("total-time");
const itemsPerPage = 10;
let currentPage = 1;

function formatTime(minutes) {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
}

function renderSessions(page) {
  sessionList.innerHTML = "";
  const totalMinutes = sessions
    .flatMap(s => s.subjects || [])
    .reduce((sum, s) => sum + s.time, 0);

  totalTimeDisplay.textContent = `Total Time Studied: ${formatTime(totalMinutes)}`;

  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginated = [...sessions].reverse().slice(start, end);

  paginated.forEach((session) => {
    const container = document.createElement("div");
    container.className = "session-entry";

    const date = new Date(session.start);
    const dateStr = date.toLocaleDateString("en-UK", {
      day: "numeric", month: "long", year: "numeric"
    });
    const timeStr = date.toLocaleTimeString("en-UK", {
      hour: "2-digit", minute: "2-digit"
    });

    const total = formatTime(session.duration);

    container.innerHTML = `
      <div class="session-header">
        <h3>${session.topic}</h3>
        <button class="delete-session" title="Delete Session">×</button>
      </div>
      <p><strong>Location:</strong> ${session.location}</p>
      <p><strong>Duration:</strong> ${total}</p>
      <p><strong>Date:</strong> ${dateStr} at ${timeStr}</p>
    `;

    const deleteBtn = container.querySelector(".delete-session");
    deleteBtn.addEventListener("click", () => {
      const originalIndex = sessions.length - start - paginated.indexOf(session) - 1;
      sessions.splice(originalIndex, 1);
      localStorage.setItem("studySessions", JSON.stringify(sessions));
      renderSessions(currentPage);
    });

    sessionList.appendChild(container);
  });
  renderPagination();
}

function renderPagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const totalPages = Math.ceil(sessions.length / itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active-page" : "";
    btn.addEventListener("click", () => {
      currentPage = i;
      renderSessions(currentPage);
    });
    pagination.appendChild(btn);
  }
}

function renderDailyView() {
  const dailyView = document.getElementById("daily-view");
  dailyView.innerHTML = "";

  const grouped = {};

  sessions.forEach(session => {
    const dateKey = new Date(session.start).toLocaleDateString("en-CA");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    grouped[dateKey].push(session);
  });

  const sortedDates = Object.keys(grouped).sort().reverse();

  sortedDates.forEach(date => {
    const sessionsOnDate = grouped[date];

    let totalMinutes = 0;
    const subjectMap = {};

    sessionsOnDate.forEach(session => {
      session.subjects?.forEach(({ name, time }) => {
        totalMinutes += time;
        subjectMap[name] = (subjectMap[name] || 0) + time;
      });
    });

    const container = document.createElement("div");
    container.className = "daily-entry";

    container.innerHTML = `
      <h3>${new Date(date).toLocaleDateString("en-UK", { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}</h3>
      <p><strong>Total:</strong> ${formatTime(totalMinutes)}</p>
    `;

    const list = document.createElement("ul");
    for (const [subject, time] of Object.entries(subjectMap)) {
      if (time > 0) {
        const li = document.createElement("li");
        li.textContent = `${subject}: ${formatTime(time)}`;
        list.appendChild(li);
      }
    }

    container.appendChild(list);
    dailyView.appendChild(container);
  });
}

const dailyBtn = document.getElementById("toggle-daily-view");
const pagination = document.getElementById("pagination");
const dailyView = document.getElementById("daily-view");

let dailyMode = false;

dailyBtn.addEventListener("click", () => {
  dailyMode = !dailyMode;

  if (dailyMode) {
    // Switch to daily view
    sessionList.classList.add("hidden");
    pagination.classList.add("hidden");
    dailyView.classList.remove("hidden");
    dailyBtn.textContent = "Toggle Tracker View";
    renderDailyView(); // Populate daily view
  } else {
    // Switch to task view
    sessionList.classList.remove("hidden");
    pagination.classList.remove("hidden");
    dailyView.classList.add("hidden");
    dailyBtn.textContent = "Toggle Daily View";
  }
});




renderSessions(currentPage);
